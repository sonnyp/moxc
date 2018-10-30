'use strict'

import {FlatList, View, Text} from 'react-native'

import styles from '../styles'
import {Link} from '../routes'

export default function AtomEntry(props) {
  const {entry} = props
  if (!entry) return <View />

  const title = entry.getChildText('title') || ''
  const content = entry.getChildText('content') || ''

  return (
    <View style={styles.container}>
      <Text>Title</Text>
      <Text>{title}</Text>
      <Text>Content</Text>
      <Text>{content}</Text>
    </View>
  )
}
