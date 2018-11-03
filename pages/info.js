import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'
import DiscoFeaturesList from '../components/DiscoFeaturesList'
import DiscoIdentitiesList from '../components/DiscoIdentitiesList'

export default class Info extends Component {
  state = {
    identities: [],
    features: [],
  }

  static getInitialProps({query}) {
    return query
  }

  async componentDidMount() {
    await online()

    this.updateState()
  }

  async updateState() {
    const info = (await pubsub.info(this.props)).children

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
  }

  render() {
    const {features, identities} = this.state

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Info</Text>
        <Text style={styles.header}>Identities</Text>
        <DiscoIdentitiesList identities={identities} />
        <Text style={styles.header}>Features</Text>
        <DiscoFeaturesList features={features} />
      </View>
    )
  }
}
