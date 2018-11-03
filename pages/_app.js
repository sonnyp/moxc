import React from 'react'
import NextApp, {Container} from 'next/app'

import {ThemeProvider, Header} from 'react-native-elements'

export default class App extends NextApp {
  static async getInitialProps({Component, router, ctx}) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  render() {
    const {Component, pageProps} = this.props

    return (
      <Container>
        <ThemeProvider>
          <Header
            // leftComponent={{icon: 'menu', color: '#fff'}}
            centerComponent={{text: 'XMPP.js', style: {color: '#fff'}}}
            rightComponent={{icon: 'home', color: '#fff'}}
          />
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    )
  }
}
