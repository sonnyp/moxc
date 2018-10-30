'use strict'

const test = require('ava')
const {context} = require('@xmpp/test')
const _pubsubCaller = require('./caller')
const _middleware = require('@xmpp/middleware')
const _iqCaller = require('@xmpp/iq/caller')
const {promise} = require('@xmpp/events')

const SERVICE = 'pubsub.foo'

test.beforeEach(t => {
  const ctx = context()
  const {entity} = ctx
  const middleware = _middleware({entity})
  const iqCaller = _iqCaller({middleware, entity})
  ctx.pubsubCaller = _pubsubCaller({iqCaller, middleware})
  t.context = ctx
})

test('createNode', t => {
  t.context.scheduleIncomingResult(
    <pubsub xmlns="http://jabber.org/protocol/pubsub">
      <create node="foo" />
    </pubsub>
  )

  return Promise.all([
    t.context.catchOutgoingSet().then(child => {
      t.deepEqual(
        child,
        <pubsub xmlns="http://jabber.org/protocol/pubsub">
          <create node="foo" />
        </pubsub>
      )
    }),
    t.context.pubsubCaller.createNode(SERVICE, 'foo').then(val => {
      t.is(val, 'foo')
    }),
  ])
})

test('createNode with config options', t => {
  t.context.scheduleIncomingResult(
    <pubsub xmlns="http://jabber.org/protocol/pubsub">
      <create node="foo" />
    </pubsub>
  )

  return Promise.all([
    t.context.catchOutgoingSet().then(child => {
      t.deepEqual(
        child,
        <pubsub xmlns="http://jabber.org/protocol/pubsub">
          <create node="foo" />
          <configure>
            <x xmlns="jabber:x:data" type="submit">
              <field var="FORM_TYPE" type="hidden">
                <value>http://jabber.org/protocol/pubsub#node_config</value>
              </field>
              <field var="pubsub#access_model">
                <value>whitelist</value>
              </field>
              <field var="pubsub#max_items">
                <value>100</value>
              </field>
            </x>
          </configure>
        </pubsub>
      )
    }),
    t.context.pubsubCaller
      .createNode(SERVICE, 'foo', {
        'pubsub#access_model': 'whitelist',
        'pubsub#max_items': 100,
      })
      .then(val => {
        t.is(val, 'foo')
      }),
  ])
})

test('deleteNode', t => {
  t.context.scheduleIncomingResult()

  return Promise.all([
    t.context.catchOutgoingSet().then(child => {
      t.deepEqual(
        child,
        <pubsub xmlns="http://jabber.org/protocol/pubsub">
          <delete node="foo" />
        </pubsub>
      )
    }),
    t.context.pubsubCaller.deleteNode(SERVICE, 'foo').then(val => {
      t.is(val, undefined)
    }),
  ])
})

test('publish', t => {
  t.context.scheduleIncomingResult(
    <pubsub xmlns="http://jabber.org/protocol/pubsub">
      <publish node="foo">
        <item id="foobar" />
      </publish>
    </pubsub>
  )

  return Promise.all([
    t.context.catchOutgoingSet().then(child => {
      t.deepEqual(
        child,
        <pubsub xmlns="http://jabber.org/protocol/pubsub">
          <publish node="foo">
            <item>
              <entry>
                <title>FooBar</title>
              </entry>
            </item>
          </publish>
        </pubsub>
      )
    }),
    t.context.pubsubCaller
      .publish(
        SERVICE,
        'foo',
        <item>
          <entry>
            <title>FooBar</title>
          </entry>
        </item>
      )
      .then(itemId => {
        t.is(itemId, 'foobar')
      }),
  ])
})

test('items', t => {
  t.context.scheduleIncomingResult(
    <pubsub xmlns="http://jabber.org/protocol/pubsub">
      <items node="foo">
        <item id="fooitem">
          <entry>Foo</entry>
        </item>
        <item id="baritem">
          <entry>Bar</entry>
        </item>
      </items>
    </pubsub>
  )

  return Promise.all([
    t.context.catchOutgoingGet().then(child => {
      t.deepEqual(
        child,
        <pubsub xmlns="http://jabber.org/protocol/pubsub">
          <items node="foo" />
        </pubsub>
      )
    }),
    t.context.pubsubCaller.items(SERVICE, 'foo').then(([items, rsm]) => {
      items.forEach(i => {
        i.parent = null
      })
      t.deepEqual(
        items[0],
        <item id="fooitem">
          <entry>Foo</entry>
        </item>
      )
      t.deepEqual(
        items[1],
        <item id="baritem">
          <entry>Bar</entry>
        </item>
      )
      t.is(rsm, undefined)
    }),
  ])
})

