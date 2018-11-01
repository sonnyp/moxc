import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'

import DataForm from '../components/DataForm'

export default class Create extends Component {
  state = {
    form: null,
  }

  async componentDidMount() {
    await online()

    this.updateConfiguration()
  }

  async updateConfiguration() {
    this.setState({
      form: await pubsub.getDefaultConfigurationForm({}),
    })
  }

  async onSubmit(dataForm) {
    const nodeId = await pubsub.createWithForm({}, dataForm)
    Router.pushRoute('items', {node: nodeId})
  }

  render() {
    const {form} = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Create</Text>
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
