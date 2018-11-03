const routes = require('next-routes')

module.exports = routes()
  .add('pubsub', '/:to/pubsub', 'pubsub')
  .add('create', '/:to/pubsub/create', 'create')
  .add('nodes', '/:to/pubsub/nodes', 'nodes')
  .add('node', '/:to/pubsub/nodes/:node', 'node')
  .add('affiliations', '/:to/pubsub/nodes/:node/affiliations', 'affiliations')
  .add(
    'subscriptions',
    '/:to/pubsub/nodes/:node/subscriptions',
    'subscriptions'
  )
  .add('subscribe', '/:to/pubsub/nodes/:node/subscribe', 'subscribe')
  .add('configure', '/:to/pubsub/nodes/:node/configure', 'configure')
  .add('publish', '/:to/pubsub/nodes/:node/publish', 'publish')
  .add('items', '/:to/pubsub/nodes/:node/items', 'items')
  .add('item', '/:to/pubsub/nodes/:node/items/:item', 'item')
