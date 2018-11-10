import {ListItem} from 'react-native-elements'

import {Link} from '../routes'

export default function DiscoItemsList(props) {
  const {items} = props
  return items.map((item, idx) => {
    const {name, jid, node} = item.attrs
    return (
      <Link route="entity" key={idx} params={{to: jid, node}}>
        <a>
          <ListItem chevron title={name || jid} subtitle={jid} />
        </a>
      </Link>
    )
  })
}
