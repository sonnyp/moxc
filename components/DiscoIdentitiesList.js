import {FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'

export default function DiscoEntitiesList(props) {
  const {identities} = props
  return identities.map((identity, idx) => {
    const {category, type} = identity.attrs
    return <ListItem key={idx} title={category} subtitle={type} />
  })
}
