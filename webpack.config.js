const { resolve } = require('path');
const webpack = require('webpack');

const config = {
  stats: {
    maxModules: 0
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',

  entry: {
    app: './js/index.js'
  },

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, './dist'),
    publicPath: '',
  },

  context: resolve(__dirname, 'fancyCars'),

  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'build'),
    historyApiFallback: true,
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
		use: [
		  {
			loader: 'babel-loader',
			options: {
			  presets: ['react']
			}
		  }
		],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['css-hot-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/png',
              name: 'images/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ],
      },
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      test: /\.jsx?$/,
      options: {
        eslint: {
          configFile: resolve(__dirname, '.eslintrc'),
          cache: false,
        }
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]
};

module.exports = config;