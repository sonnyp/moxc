import React, { Component } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";

import { online, xml, pubsub } from "../xmpp";
import { Link, Router } from "../routes";
import styles from "../styles";
import PubsubItemsList from "../components/PubsubItemsList";

export default class Items extends Component {
  static getInitialProps({ query }) {
    const { node } = query;
    return { node };
  }

  state = {
    items: []
  };

  async componentDidMount() {
    await online();

    this.updateItems();
  }

  async updateItems() {
    const { node } = this.props;

    this.setState({
      items: (await pubsub.items({ node })).children
    });
  }

  render() {
    const { node } = this.props;
    const { items } = this.state;

    return (
      <View style={{ ...styles.container }}>
        <Text style={styles.header}>Items</Text>
        <Link route="publish" params={{ node }}>
          <a>
            <Button title={"Publish new item"} />
          </a>
        </Link>
        <PubsubItemsList node={node} items={items} />
      </View>
    );
  }
}
