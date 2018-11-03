import {FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'

import {Link} from '../routes'

export default function PubsubAffiliationsList(props) {
  const {affiliations, node, to} = props
  return (
    <FlatList
      data={affiliations}
      keyExtractor={item => item.attrs.jid}
      renderItem={({item}) => {
        const {affiliation, jid} = item.attrs
        return (
          <Link route="entity" params={{to: jid}}>
            <a>
              <ListItem chevron title={jid} subtitle={affiliation} />
            </a>
          </Link>
        )
      }}
    />
  )
}
