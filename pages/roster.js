import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'

import {online, xml, pubsub, roster, Address} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'
// import PubsubNodesList from '../components/PubsubNodesList'

export default class Nodes extends Component {
  state = {
    items: [],
  }

  static getInitialProps({query}) {
    return query
  }

  async componentDidMount() {
    await online()

    this.fetchData()
  }

  async fetchData() {
    const res = await roster.get()
    if (!res.is('query')) return

    const items = res.children

    this.setState({
      items,
    })
  }

  render() {
    const {items} = this.state

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Roster</Text>
        {items.map(item => {
          const {jid, name} = item.attrs
          const address = Address(jid)
          const title = name || address.local
          return <ListItem key={jid} title={title} subtitle={jid} chevron />
        })}
      </View>
    )
  }
}
