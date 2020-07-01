const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

module.exports = {
  entry: './app/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].bundle.js'
  },
  devServer: {
    contentBase: __dirname + '/app',
    disableHostCheck: true,
    port: 8080,
    contentBasePublicPath: '/qrscan',
    publicPath: '/qrscan/',
    public: 'qcc.evntez.com/qrscan'
  },
  optimization: {},
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [{ urlPattern: new RegExp('/'), handler: 'staleWhileRevalidate' }]
    }),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      minify: {
        collapseWhitespace: true
      }
    }),
    new ExtractTextPlugin({
      filename: 'styles.css'
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      }
    }),
    new CopyWebpackPlugin([{ from: 'images/', to: 'images' }, 'decoder.js', 'manifest.json', 'CNAME'], {
      context: './app'
    }),
    new SitemapPlugin('https://qcc.evntez.com/qrscan', ['/'])
  ],
  module: {
    noParse: [/dtrace-provider$/, /safe-json-stringify$/, /mv/],
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?importLoaders=1',
          fallback: 'style-loader'
        })
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        use: ['file-loader']
      }
    ]
  }
};
