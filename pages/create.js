import React, {Component} from 'react'
import {Text, View, Button, TextInput} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import styles from '../styles'
import {Router} from '../routes'

const NS_ATOM = 'http://www.w3.org/2005/Atom'

export default class Roster extends Component {
  state = {
    title: '',
  }

  componentDidMount() {
    online()
  }

  onPressCreate = async () => {
    const {title} = this.state

    const nodeId = await pubsub.create(
      {},
      {
        title: title,
        deliver_notifications: true,
        deliver_payloads: true,
        notify_config: true,
        notify_delete: true,
        notify_retract: true,
        notify_sub: true,
        persist_items: true,
        max_items: 100,
        item_expire: 0,
        subscribe: true,
        access_model: 'whitelist',
        // 'roster_groups_allowed': ,
        // 'publish_model': ,
        purge_offline: false,
        max_payload_size: 1028,
        send_last_published_item: 'on_sub_and_presence',
        notification_type: 'headline',
        presence_based_delivery: false,
        type: NS_ATOM,
      }
    )

    Router.pushRoute('/nodes')
  }

  render() {
    const {title} = this.state

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Create</Text>
        <Text>Title</Text>
        <TextInput
          onChangeText={title => this.setState({title})}
          value={title}
          style={styles.input}
        />
        <Button onPress={this.onPressCreate} title={'Create'} />
      </View>
    )
  }
}
