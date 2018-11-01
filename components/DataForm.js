'use strict'

import {Component} from 'react'
import {
  FlatList,
  View,
  Text,
  Switch,
  TextInput,
  Picker,
  Button,
} from 'react-native'

import xml from '@xmpp/xml'

import buildDataForm from '../xmpp/data-forms/build'
import parseDataForm from '../xmpp/data-forms/parse'
import styles from '../styles'
import {Link} from '../routes'

const NS_X_DATA = 'jabber:x:data'

function buildState(fields) {
  return fields.reduce((accumulator, {key, value, type}) => {
    if (type === 'hidden') return accumulator

    accumulator[key] = value
    return accumulator
  }, {})
}

function buildSubmitForm(fields, state) {
  return xml(
    'x',
    {xmlns: NS_X_DATA, type: 'submit'},
    ...fields.map(({type, key}) => {
      if (type === 'hidden') return null
      return xml('field', {var: key, type}, xml('value', {}, state[key]))
    })
  )
}

class DataForm extends Component {
  constructor(...args) {
    super(...args)

    const {form} = this.props

    const [{title, instructions}, fields] = parseDataForm(form)

    this.title = title
    this.instructions = instructions
    this.fields = fields
    this.state = buildState(fields)
  }

  onPressSubmit() {
    this.props.onSubmit(buildSubmitForm(this.fields, this.state))
  }

  onPressCancel() {
    this.props.onCancel()
  }

  render() {
    const {props, title, instructions, fields} = this
    const {form, onSubmit, onCancel} = props
    if (!form) return <View />

    return (
      <View>
        {title && <Text>{title}</Text>}
        {instructions && <Text>{instructions}</Text>}
        {fields.map(({type, label, key, value, options}) => {
          let input = null

          if (type === 'list-single') {
            input = (
              <Picker
                selectedValue={this.state[key] || ''}
                style={{height: 50, width: 100}}
                onValueChange={value => this.setState({[key]: value})}
              >
                ><Picker.Item label="" value="" />
                {options.map(({label, value}) => {
                  return <Picker.Item label={label} value={value} />
                })}
              </Picker>
            )
          } else if (type === 'jid-single') {
            input = (
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                value={this.state[key] || ''}
                onChangeText={value => this.setState({[key]: value})}
              />
            )
          } else if (type === 'text-private') {
            input = (
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                value={this.state[key] || ''}
                onChangeText={value => this.setState({[key]: value})}
              />
            )
          } else if (type === 'text-single') {
            input = (
              <TextInput
                style={styles.input}
                value={this.state[key] || ''}
                onChangeText={value => this.setState({[key]: value})}
              />
            )
          } else if (type === 'boolean') {
            input = (
              <Switch
                value={this.state[key]}
                onValueChange={value => this.setState({[key]: value})}
              />
            )
          }

          return (
            <View key={key}>
              <Text>{label}</Text>
              {input}
            </View>
          )
        })}

        <View style={{flexDirection: 'row'}}>
          {onCancel && (
            <Button onPress={() => this.onPressCancel()} title="Cancel" />
          )}
          {onSubmit && (
            <Button onPress={() => this.onPressSubmit()} title="Submit" />
          )}
        </View>
      </View>
    )
  }
}

export default DataForm
