'use strict'

const NS_X_DATA = 'jabber:x:data'

module.exports = function parse(parent) {
  const element = parent.getChild('x', NS_X_DATA)

  const {type} = element.attrs
  const title = element.getChildText('title')
  const instructions = element
    .getChildren('instructions')
    .map(el => el.getText())

  const fields = element.getChildren('field').map(fieldElement => {
    const {type, label} = fieldElement.attrs
    const _var = fieldElement.attrs.var
    const value = fieldElement.getChildText('value')

    return {type, label, var: _var, value}
  })

  return [{type, title, instructions}, fields]
}
