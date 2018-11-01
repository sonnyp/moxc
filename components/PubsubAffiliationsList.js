'use strict'

import {FlatList, View, Text} from 'react-native'

import styles from '../styles'
import {Link} from '../routes'

export default function PubsubAffiliationsList(props) {
  const {affiliations, node, to} = props
  return (
    <FlatList
      data={affiliations}
      keyExtractor={item => item.attrs.jid}
      renderItem={({item}) => {
        const {affiliation, jid} = item.attrs
        return (
          <Link route="entity" params={{to: jid}}>
            <a>
              <View style={styles.listItem}>
                <Text>{`${jid}: ${affiliation}`}</Text>
              </View>
            </a>
          </Link>
        )
      }}
    />
  )
}
