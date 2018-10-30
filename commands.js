'use strict'

const xml = require('@xmpp/xml')
const NS_COMMANDS = 'http://jabber.org/protocol/commands'

export default function commands({disco, iqCaller}) {
  return {
    getCommands: async service => {
      return disco.items(service, NS_COMMANDS)
    },
    execute: async (service, node) => {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to: service},
          xml('command', {xmlns: NS_COMMANDS, node})
        )
      )).getChild('command', NS_COMMANDS)
    },
  }
}
