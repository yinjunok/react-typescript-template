const path = require('path');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
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
    filename: 'asset/js/app-[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'happypack/loader?id=tsx',
        include: [
          path.resolve(__dirname, 'src'),
        ],
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
        use: [
          // 'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
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
          outputPath: 'asset/font/',
        }
      }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/html/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "asset/css/[name]-[hash:8].css",
      chunkFilename: "[id].css"
    }),
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
    new ManifestPlugin(),
  ],
}