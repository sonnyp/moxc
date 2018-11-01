import React, {Component} from 'react'
import {Text, View, Button, TextInput} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import styles from '../styles'
import {Router, Link} from '../routes'
import AtomEntry from '../components/AtomEntry'

const NS_ATOM = 'http://www.w3.org/2005/Atom'

export default class Item extends Component {
  static getInitialProps({query}) {
    return query
  }

  state = {
    entry: null,
  }

  async componentDidMount() {
    await online()

    const {item} = this.props

    const itemEl = await pubsub.item(this.props, item)
    if (!itemEl) return

    const entry = itemEl.getChild('entry', NS_ATOM)
    if (!entry) return

    this.setState({entry})
  }

  onPressRetract = async () => {
    const {item} = this.props
    await pubsub.retract(this.props, item)
    Router.pushRoute('items', this.props)
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
