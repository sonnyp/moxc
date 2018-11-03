import React, {Component} from 'react'
import {View} from 'react-native'
import {Card, Input, Button, Icon} from 'react-native-elements'

export default class Login extends Component {
  state = {
    address: '',
    password: '',
  }

  render() {
    const {onLogin} = this.props
    return (
      // can't type in input in Card for some reason
      <View style={{backgroundColor: 'white'}}>
        <Input
          label="Address"
          keyboardType="email-address"
          value={this.state.address}
          onChangeText={address => this.setState({address})}
          leftIcon={<Icon name="person" size={24} color="black" />}
        />
        <Input
          label="Password"
          secureTextEntry
          value={this.state.password}
          onChangeText={password => this.setState({password})}
          leftIcon={<Icon name="lock" size={24} color="black" />}
        />
        <Button title="Login" onPress={() => onLogin(this.state)} />
      </View>
    )
  }
}
