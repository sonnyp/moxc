import React, {Component} from 'react'
import {Text, View, Button, TextInput} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import styles from '../styles'
import {Router} from '../routes'

const NS_ATOM = 'http://www.w3.org/2005/Atom'

const service = undefined

export default class Roster extends Component {
  static getInitialProps({query}) {
    const {node} = query
    return {node}
  }

  state = {
    title: '',
    content: '',
  }

  componentDidMount() {
    online()
  }

  onPressPublish = async () => {
    const {node} = this.props
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

    const itemId = await pubsub.publish({node}, item)

    Router.pushRoute('items', {node})
  }

  render() {
    const {title, content} = this.state

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Publish</Text>
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
        <Button onPress={this.onPressPublish} title={'Publish'} />
      </View>
    )
  }
}
