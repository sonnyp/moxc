import React, {Component} from 'react'
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native'

// import {ListItem} from 'react-native-elements'

import {disco, adHoc, xmpp, online} from '../xmpp'
import {formToReactNative} from '../data-forms'

import Router from 'next/router'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    fontSize: 24,
  },
})

export default class ServiceDiscoveryBrowser extends Component {
  state = {
    command: null,
  }

  static async getInitialProps({query}) {
    const {address, node} = query

    await online()

    const info = (await disco.info(address, node)).children

    const features = info
      .filter(({name}) => name === 'feature')
      .map(({attrs}) => attrs.var)

    const identities = info
      .filter(({name}) => name === 'identity')
      .map(({attrs}) => attrs)

    const items = (await disco.items(address, node)).children

    let commands = []
    if (features.includes('http://jabber.org/protocol/commands')) {
      commands = (await adHoc.getCommands(address)).children
    }

    return {address: address || '', features, identities, items, commands}
  }

  onPressDiscoItem = async item => {
    const query = {address: item.attrs.jid}
    if (item.attrs.node) query.node = item.attrs.node

    Router.push({
      pathname: '/',
      query,
    })
  }

  onPressCommand = async command => {
    const {jid, node} = command.attrs
    const commandEl = await adHoc.execute(jid, node)
    const {status, sessionid} = commandEl.attrs
    const formEl = commandEl.getChild('x', 'jabber:x:data')
    const actionsEl = commandEl.getChild('actions')

    // Router.push({
    //   pathname: '/',
    //   query: {
    //     address: jid,
    //     command: node,
    //   },
    // })

    if (!formEl) {
      alert(commandEl.getChildText('note'))
      return
    }

    this.setState({command: commandEl})
  }

  render() {
    const {items, features, identities, commands} = this.props
    const {command} = this.state

    return (
      <View style={{...styles.container, flexDirection: 'row'}}>
        <View style={{...styles.container, width: 200}}>
          <View style={styles.container}>
            <Text style={styles.header}>Identities</Text>
            {identities.map((keys, idx) => {
              return (
                <View key={idx}>
                  {Object.entries(keys).map(([key, value]) => {
                    return <Text key={key}>{`${key}: ${value}`}</Text>
                  })}
                </View>
              )
            })}
          </View>
          <View style={styles.container}>
            <Text style={styles.header}>Items</Text>
            {items.map(item => {
              const key = item.attrs.jid + '-' + item.attrs.node
              return (
                <TouchableHighlight
                  key={key}
                  onPress={() => this.onPressDiscoItem(item)}
                >
                  <View>
                    <Text>{item.attrs.jid}</Text>
                    <Text>{item.attrs.node}</Text>
                    <Text>{item.attrs.name}</Text>
                  </View>
                </TouchableHighlight>
              )
            })}
          </View>
          <View style={styles.container}>
            <Text style={styles.header}>Features</Text>
            {features.map(feature => {
              return <Text key={feature}>{feature}</Text>
            })}
          </View>
          <View style={styles.container}>
            <Text style={styles.header}>Commands</Text>
            {commands.map(item => {
              const key = item.attrs.jid + '-' + item.attrs.node
              return (
                <TouchableHighlight
                  key={key}
                  onPress={() => this.onPressCommand(item)}
                >
                  <View>
                    <Text>{item.attrs.jid}</Text>
                    <Text>{item.attrs.node}</Text>
                    <Text>{item.attrs.name}</Text>
                  </View>
                </TouchableHighlight>
              )
            })}
          </View>
        </View>
        <View style={{...styles.container}}>
          {!command ? null : formToReactNative(command.getChild('x'))}
        </View>
      </View>
    )
  }
}
