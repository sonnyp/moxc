import React from 'react'
import NextApp, {Container} from 'next/app'

import {ThemeProvider, Header, Icon} from 'react-native-elements'
import {Link} from '../routes'

import Modal from 'modal-react-native-web'

import Login from '../components/Login'

import {xmpp} from '../xmpp'

export default class App extends NextApp {
  static async getInitialProps({Component, router, ctx}) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  state = {
    loginVisible: xmpp.status === 'offline',
  }

  onLogin = ({address, password}) => {
    alert(address)
  }

  render() {
    const {Component, pageProps} = this.props
    const to = pageProps.to || 'foobar'

    return (
      <Container>
        <ThemeProvider>
          <Header
            centerComponent={{text: 'XMPP.js', style: {color: '#fff'}}}
            rightComponent={
              <Link route="pubsub" params={{to}}>
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
            visible={true}
            onDismiss={() => {
              alert('Modal has been closed.')
            }}
          >
            <Login onLogin={this.onLogin} />
          </Modal>
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    )
  }
}
