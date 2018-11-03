import {View} from 'react-native'
import {Text} from 'react-native-elements'

import styles from '../styles'

export default function AtomEntry(props) {
  const {entry} = props
  if (!entry) return <View />

  const title = entry.getChildText('title') || ''
  const content = entry.getChildText('content') || ''

  return (
    <View style={styles.container}>
      <Text label>Title</Text>
      <Text>{title}</Text>
      <Text label>Content</Text>
      <Text>{content}</Text>
    </View>
  )
}
