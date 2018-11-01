import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'

import DataForm from '../components/DataForm'

export default class Create extends Component {
  static getInitialProps({query}) {
    return query
  }

  state = {
    form: null,
  }

  async componentDidMount() {
    await online()

    this.updateConfiguration()
  }

  async updateConfiguration() {
    this.setState({
      form: await pubsub.getDefaultConfigurationForm(this.props),
    })
  }

  async onSubmit(dataForm) {
    const nodeId = await pubsub.createWithForm(this.props, dataForm)
    Router.pushRoute('items', {...this.props, node: nodeId})
  }

  onCancel() {
    Router.pushRoute('nodes', this.props)
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
            onCancel={() => this.onCancel()}
          />
        )}
      </View>
    )
  }
}
