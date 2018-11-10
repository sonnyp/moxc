import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub, disco} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'
import DiscoFeaturesList from '../components/DiscoFeaturesList'
import DiscoIdentitiesList from '../components/DiscoIdentitiesList'
import DiscoItemsList from '../components/DiscoItemsList'
import {withRouter} from 'next/router'

class Entity extends Component {
  state = {
    identities: [],
    features: [],
    items: [],
  }

  static getInitialProps({query}) {
    return query
  }

  componentDidUpdate(prevProps) {
    const {pathname, query} = this.props.router
    if (prevProps.to !== this.props.to || prevProps.node !== this.props.node) {
      this.setState({
        identities: [],
        features: [],
        items: [],
      })

      this.updateState()
    }
  }

  async componentDidMount() {
    await online()

    this.updateState()
  }

  async updateState() {
    const {to, node} = this.props

    try {
      const info = (await disco.info(to, node)).children

      const features = info.filter(el => {
        return el.name === 'feature'
      })

      const identities = info.filter(el => {
        return el.name === 'identity'
      })

      this.setState({
        features,
        identities,
      })
    } catch (err) {
      console.error(err)
    }

    try {
      const items = (await disco.items(to, node)).children
      this.setState({
        items,
      })
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const {features, identities, items} = this.state
    const {to} = this.props

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Identities</Text>
        <DiscoIdentitiesList identities={identities} />
        <Text style={styles.header}>Features</Text>
        <DiscoFeaturesList to={to} features={features} />
        <Text style={styles.header}>Items</Text>
        <DiscoItemsList items={items} />
      </View>
    )
  }
}

export default withRouter(Entity)
