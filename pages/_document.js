import Document, {Head, Main, NextScript} from 'next/document'
import React from 'react'
import {AppRegistry} from 'react-native-web'
import iconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf'

// Force Next-generated DOM elements to fill their parent's height
const normalizeNextElements = `
  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`

const materialIconsFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: 'MaterialIcons';
}`

export default class MyDocument extends Document {
  static async getInitialProps({renderPage}) {
    AppRegistry.registerComponent('Main', () => Main)
    const {getStyleElement} = AppRegistry.getApplication('Main')
    const page = renderPage()
    const styles = [
      <style dangerouslySetInnerHTML={{__html: normalizeNextElements}} />,
      <style dangerouslySetInnerHTML={{__html: materialIconsFontStyles}} />,
      getStyleElement(),
    ]
    return {...page, styles: React.Children.toArray(styles)}
  }

  render() {
    return (
      <html style={{height: '100%'}}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>{`a { color: inherit; text-decoration: inherit; }`}</style>
          <title>XMPP browser</title>
        </Head>
        <body style={{height: '100%'}}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
