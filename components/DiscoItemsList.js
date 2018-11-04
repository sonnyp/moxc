import {FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'

import {Link} from '../routes'

export default function DiscoItemsList(props) {
  const {items} = props
  return (
    <FlatList
      data={items}
      keyExtractor={(item, idx) => idx}
      renderItem={({item}) => {
        const {name, jid} = item.attrs
        return (
          <Link route="entity" params={{to: jid}}>
            <a>
              <ListItem chevron title={name} subtitle={jid} />
            </a>
          </Link>
        )
      }}
    />
  )
}
