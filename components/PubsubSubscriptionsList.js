import {FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'

import {Link} from '../routes'

export default function PubsubSubscriptionsList(props) {
  const {subscriptions, node, to} = props
  return (
    <FlatList
      data={subscriptions}
      keyExtractor={item => item.attrs.jid + (item.attrs.subid || '')}
      renderItem={({item}) => {
        const {subscription, jid} = item.attrs
        return (
          <Link route="entity" params={{to: jid}}>
            <a>
              <ListItem chevron title={jid} subtitle={subscription} />
            </a>
          </Link>
        )
      }}
    />
  )
}
