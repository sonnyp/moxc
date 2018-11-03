import React, {Component} from 'react'
import {Text, View, Button} from 'react-native'

import {Link} from '../routes'
import styles from '../styles'

export default class Node extends Component {
  static getInitialProps({query}) {
    return query
  }

  onPressDelete() => {

  }

  render() {
    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Node</Text>
        <Link route="items" params={this.props}>
          <a>
            <Button title={'Items'} />
          </a>
        </Link>
        <Link route="configure" params={this.props}>
          <a>
            <Button title={'Configure'} />
          </a>
        </Link>
        <Link route="publish" params={this.props}>
          <a>
            <Button title={'Publish'} />
          </a>
        </Link>
        <Link route="affiliations" params={this.props}>
          <a>
            <Button title={'Affiliations'} />
          </a>
        </Link>
        <Link route="subscriptions" params={this.props}>
          <a>
            <Button title={'Subscriptions'} />
          </a>
        </Link>
        <Link route="subscribe" params={this.props}>
          <a>
            <Button title={'Subscribe'} />
          </a>
        </Link>
        <Button title={'delete'} onPress={this.onPressDelete} />
      </View>
    )
  }
}
