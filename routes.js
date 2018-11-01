const routes = require('next-routes')

module.exports = routes()
  .add('items', '/:to/pubsub/nodes/:node/items', 'items')
  .add('configure', '/:to/pubsub/nodes/:node/configure', 'configure')
  .add('publish', '/:to/pubsub/nodes/:node/publish', 'publish')
  .add('item', '/:to/pubsub/nodes/:node/items/:item', 'item')
  .add('create', '/:to/pubsub/create', 'create')
  .add('nodes', '/:to/pubsub/nodes', 'nodes')
  .add('affiliations', '/:to/pubsub/nodes/:node/affiliations', 'affiliations')
  .add(
    'subscriptions',
    '/:to/pubsub/nodes/:node/subscriptions',
    'subscriptions'
  )
