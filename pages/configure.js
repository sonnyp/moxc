import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'

import DataForm from '../components/DataForm'

export default class Configure extends Component {
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
      form: await pubsub.getConfiguration(this.props),
    })
  }

  async onSubmit(dataForm) {
    await pubsub.setConfiguration(this.props, dataForm)
    Router.pushRoute('node', this.props)
  }

  async onCancel() {
    Router.pushRoute('node', this.props)
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
            onCancel={() => this.onCancel()}
          />
        )}
      </View>
    )
  }
}
