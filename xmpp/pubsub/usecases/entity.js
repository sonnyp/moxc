'use strict'

const xml = require('@xmpp/xml')

const NS_PUBSUB = 'http://jabber.org/protocol/pubsub'

export default function({iqCaller, disco}) {
  return {
    // https://xmpp.org/extensions/xep-0060.html#entity-features
    // https://xmpp.org/extensions/xep-0060.html#entity-info
    // https://xmpp.org/extensions/xep-0060.html#entity-metadata
    async info({to, node} = {}) {
      return disco.info(to, node)
    },

    // https://xmpp.org/extensions/xep-0060.html#entity-nodes
    // https://xmpp.org/extensions/xep-0060.html#entity-discoveritems
    async nodes({to, node} = {}) {
      return disco.items(to, node)
    },

    // https://xmpp.org/extensions/xep-0060.html#entity-subscriptions
    async getOwnSubscriptions({to, node} = {}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml('pubsub', {xmlns: NS_PUBSUB}, xml('subscriptions', {node}))
        )
      ))
        .getChild('pubsub', NS_PUBSUB)
        .getChild('subscriptions')
    },

    // https://xmpp.org/extensions/xep-0060.html#entity-affiliations
    async getOwnAffiliations({to, node} = {}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml('pubsub', {xmlns: NS_PUBSUB}, xml('affiliations', {node}))
        )
      ))
        .getChild('pubsub', NS_PUBSUB)
        .getChild('affiliations')
    },
  }
}
