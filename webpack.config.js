const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path');

module.exports = {
  entry: './lambda-handler.js',
  // entry: './function.js',
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: __dirname,
        exclude: /node_modules/
      },
      // {
      //   test: /\.yml$/,
      //   include: [
      //     path.resolve(__dirname, 'config')
      //   ],
      //   loader: 'json-loader!yaml-loader!'
      // },
      {
        include: [
          path.resolve(__dirname, 'config')
        ],
        use: {
          loader: 'file-loader',
          options: {
            name: './config/[name].[ext]'
          }
        }
      }
    ]
  },
  // devtool: "source-map",
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ],
  // we use webpack-node-externals to excludes all node deps.
  // You can manually set the externals too.
  externals: [nodeExternals()]
};
