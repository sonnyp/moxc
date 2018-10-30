'use strict'

const xml = require('@xmpp/xml')
const NS_X_DATA = 'jabber:x:data'

module.exports = function build({type, title, instructions = []}, fields) {
  return xml(
    'x',
    {xmlns: NS_X_DATA, type},
    title && xml('title', {}, title),
    ...instructions.map(inst => xml('instructions', {}, inst)),
    fields.map(field => {
      const {type, label, value} = field
      const _var = field.var
      return xml('field', {var: _var, type, label}, xml('value', {}, value))
    })
  )
}
