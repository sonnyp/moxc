'use strict'

const xml = require('@xmpp/xml')

const NS_PUBSUB = 'http://jabber.org/protocol/pubsub'

export default function({iqCaller}) {
  return {
    // https://xmpp.org/extensions/xep-0060.html#publisher-publish
    async publish({to, node}, item, options) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml('publish', {node}, item),
            options
          )
        )
      ))
        .getChild('pubsub', NS_PUBSUB)
        .getChild('publish')
        .getChild('item').attrs.id
    },

    // https://xmpp.org/extensions/xep-0060.html#publisher-delete
    async retract({to, node, notify}, id) {
      return iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml(
              'retract',
              {
                node,
                notify: notify ? 'true' : undefined,
              },
              xml('item', {id})
            )
          )
        )
      )
    },
  }
}
