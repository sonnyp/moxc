'use strict'

import {FlatList, View, Text} from 'react-native'

import styles from '../styles'
import {Link} from '../routes'

export default function PubsubSubscriptionsList(props) {
  const {subscriptions, node, to} = props
  return (
    <FlatList
      data={subscriptions}
      keyExtractor={item => item.attrs.jid + (item.attrs.subid || '')}
      renderItem={({item}) => {
        const {subscription, jid} = item.attrs
        return (
          <Link route="entity" params={{to: jid}}>
            <a>
              <View style={styles.listItem}>
                <Text>{`${jid}: ${subscription}`}</Text>
              </View>
            </a>
          </Link>
        )
      }}
    />
  )
}
