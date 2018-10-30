import React, {Component} from 'react'
import {StyleSheet, Text, View, Button} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import DataForm from '../components/DataForm'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  text: {
    alignItems: 'center',
    fontSize: 24,
  },
})

const NS_ATOM = 'http://www.w3.org/2005/Atom'

const service = undefined

export default class Roster extends Component {
  state = {
    nodes: [],
    infos: {},
    items: [],
    form: null,
    selectedNode: null,
  }

  async componentDidMount() {
    await online()

    // await pubsub.info()

    const nodes = await this.updateNodes()

    // for (const node of nodes) {
    //   try {
    //     const query = await getInfo(iqCaller, node.attrs.node)
    //     this.state.infos[node.attrs.node] = query
    //     this.setState({
    //       infos: this.state.infos,
    //     })
    //   } catch (err) {
    //     console.error(err)
    //   }
    // }
  }

  async updateNodes() {
    const nodes = (await pubsub.nodes()).children

    this.setState({
      nodes,
    })

    return nodes
  }

  async updateItems(node) {
    this.setState({
      items: (await pubsub.items({node})).children,
    })
  }

  onPressAddNode = async () => {
    const title = Math.random().toString()

    const nodeId = await pubsub.create(
      {},
      {
        title: title,
        deliver_notifications: true,
        deliver_payloads: true,
        notify_config: true,
        notify_delete: true,
        notify_retract: true,
        notify_sub: true,
        persist_items: true,
        max_items: 100,
        item_expire: 0,
        subscribe: true,
        access_model: 'whitelist',
        // 'roster_groups_allowed': ,
        // 'publish_model': ,
        purge_offline: false,
        max_payload_size: 1028,
        send_last_published_item: 'on_sub_and_presence',
        notification_type: 'headline',
        presence_based_delivery: false,
        type: NS_ATOM,
      }
    )

    this.updateNodes()
  }

  onPressNode = async nodeId => {
    this.setState({selectedNode: nodeId})

    this.setState({
      form: (await pubsub.configure({node: nodeId})).getChild(
        'x',
        'jabber:x:data'
      ),
    })

    this.updateItems(nodeId)
  }

  onPressAddItem = async () => {
    const {selectedNode} = this.state
    if (!selectedNode) {
      return
    }

    const item = xml(
      'item',
      {},
      xml(
        'entry',
        {xmlns: NS_ATOM},
        xml('summary', {}, Math.random().toString())
      )
    )

    const itemId = await pubsub.publish({node: selectedNode}, item)
    this.updateItems(selectedNode)
  }

  render() {
    const {nodes, items, form, infos, selectedNode} = this.state

    return (
      <View style={{...styles.container, flexDirection: 'row'}}>
        <View style={{...styles.container, width: 400}}>
          <Button onPress={this.onPressAddNode} title={'Add node'} />
          {nodes.map(item => {
            // let name = item.attrs.node
            // try {
            //   name = infos[item.attrs.node]
            //     .getChild('x', NS_X_DATA)
            //     .children.find(({attrs}) => attrs.var === 'pubsub#title')
            //     .getChildText('value')
            // } catch (err) {
            //   console.error(err)
            // }
            return (
              <Text
                onPress={() => this.onPressNode(item.attrs.node)}
                key={item.attrs.node}
                style={styles.text}
              >
                {item.attrs.node}
              </Text>
            )
          })}
        </View>

        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={styles.text}>Items</Text>
            <Button onPress={this.onPressAddItem} title={'Add item'} />
            {items.map(item => {
              const {id} = item.attrs
              const entry = item.getChild('entry', NS_ATOM)
              const summary = entry ? entry.getChildText('summary') : ''
              return <Text key={id}>{summary}</Text>
            })}
          </View>

          <View style={styles.container}>
            <Text style={styles.text}>Configuration</Text>
            <DataForm form={form} />
          </View>
        </View>
      </View>
    )
  }
}
