import {client, xml} from '@xmpp/client'
import debug from '@xmpp/debug'
import serviceDiscovery from './service-discovery/caller'
import adHocCommands from './commands'
import {promise} from '@xmpp/events'
import pubsubCaller from './pubsub/caller'

let credentials

const xmpp = client({
  // service: 'ws://localhost:5280/xmpp-websocket',
  // domain: 'localhost',
  credentials: auth => {
    return auth(credentials)
  },
  // username: 'client',
  // password: 'foobar',
})

const entity = xmpp

const {iqCaller, middleware} = xmpp
const disco = serviceDiscovery({iqCaller})
const adHoc = adHocCommands({iqCaller, disco})
const pubsub = pubsubCaller({iqCaller, middleware, disco, entity})

debug(xmpp, true)

xmpp.on('online', () => {
  // xmpp.send(xml('presence'))
})

export function online() {
  if (xmpp.status === 'offline') {
  }
  if (xmpp.status === 'online') return Promise.resolve()
  return promise(xmpp, 'online')
}

export function setCredentials(_credentials) {
  credentials = _credentials
}

export {xmpp, disco, adHoc, xml, iqCaller, pubsub}
