import React, {Component} from 'react'
import {View, Switch} from 'react-native'
import {Card, Input, Button, Icon, Text} from 'react-native-elements'

export default class Login extends Component {
  state = {
    trust: true,
    address: '',
    password: '',
    service: 'ws://xmppjs.org:5280/xmpp-websocket',
  }

  render() {
    const {trust, address, password} = this.state

    const {onLogin} = this.props
    return (
      // can't type in input in Card for some reason
      <View style={{backgroundColor: 'white'}}>
        <Input
          label="Address"
          keyboardType="email-address"
          value={address}
          onChangeText={address => this.setState({address})}
          leftIcon={<Icon name="person" size={24} color="black" />}
          textContentType="username"
        />
        <Input
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={password => this.setState({password})}
          leftIcon={<Icon name="lock" size={24} color="black" />}
          textContentType="password"
        />
        <Text>Trust this device</Text>
        <Switch value={trust} onValueChange={trust => this.setState({trust})} />
        <Button title="Login" onPress={() => onLogin(this.state)} />
      </View>
    )
  }
}
