import React, {Component} from 'react'
import {Text, View, Button} from 'react-native'

import {Link} from '../routes'
import styles from '../styles'

export default class Pubsub extends Component {
  static getInitialProps({query}) {
    return query
  }

  render() {
    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Pubsub</Text>
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
        {/* <Link route="affiliations" params={this.props}>
          <a>
            <Button title={'Affiliations'} />
          </a>
        </Link> */}
        {/* <Link route="subscriptions" params={this.props}>
          <a>
            <Button title={'Subscriptions'} />
          </a>
        </Link> */}
        <Link route="info" params={this.props}>
          <a>
            <Button title={'Info'} />
          </a>
        </Link>
        <Link route="info" params={this.props}>
          <a>
            <Button title={'Subscribe'} />
          </a>
        </Link>
      </View>
    )
  }
}
