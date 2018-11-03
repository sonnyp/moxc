const withTM = require('next-plugin-transpile-modules')
const path = require('path')

module.exports = withTM({
  transpileModules: [
    'react-native-web',
    'react-native-elements',
    'react-native-vector-icons',
  ],
  webpack: config => {
    // Alias all `react-native` imports to `react-native-web`
    config.resolve.alias = {
      'react-native$': 'react-native-web',
    }

    config.module.rules.push({
      test: /\.(jpe?g|png|svg|gif)$/,
      use: [
        {
          loader: 'url-loader',
          // options: {
          //   limit: 8192,
          //   fallback: 'file-loader',
          //   publicPath: '/_next/',
          //   outputPath: 'static/images/',
          //   name: '[name]-[hash].[ext]',
          // },
        },
      ],
    })

    config.module.rules.push({
      test: /\.ttf$/,
      loader: 'url-loader',
      include: path.resolve(
        __dirname,
        'node_modules/react-native-vector-icons'
      ),
    })

    return config
  },
})
