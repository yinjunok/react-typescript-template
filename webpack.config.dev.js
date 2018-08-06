const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
  }
};

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'asset/js/app-[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },

  devtool: 'inline-source-map',

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: 'happypack/loader?id=tsx',
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [babelLoader],
      },
      {
        test: /\.css$/,
        use: 'happypack/loader?id=css',
        include: [
          path.resolve(__dirname, 'src'),
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name]-[hash:8].[ext]',
          outputPath: 'asset/images/'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name]-[hash:8].[ext]',
          outputPath: 'asset/font/'
        }
      }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    open: true,
    port: 9000,
    hot: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/html/index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new HappyPack({
      id: 'tsx',
      threads: 4,
      threadPool: happyThreadPool,
      loaders: [
        babelLoader,
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: true,
          }
        },
        {
          loader: 'tslint-loader',
          options: {
            typeCheck: true,
          }
        }
      ],
    }),
    new HappyPack({
      id: 'css',
      threads: 4,
      threadPool: happyThreadPool,
      loaders: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        'postcss-loader',
      ],
    }),
  ],
}