import {FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'

export default function DiscoEntitiesList(props) {
  const {identities} = props
  return (
    <FlatList
      data={identities}
      keyExtractor={(identitiy, idx) => idx.toString()}
      renderItem={({item}) => {
        const {category, type} = item.attrs
        return <ListItem title={category} subtitle={type} />
      }}
    />
  )
}
