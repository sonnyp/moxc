import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'
import PubsubItemsList from '../components/PubsubItemsList'

export default class Items extends Component {
  static getInitialProps({query}) {
    return query
  }

  state = {
    items: [],
  }

  async componentDidMount() {
    await online()

    this.updateItems()
  }

  async updateItems() {
    this.setState({
      items: (await pubsub.items(this.props)).children,
    })
  }

  render() {
    const {items} = this.state

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Items</Text>
        <PubsubItemsList
          to={this.props.to}
          node={this.props.node}
          items={items}
        />
      </View>
    )
  }
}
