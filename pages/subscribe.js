import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'

import DataForm from '../components/DataForm'

export default class Subscribe extends Component {
  static getInitialProps({query}) {
    return query
  }

  state = {
    form: null,
  }

  async componentDidMount() {
    await online()

    this.fetchData()
  }

  async fetchData() {
    this.setState({
      form: await pubsub.getSubscriptionOptions(this.props),
    })
  }

  async onSubmit(dataForm) {
    await pubsub.subscribe(this.props, dataForm)
    Router.pushRoute('node', this.props)
  }

  async onCancel() {
    Router.pushRoute('node', this.props)
  }

  render() {
    const {form} = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Subscribe</Text>
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
