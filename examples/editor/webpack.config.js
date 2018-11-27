const path = require('path')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const isProduction = process.env.NODE_ENV=='production'

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['mysql']
    }),
    isProduction && new BundleAnalyzerPlugin()
  ].filter(Boolean)
}
