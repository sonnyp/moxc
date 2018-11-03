import {FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'

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
              <ListItem chevron title={name} subtitle={node} />
            </a>
          </Link>
        )
      }}
    />
  )
}
