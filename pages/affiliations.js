import React, {Component} from 'react'
import {StyleSheet, Text, View, Button, FlatList} from 'react-native'

import {online, xml, pubsub} from '../xmpp'
import {Link, Router} from '../routes'
import styles from '../styles'
import PubsubAffiliationsList from '../components/PubsubAffiliationsList'

export default class Affiliations extends Component {
  state = {
    affiliations: [],
  }

  static getInitialProps({query}) {
    return query
  }

  async componentDidMount() {
    await online()

    this.updateAffiliations()
  }

  async updateAffiliations() {
    const affiliations = (await pubsub.getAffiliations(this.props)).children

    this.setState({
      affiliations,
    })
  }

  render() {
    const {affiliations} = this.state

    return (
      <View style={{...styles.container}}>
        <Text style={styles.header}>Affiliations</Text>
        <PubsubAffiliationsList affiliations={affiliations} />
      </View>
    )
  }
}
