'use strict'

const xml = require('@xmpp/xml')

const NS_PUBSUB = 'http://jabber.org/protocol/pubsub'
const NS_PUBSUB_OWNER = `${NS_PUBSUB}#owner`
const NS_X_DATA = 'jabber:x:data'

export default function({iqCaller}) {
  return {
    // https://xmpp.org/extensions/xep-0060.html#owner-create
    async create({to, node}, form) {
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

    // https://xmpp.org/extensions/xep-0060.html#owner-configure-request
    async getConfiguration({to, node}) {
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

    // https://xmpp.org/extensions/xep-0060.html#owner-configure
    async setConfiguration({to, node}, submitForm) {
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

    // https://xmpp.org/extensions/xep-0060.html#owner-default
    async getDefaultConfiguration({to} = {}) {
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

    // https://xmpp.org/extensions/xep-0060.html#owner-delete
    async delete({to, node} = {}, uri) {
      return await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB_OWNER},
            xml('delete', {node}, uri && xml('redirect', {uri}))
          )
        )
      )
    },

    // https://xmpp.org/extensions/xep-0060.html#owner-purge-request
    async purge({to, node} = {}) {
      return await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml('pubsub', {xmlns: NS_PUBSUB_OWNER}, xml('purge', {node}))
        )
      )
    },

    // TODO https://xmpp.org/extensions/xep-0060.html#owner-subreq

    // TODO https://xmpp.org/extensions/xep-0060.html#owner-subreq-process

    // https://xmpp.org/extensions/xep-0060.html#owner-subscriptions-retrieve
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

    // https://xmpp.org/extensions/xep-0060.html#owner-subscriptions-modify
    async modifySubscriptions({to, node} = {}, subscriptions) {
      return await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB_OWNER},
            xml('subscriptions', {node}, subscriptions)
          )
        )
      )
    },

    // https://xmpp.org/extensions/xep-0060.html#owner-affiliations-retrieve
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

    // https://xmpp.org/extensions/xep-0060.html#owner-affiliations-modify
    async modifyAffiliations({to, node} = {}, affiliations) {
      return await iqCaller.request(
        xml(
          'iq',
          {type: 'set', to},
          xml(
            'pubsub',
            {xmlns: NS_PUBSUB_OWNER},
            xml('affiliations', {node}, affiliations)
          )
        )
      )
    },
  }
}
