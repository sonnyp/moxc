const withTM = require('next-plugin-transpile-modules')

module.exports = withTM({
  transpileModules: ['react-native-web', 'react-native-simple-radio-button'],
  webpack: config => {
    // Alias all `react-native` imports to `react-native-web`
    config.resolve.alias = {
      'react-native$': 'react-native-web',
    }

    return config
  },
})
