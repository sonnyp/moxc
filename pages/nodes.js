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

  async componentDidMount() {
    await online()

    this.updateNodes()
  }

  async updateNodes() {
    const nodes = (await pubsub.nodes()).children

    console.log(await pubsub.getOwnSubscriptions())
    try {
      console.log(await pubsub.getOwnAffiliations())
    } catch (err) {}

    this.setState({
      nodes,
    })

    // for (const node of nodes) {
    //   try {
    //     const config = await pubsub.getConfiguration({node: node.attrs.node})
    //     const {configs} = this.state
    //     this.setState({configs: {...configs, [node.attrs.node]: config}})
    //   } catch (err) {
    //     console.error(err)
    //   }
    // }
  }

  render() {
    const {nodes} = this.state

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Nodes</Text>
        <Link route="create">
          <a>
            <Button title={'Create node'} />
          </a>
        </Link>
        <DiscoNodesList nodes={nodes} />
      </View>
    )
  }
}
