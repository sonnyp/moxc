const routes = require('next-routes')

module.exports = routes()
  .add('pubsub', '/pubsub')
  .add('items', '/:node/items', 'items')
  .add('configure', '/:node/configure', 'configure')
  .add('publish', '/:node/publish', 'publish')
  .add('item', '/:node/items/:item', 'item')
  .add('create', '/create', 'create')
  .add('nodes', '/nodes', 'nodes')
