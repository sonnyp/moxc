'use strict'

import {FlatList, View, Text} from 'react-native'

import styles from '../styles'
import {Link} from '../routes'

export default function DiscoNodesList(props) {
  const {nodes} = props
  return (
    <FlatList
      data={nodes}
      keyExtractor={item => item.attrs.node}
      renderItem={({item}) => {
        const {name, node, jid} = item.attrs
        return (
          <Link route="node" params={{node, to: jid}}>
            <a>
              <View style={styles.listItem}>
                <Text>{name || node}</Text>
              </View>
            </a>
          </Link>
        )
      }}
    />
  )
}
