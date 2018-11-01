'use strict'

const NS_X_DATA = 'jabber:x:data'

module.exports = function parse(element) {
  const {type} = element.attrs
  const title = element.getChildText('title')
  const instructions = element
    .getChildren('instructions')
    .map(el => el.getText())

  const fields = element.getChildren('field').map(fieldElement => {
    const {type, label} = fieldElement.attrs
    const _var = fieldElement.attrs.var
    const required = !!fieldElement.getChild('required')
    let options = null
    let value = fieldElement.getChildText('value')

    if (type === 'boolean') {
      value = value === '1' || value === 'true'
    }

    if (['list-single', 'list-multi'].includes(type)) {
      options = fieldElement.getChildren('option').map(optionElement => {
        return {
          label: optionElement.attrs.label,
          value: optionElement.getChildText('value'),
        }
      })
    }

    return {type, label, key: _var, value, required, options}
  })

  return [{type, title, instructions}, fields]
}
