import {StyleSheet} from 'react-native'
import {grey} from 'ansi-colors'

export default StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    fontSize: 24,
  },
  input: {height: 40, borderColor: 'gray', borderWidth: 1},
  listItem: {
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: grey,
  },
})
