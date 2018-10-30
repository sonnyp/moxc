'use strict'

import buildDataForm from '../data-forms/build'
import parseDataForm from '../data-forms/parse'
const xml = require('@xmpp/xml')
const {EventEmitter} = require('@xmpp/events')

const NS_PUBSUB = 'http://jabber.org/protocol/pubsub'
const NS_PUBSUB_EVENT = `${NS_PUBSUB}#event`
const NS_PUBSUB_OWNER = `${NS_PUBSUB}#owner`
const NS_PUBSUB_NODE_CONFIG = `${NS_PUBSUB}#node_config`

function isPubSubEventNotification(stanza) {
  const child = stanza.getChild('event')
  return stanza.is('message') && child && child.attrs.xmlns === NS_PUBSUB_EVENT
}

export function parseConfigure(configure) {
  const [, fields] = parseDataForm(configure)
  return fields.reduce((accumulator, field) => {
    if (field.var === 'FORM_TYPE' && field.value === NS_PUBSUB_NODE_CONFIG) {
      return accumulator
    }
    accumulator[field.var.split('pubsub#')[1]] = field.value
    return accumulator
  }, {})
}

export function buildConfigure(options, fields) {
  return buildDataForm(options, [
    {var: 'FORM_TYPE', value: NS_PUBSUB_NODE_CONFIG},
    ...Object.entries(fields).map(([key, value]) => ({
      var: `pubsub#${key}`,
      value,
    })),
  ])
}

export default function({iqCaller, disco, middleware}) {
  const ee = new EventEmitter()

  middleware.use(({from, stanza}, next) => {
    if (!isPubSubEventNotification(stanza)) return next()

    const service = from
    const items = stanza.getChild('event').getChild('items')
    const {node} = items.attrs
    const item = items.getChild('item')
    const retract = items.getChild('retract')
    if (item) {
      const {id} = item.attrs
      const entry = item.getChild('entry')
      const delay = stanza.getChild('delay')

      if (delay) {
        const {stamp} = delay.attrs
        ee.emit(`last-item-published:${service}`, {node, id, entry, stamp})
        ee.emit(`last-item-published:${service}:${node}`, {
          id,
          entry,
          stamp,
        })
      } else {
        ee.emit(`item-published:${service}`, {node, id, entry})
        ee.emit(`item-published:${service}:${node}`, {id, entry})
      }
    }
    if (retract) {
      const {id} = retract.attrs
      ee.emit(`item-deleted:${service}`, {node, id})
      ee.emit(`item-deleted:${service}:${node}`, {id})
    }
  })

  return Object.assign(ee, {
    async nodes({to} = {}) {
      return disco.items(to)
    },

    async info({to} = {}) {
      return disco.info(to)
    },

    async create({to, node}, config) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml('create', {node}),
            config &&
              xml('configure', {}, buildConfigure({type: 'submit'}, config))
          )
        )
      ))
        .getChild('pubsub', NS_PUBSUB)
        .getChild('create').attrs.node
    },

    async delete({to, node}) {
      return iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB_OWNER},
            xml('delete', {
              node,
            })
          )
        )
      )
    },

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

    async configure({to, node}, configure) {
      return iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB_OWNER},
            xml('configure', {node}, configure)
          )
        )
      )
    },

    async setConfiguration({to, node}, config) {
      return this.configure(
        {to, node},
        buildConfigure({type: 'submit'}, config)
      )
    },

    async getConfiguration({to, node}) {
      return parseConfigure(
        (await this.configure({to, node}))
          .getChild('pubsub', NS_PUBSUB_OWNER)
          .getChild('configure')
      )
    },
  })
}
