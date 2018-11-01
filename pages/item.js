import React, {Component} from 'react'
import {Text, View, Button, TextInput} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import styles from '../styles'
import {Router, Link} from '../routes'
import AtomEntry from '../components/AtomEntry'

const NS_ATOM = 'http://www.w3.org/2005/Atom'

export default class Item extends Component {
  static getInitialProps({query}) {
    const {node, item} = query
    return {node, item}
  }

  state = {
    entry: null,
  }

  async componentDidMount() {
    await online()

    const {node, item} = this.props

    const itemEl = await pubsub.item({node}, item)
    if (!itemEl) return

    const entry = itemEl.getChild('entry', NS_ATOM)
    if (!entry) return

    this.setState({entry})
  }

  onPressRetract = async () => {
    const {node, item} = this.props
    await pubsub.retract({node}, item)
    Router.pushRoute('items', {node})
  }

  render() {
    const {entry} = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Item</Text>
        <AtomEntry entry={entry} />
        <Button onPress={this.onPressRetract} title={'Retract'} />
      </View>
    )
  }
}
