import {FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'

export default function DiscoFeaturesList(props) {
  const {features} = props
  return (
    <FlatList
      data={features}
      keyExtractor={feature => feature.attrs.var}
      renderItem={({item}) => {
        const {category, type} = item.attrs
        return <ListItem title={item.attrs.var} />
      }}
    />
  )
}
