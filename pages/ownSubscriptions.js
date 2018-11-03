import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'
import PubsubSubscriptionsList from '../components/PubsubSubscriptionsList'

export default class OwnSubscriptions extends Component {
  state = {
    subscriptions: [],
  }

  static getInitialProps({query}) {
    return query
  }

  async componentDidMount() {
    await online()

    this.updateSubscriptions()
  }

  async updateSubscriptions() {
    const subscriptions = (await pubsub.getOwnSubscriptions(this.props))
      .children

    this.setState({
      subscriptions,
    })
  }

  render() {
    const {subscriptions} = this.state

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Subscriptions</Text>
        <PubsubSubscriptionsList subscriptions={subscriptions} />
      </View>
    )
  }
}
