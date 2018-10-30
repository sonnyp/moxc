'use strict'

const xml = require('@xmpp/xml')

const NS_DISCO_INFO = 'http://jabber.org/protocol/disco#info'
const NS_DISCO_ITEMS = 'http://jabber.org/protocol/disco#items'

export default function serviceDiscovery({iqCaller}) {
  return {
    items: async (service, node) => {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to: service},
          xml('query', {xmlns: NS_DISCO_ITEMS, node})
        )
      )).getChild('query', NS_DISCO_ITEMS)
    },

    // https://xmpp.org/extensions/xep-0030.html#info
    info: async (service, node) => {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to: service},
          xml('query', {xmlns: NS_DISCO_INFO, node})
        )
      )).getChild('query', NS_DISCO_INFO)
    },
  }
}
