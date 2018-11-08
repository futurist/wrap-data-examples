const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV=='production'

module.exports ={
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    isProduction && new BundleAnalyzerPlugin()
  ].filter(Boolean)
}
