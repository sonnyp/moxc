import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'

import DataForm from '../components/DataForm'

export default class Configure extends Component {
  static getInitialProps({query}) {
    const {node} = query
    return {node}
  }

  state = {
    form: null,
  }

  async componentDidMount() {
    await online()

    this.updateConfiguration()
  }

  async updateConfiguration() {
    const {node} = this.props

    this.setState({
      form: await pubsub.getConfigurationForm({node}),
    })
  }

  async onSubmit(dataForm) {
    const {node} = this.props
    await pubsub.setConfigurationForm({node}, dataForm)
    Router.pushRoute('items', {node: nodeId})
  }

  render() {
    const {form} = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Configure</Text>
        {form && (
          <DataForm
            form={form}
            onSubmit={dataForm => this.onSubmit(dataForm)}
            onCancel={() => alert('cancel')}
          />
        )}
      </View>
    )
  }
}
