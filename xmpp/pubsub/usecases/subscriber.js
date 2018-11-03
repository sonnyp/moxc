'use strict'

// import buildDataForm from '../data-forms/build'
// import parseDataForm from '../data-forms/parse'
const xml = require('@xmpp/xml')
const {EventEmitter} = require('@xmpp/events')

const NS_PUBSUB = 'http://jabber.org/protocol/pubsub'
// const NS_PUBSUB_EVENT = `${NS_PUBSUB}#event`
const NS_X_DATA = 'jabber:x:data'

// function isPubSubEventNotification(stanza) {
//   const child = stanza.getChild('event')
//   return stanza.is('message') && child && child.attrs.xmlns === NS_PUBSUB_EVENT
// }

export default function({entity, iqCaller, middleware}) {
  // const ee = new EventEmitter()

  // middleware.use(({from, stanza}, next) => {
  //   if (!isPubSubEventNotification(stanza)) return next()

  //   const service = from
  //   const items = stanza.getChild('event').getChild('items')
  //   const {node} = items.attrs
  //   const item = items.getChild('item')
  //   const retract = items.getChild('retract')
  //   if (item) {
  //     const {id} = item.attrs
  //     const entry = item.getChild('entry')
  //     const delay = stanza.getChild('delay')

  //     if (delay) {
  //       const {stamp} = delay.attrs
  //       ee.emit(`last-item-published:${service}`, {node, id, entry, stamp})
  //       ee.emit(`last-item-published:${service}:${node}`, {
  //         id,
  //         entry,
  //         stamp,
  //       })
  //     } else {
  //       ee.emit(`item-published:${service}`, {node, id, entry})
  //       ee.emit(`item-published:${service}:${node}`, {id, entry})
  //     }
  //   }
  //   if (retract) {
  //     const {id} = retract.attrs
  //     ee.emit(`item-deleted:${service}`, {node, id})
  //     ee.emit(`item-deleted:${service}:${node}`, {id})
  //   }
  // })

  return {
    // https://xmpp.org/extensions/xep-0060.html#subscriber-subscribe
    async subscribe({to, node}, form) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml('subscribe', {
              node,
              jid: entity.jid.bare(),
            }),
            form && xml('options', {}, form)
          )
        )
      ))
        .getChild('pubsub', NS_PUBSUB)
        .getChild('subscription')
    },

    // https://xmpp.org/extensions/xep-0060.html#subscriber-unsubscribe
    async unsubscribe({to, node}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml('unsubscribe', {
              node,
              jid: entity.jid.bare(),
            })
          )
        )
      ))
        .getChild('pubsub', NS_PUBSUB)
        .getChild('subscription')
    },

    // https://xmpp.org/extensions/xep-0060.html#subscriber-configure-request
    async getSubscriptionOptions({to, node}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml('options', {
              node,
              jid: entity.jid.bare(),
            })
          )
        )
      ))
        .getChild('pubsub', NS_PUBSUB)
        .getChild('options')
        .getChild('x', NS_X_DATA)
    },

    // https://xmpp.org/extensions/xep-0060.html#subscriber-configure-submit
    async setSubscriptionOptions({to, node}, form) {
      return await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml(
              'options',
              {
                node,
                jid: entity.jid.bare(),
              },
              form
            )
          )
        )
      )
    },

    // https://xmpp.org/extensions/xep-0060.html#subscribe-default
    async getDefaultSubscriptionOptions({to} = {}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml('pubsub', {xmlns: NS_PUBSUB}, xml('default'))
        )
      ))
        .getChild('pubsub', NS_PUBSUB_OWNER)
        .getChild('default')
        .getChild('x', NS_X_DATA)
    },

    // https://xmpp.org/extensions/xep-0060.html#subscriber-retrieve-requestall
    async items({to, node}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml('items', {
              node,
            })
          )
        )
      ))
        .getChild('pubsub', NS_PUBSUB)
        .getChild('items')
    },

    // https://xmpp.org/extensions/xep-0060.html#subscriber-retrieve-requestone
    async item({to, node}, id) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml(
              'items',
              {
                node,
              },
              xml('item', {id})
            )
          )
        )
      ))
        .getChild('pubsub', NS_PUBSUB)
        .getChild('items')
        .getChild('item')
    },
  }
}
