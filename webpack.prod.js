const path = require('path');

module.exports = {
  entry: './src/boleto.js',
  mode: 'production',
  output: {
    filename: 'boleto.min.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'Boleto',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
