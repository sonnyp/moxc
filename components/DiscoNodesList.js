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
        return (
          <Link route="items" params={{node: item.attrs.node}}>
            <a>
              <View style={styles.listItem}>
                <Text>{item.attrs.name || item.attrs.node}</Text>
              </View>
            </a>
          </Link>
        )
      }}
    />
  )
}
