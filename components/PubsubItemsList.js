import {FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'

import {Link} from '../routes'

const NS_ATOM = 'http://www.w3.org/2005/Atom'

export default function PubsubItemsList(props) {
  const {items, node, to} = props
  return (
    <FlatList
      data={items}
      keyExtractor={item => item.attrs.id}
      renderItem={({item}) => {
        const {id} = item.attrs
        const entry = item.getChild('entry', NS_ATOM)
        const title = entry && entry.getChildText('title')
        return (
          <Link route="item" params={{to, node, item: id}}>
            <a>
              <ListItem chevron title={title} subtitle={id} />
            </a>
          </Link>
        )
      }}
    />
  )
}
