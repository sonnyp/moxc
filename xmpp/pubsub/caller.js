'use strict'

import buildDataForm from '../data-forms/build'
import parseDataForm from '../data-forms/parse'
const xml = require('@xmpp/xml')
const {EventEmitter} = require('@xmpp/events')

const NS_PUBSUB = 'http://jabber.org/protocol/pubsub'
const NS_PUBSUB_EVENT = `${NS_PUBSUB}#event`
const NS_PUBSUB_OWNER = `${NS_PUBSUB}#owner`
const NS_PUBSUB_NODE_CONFIG = `${NS_PUBSUB}#node_config`
const NS_X_DATA = 'jabber:x:data'

function isPubSubEventNotification(stanza) {
  const child = stanza.getChild('event')
  return stanza.is('message') && child && child.attrs.xmlns === NS_PUBSUB_EVENT
}

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
      return this.createWithForm(
        {to, node},
        config && buildPubsubDataForm({type: 'submit'}, config)
      )
    },

    async createWithForm({to, node}, form) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB},
            xml('create', {node}),
            form && xml('configure', {}, form)
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

    async getDefaultConfigurationForm({to} = {}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml('pubsub', {xmlns: NS_PUBSUB_OWNER}, xml('default'))
        )
      ))
        .getChild('pubsub', NS_PUBSUB_OWNER)
        .getChild('default')
        .getChild('x', NS_X_DATA)
    },

    async getConfigurationForm({to, node}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml('pubsub', {xmlns: NS_PUBSUB_OWNER}, xml('configure', {node}))
        )
      ))
        .getChild('pubsub', NS_PUBSUB_OWNER)
        .getChild('configure')
        .getChild('x', NS_X_DATA)
    },

    async setConfigurationForm({to, node}, submitForm) {
      return iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB_OWNER},
            xml('configure', {node}, submitForm)
          )
        )
      )
    },

    async getConfiguration({to, node}) {
      return parsePubsubDataForm(await this.getConfigurationForm({to, node}))
    },

    async getDefaultConfiguration({to}) {
      return parsePubsubDataForm(await this.getDefaultConfigurationForm({to}))
    },

    async setConfiguration({to, node}, config) {
      return this.setConfigurationForm(
        {to, node},
        buildPubsubDataForm({type: 'submit'}, config)
      )
    },

    async getSubscriptions({to, node} = {}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml('pubsub', {xmlns: NS_PUBSUB_OWNER}, xml('subscriptions', {node}))
        )
      ))
        .getChild('pubsub', NS_PUBSUB_OWNER)
        .getChild('subscriptions')
    },

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

    async getAffiliations({to, node} = {}) {
      return (await iqCaller.request(
        xml(
          'iq',
          {type: 'get', to},
          xml('pubsub', {xmlns: NS_PUBSUB_OWNER}, xml('affiliations', {node}))
        )
      ))
        .getChild('pubsub', NS_PUBSUB_OWNER)
        .getChild('affiliations')
    },

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
  })
}
