import React, {Component} from 'react'
import {View, Button, TextInput} from 'react-native'
import {Text} from 'react-native-elements'

import {online, xml, pubsub} from '../xmpp'
import styles from '../styles'
import {Router} from '../routes'

const NS_ATOM = 'http://www.w3.org/2005/Atom'

const service = undefined

export default class Publish extends Component {
  static getInitialProps({query}) {
    return query
  }

  state = {
    title: '',
    content: '',
  }

  componentDidMount() {
    online()
  }

  onPressCancel = () => {
    Router.pushRoute('node', this.props)
  }

  onPressPublish = async () => {
    const {title, content} = this.state

    const item = xml(
      'item',
      {},
      xml(
        'entry',
        {xmlns: NS_ATOM},
        xml('title', {}, title),
        xml('content', {}, content)
      )
    )

    const itemId = await pubsub.publish(this.props, item)

    Router.pushRoute('items', this.props)
  }

  render() {
    const {title, content} = this.state

    return (
      <View style={{...styles.container}}>
        <Text h1>Publish</Text>
        <Text>Title</Text>
        <TextInput
          onChangeText={title => this.setState({title})}
          value={title}
          style={styles.input}
        />
        <Text>Content</Text>
        <TextInput
          onChangeText={content => this.setState({content})}
          value={content}
          style={styles.input}
        />
        <View style={{flexDirection: 'row'}}>
          <Button onPress={this.onPressCancel} title="Cancel" />
          <Button onPress={this.onPressPublish} title="Publish" />
        </View>
      </View>
    )
  }
}
