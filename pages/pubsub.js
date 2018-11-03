import React, {Component} from 'react'
import {View} from 'react-native'
import {Text, Button} from 'react-native-elements'

import {Link} from '../routes'
import styles from '../styles'

export default class Pubsub extends Component {
  static getInitialProps({query}) {
    return query
  }

  render() {
    return (
      <View style={{...styles.container}}>
        <Text h1>Pubsub</Text>
        <Link route="nodes" params={this.props}>
          <a>
            <Button title={'Nodes'} />
          </a>
        </Link>
        <Link route="create" params={this.props}>
          <a>
            <Button title={'Create'} />
          </a>
        </Link>
        <Link route="ownAffiliations" params={this.props}>
          <a>
            <Button title={'Affiliations'} />
          </a>
        </Link>
        <Link route="ownSubscriptions" params={this.props}>
          <a>
            <Button title={'Subscriptions'} />
          </a>
        </Link>
        <Link route="info" params={this.props}>
          <a>
            <Button title={'Info'} />
          </a>
        </Link>
      </View>
    )
  }
}
