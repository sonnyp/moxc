import {ListItem} from 'react-native-elements'

import {Link} from '../routes'

export default function DiscoFeaturesList(props) {
  const {features, to} = props
  return features.map(feature => {
    return (
      <Link
        route="entity"
        key={feature.attrs.var}
        params={{to: to, node: feature.attrs.var}}
      >
        <a>
          <ListItem chevron title={feature.attrs.var} />
        </a>
      </Link>
    )
  })
}
