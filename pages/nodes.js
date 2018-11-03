import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'
import DiscoNodesList from '../components/DiscoNodesList'

export default class Nodes extends Component {
  state = {
    nodes: [],
  }

  static getInitialProps({query}) {
    return query
  }

  async componentDidMount() {
    await online()

    this.updateNodes()
  }

  async updateNodes() {
    const nodes = (await pubsub.nodes(this.props)).children

    this.setState({
      nodes,
    })
  }

  render() {
    const {nodes} = this.state

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Nodes</Text>
        <Link route="create" params={this.props}>
          <a>
            <Button title={'Create node'} />
          </a>
        </Link>
        <DiscoNodesList nodes={nodes} />
      </View>
    )
  }
}