test('items with RSM', t => {
  t.context.scheduleIncomingResult(
    <pubsub xmlns="http://jabber.org/protocol/pubsub">
      <items node="foo">
        <item id="fooitem">
          <entry>Foo</entry>
        </item>
        <item id="baritem">
          <entry>Bar</entry>
        </item>
      </items>
      <set xmlns="http://jabber.org/protocol/rsm">
        <first>first@time</first>
        <last>last@time</last>
        <count>2</count>
      </set>
    </pubsub>
  )

  return Promise.all([
    t.context.catchOutgoingGet().then(child => {
      t.deepEqual(
        child,
        <pubsub xmlns="http://jabber.org/protocol/pubsub">
          <items node="foo" />
          <set xmlns="http://jabber.org/protocol/rsm">
            <first>first@time</first>
            <max>2</max>
          </set>
        </pubsub>
      )
    }),
    t.context.pubsubCaller
      .items(SERVICE, 'foo', {first: 'first@time', max: 2})
      .then(([items, rsm]) => {
        items.forEach(i => {
          i.parent = null
        })
        t.deepEqual(
          items[0],
          <item id="fooitem">
            <entry>Foo</entry>
          </item>
        )
        t.deepEqual(
          items[1],
          <item id="baritem">
            <entry>Bar</entry>
          </item>
        )
        t.deepEqual(rsm, {first: 'first@time', last: 'last@time', count: 2})
      }),
  ])
})

test('delete item', t => {
  t.context.scheduleIncomingResult()

  return Promise.all([
    t.context.catchOutgoingSet().then(child => {
      t.deepEqual(
        child,
        <pubsub xmlns="http://jabber.org/protocol/pubsub">
          <retract node="foo" notify="true">
            <item id="foobar" />
          </retract>
        </pubsub>
      )
    }),
    t.context.pubsubCaller.deleteItem(SERVICE, 'foo', 'foobar'),
  ])
})

test('item-published event', t => {
  t.context.fakeIncoming(
    <message from={SERVICE}>
      <event xmlns="http://jabber.org/protocol/pubsub#event">
        <items node="foo">
          <item id="fooitem">
            <entry>Foo Bar</entry>
          </item>
        </items>
      </event>
    </message>
  )

  return Promise.all([
    promise(t.context.pubsubCaller, 'item-published:pubsub.foo').then(ev => {
      ev.entry.parent = null
      t.deepEqual(ev, {
        node: 'foo',
        id: 'fooitem',
        entry: <entry>Foo Bar</entry>,
      })
    }),
    promise(t.context.pubsubCaller, 'item-published:pubsub.foo:foo').then(
      ev => {
        ev.entry.parent = null
        t.deepEqual(ev, {
          id: 'fooitem',
          entry: <entry>Foo Bar</entry>,
        })
      }
    ),
  ])
})

test('last-item-published event', t => {
  t.context.fakeIncoming(
    <message from={SERVICE}>
      <event xmlns="http://jabber.org/protocol/pubsub#event">
        <items node="foo">
          <item id="fooitem">
            <entry>Foo Bar</entry>
          </item>
        </items>
      </event>
      <delay xmlns="urn:xmpp:delay" stamp="2003-12-13T23:58:37Z" />
    </message>
  )

  return Promise.all([
    promise(t.context.pubsubCaller, 'last-item-published:pubsub.foo').then(
      ev => {
        ev.entry.parent = null
        t.deepEqual(ev, {
          node: 'foo',
          id: 'fooitem',
          stamp: '2003-12-13T23:58:37Z',
          entry: <entry>Foo Bar</entry>,
        })
      }
    ),
    promise(t.context.pubsubCaller, 'last-item-published:pubsub.foo:foo').then(
      ev => {
        ev.entry.parent = null
        t.deepEqual(ev, {
          id: 'fooitem',
          stamp: '2003-12-13T23:58:37Z',
          entry: <entry>Foo Bar</entry>,
        })
      }
    ),
  ])
})

test('item-deleted event', t => {
  t.context.fakeIncoming(
    <message from={SERVICE}>
      <event xmlns="http://jabber.org/protocol/pubsub#event">
        <items node="foo">
          <retract id="fooitem" />
        </items>
      </event>
    </message>
  )

  return Promise.all([
    promise(t.context.pubsubCaller, 'item-deleted:pubsub.foo').then(ev => {
      t.deepEqual(ev, {
        node: 'foo',
        id: 'fooitem',
      })
    }),
    promise(t.context.pubsubCaller, 'item-deleted:pubsub.foo:foo').then(ev => {
      t.deepEqual(ev, {
        id: 'fooitem',
      })
    }),
  ])
})
