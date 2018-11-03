import {client, xml} from '@xmpp/client'
import debug from '@xmpp/debug'
import serviceDiscovery from './service-discovery/caller'
import adHocCommands from './commands'
import {promise} from '@xmpp/events'
import pubsubCaller from './pubsub/caller'

const xmpp = client({
  service: 'ws://localhost:5280/xmpp-websocket',
  domain: 'localhost',
  username: 'client',
  password: 'foobar',
})

const entity = xmpp

const {iqCaller, middleware} = xmpp
const disco = serviceDiscovery({iqCaller})
const adHoc = adHocCommands({iqCaller, disco})
const pubsub = pubsubCaller({iqCaller, middleware, disco, entity})

debug(xmpp, true)

export function online() {
  if (xmpp.status === 'offline') {
    return xmpp.start().then(() => {
      xmpp.send(xml('presence'))
    })
  }
  if (xmpp.status === 'online') return Promise.resolve()
  return promise(xmpp, 'online')
}

export {xmpp, disco, adHoc, xml, iqCaller, pubsub}
