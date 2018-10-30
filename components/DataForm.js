'use strict'

import {FlatList, View, Text, Switch, TextInput} from 'react-native'

import RadioForm from 'react-native-simple-radio-button'

import styles from '../styles'
import {Link} from '../routes'

const NS_X_DATA = 'jabber:x:data'

export default function DataForm(props) {
  const {form} = props
  if (!form) return <View />

  const title = form.getChildText('title')
  const instructions = form.getChildText('instructions')
  const fields = form.getChildren('field')

  return (
    <View>
      {title && <Text>{title}</Text>}
      {instructions && <Text>{instructions}</Text>}
      {fields.map(field => {
        const {type, label} = field.attrs
        const key = field.attrs.var
        const value = field.getChildText('value') || ''
        const options = field.getChildren('option')

        let formInput

        if (type === 'list-single') {
          const props = options.map(option => {
            return {
              label: option.attrs.label,
              value: option.getChildText('value'),
            }
          })

          formInput = <RadioForm key={key} radio_props={props} />
        } else if (type === 'jid-single') {
          formInput = (
            <TextInput
              style={styles.input}
              value={value}
              keyboardType="email-address"
              placeholder={label}
            />
          )
        } else if (type === 'text-private') {
          formInput = (
            <TextInput
              style={styles.input}
              value={value}
              secureTextEntry={true}
              placeholder={label}
            />
          )
        } else if (type === 'text-single') {
          formInput = (
            <TextInput style={styles.input} value={value} placeholder={label} />
          )
        } else if (type === 'boolean') {
          formInput = <Switch value={value === '1'} />
        } else {
          formInput = null
        }

        return (
          <View key={key}>
            <Text>{label}</Text>
            {formInput}
          </View>
        )
      })}
    </View>
  )
}
