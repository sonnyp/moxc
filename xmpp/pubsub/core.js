import buildDataForm from '../data-forms/build'
import parseDataForm from '../data-forms/parse'

export const NS_PUBSUB = 'http://jabber.org/protocol/pubsub'
export const NS_PUBSUB_NODE_CONFIG = `${NS_PUBSUB}#node_config`

export function parsePubsubDataForm(dataForm) {
  const [, fields] = parseDataForm(dataForm)
  return fields.reduce((accumulator, {key, value}) => {
    if (key === 'FORM_TYPE' && value === NS_PUBSUB_NODE_CONFIG) {
      return accumulator
    }
    accumulator[key.split('pubsub#')[1]] = value
    return accumulator
  }, {})
}

export function buildPubsubDataForm(options, fields) {
  return buildDataForm(options, [
    {var: 'FORM_TYPE', value: NS_PUBSUB_NODE_CONFIG},
    ...Object.entries(fields).map(([key, value]) => ({
      var: `pubsub#${key}`,
      value,
    })),
  ])
}
