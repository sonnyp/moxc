import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import styles from '../styles'

import DataForm from '../components/DataForm'

export default class Roster extends Component {
  static getInitialProps({query}) {
    const {node} = query
    return {node}
  }

  state = {
    form: null,
  }

  async componentDidMount() {
    await online()

    this.updateConfiguration()
  }

  async updateConfiguration() {
    const {node} = this.props

    this.setState({
      form: (await pubsub.configure({node}))
        .getChild('pubsub')
        .getChild('configure')
        .getChild('x', 'jabber:x:data'),
    })
  }

  render() {
    const {form} = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Configure</Text>
        <DataForm form={form} />
      </View>
    )
  }
}
