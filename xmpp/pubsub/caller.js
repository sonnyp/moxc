'use strict'

import entityUsecase from './usecases/entity'
import ownerUsecase from './usecases/owner'
import publisherUsecase from './usecases/publisher'
import subscriberUsecase from './usecases/subscriber'

export default function({iqCaller, disco, middleware, entity}) {
  return [
    entityUsecase,
    ownerUsecase,
    publisherUsecase,
    subscriberUsecase,
  ].reduce((accumulator, usecase) => {
    return Object.assign(
      accumulator,
      usecase({iqCaller, disco, middleware, entity})
    )
  }, {})
}
