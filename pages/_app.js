import React from 'react'
import {AsyncStorage} from 'react-native'

import NextApp, {Container} from 'next/app'

import {ThemeProvider, Header, Icon, Text} from 'react-native-elements'
import {Link} from '../routes'

import Modal from 'modal-react-native-web'

import Login from '../components/Login'

import {xmpp, setCredentials} from '../xmpp'

export default class App extends NextApp {
  static async getInitialProps({Component, router, ctx}) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  state = {
    loginVisible: false,
    username: '',
    address: '',
  }

  async componentDidMount() {
    try {
      const credentials = JSON.parse(await AsyncStorage.getItem('credentials'))
      if (credentials) {
        await this.onLogin(credentials)
        return
      }
    } catch (err) {
      console.error(err)
    }
    this.setState({loginVisible: true})
  }

  async onLogin({address, password, trust, service}) {
    const [username, domain] = address.split('@')
    xmpp.options.service = service
    xmpp.options.domain = domain
    setCredentials({username, password})
    await xmpp.start()
    this.setState({
      loginVisible: false,
      username,
      address,
      domain,
    })
    if (trust) {
      try {
        await AsyncStorage.setItem(
          'credentials',
          JSON.stringify({address, password, service})
        )
      } catch (err) {
        console.error(err)
      }
    }
  }

  render() {
    const {Component, pageProps} = this.props
    const to = pageProps.to || 'foobar'
    const {address, loginVisible, username, domain} = this.state

    return (
      <Container>
        <ThemeProvider>
          <Header
            leftComponent={
              address && (
                <Link route="pubsub" params={{to: address}}>
                  <a>
                    <Text style={{color: 'white'}}>{username}</Text>
                  </a>
                </Link>
              )
            }
            centerComponent={{text: 'XMPP.js', style: {color: '#fff'}}}
            rightComponent={
              <Link route="pubsub" params={{to: domain || to}}>
                <a>
                  <Icon name="home" color="white" />
                </a>
              </Link>
            }
          />
          <Modal
            ariaHideApp={false}
            animationType="fade"
            transparent={true}
            visible={loginVisible}
          >
            <Login onLogin={this.onLogin} />
          </Modal>
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    )
  }
}
