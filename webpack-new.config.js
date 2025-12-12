const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    entry: {
      background: './src/extension/background/index.ts',
      content: './src/extension/content/content-script.ts',
      provider: './src/extension/content/provider.ts',
      popup: './src/extension/popup/index.tsx',
      options: './src/extension/options/index.tsx',
      dashboard: './src/app/pages/Dashboard/index.tsx'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true,
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@app': path.resolve(__dirname, 'src/app'),
        '@extension': path.resolve(__dirname, 'src/extension'),
        '@wallet': path.resolve(__dirname, 'src/wallet'),
        '@did': path.resolve(__dirname, 'src/did'),
        '@components': path.resolve(__dirname, 'src/app/components'),
        '@services': path.resolve(__dirname, 'src/app/services'),
        '@utils': path.resolve(__dirname, 'src/app/utils'),
        '@hooks': path.resolve(__dirname, 'src/app/hooks'),
        '@context': path.resolve(__dirname, 'src/app/context')
      },
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        vm: false
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      }),
      new HtmlWebpackPlugin({
        template: './src/extension/popup/popup.html',
        filename: 'popup.html',
        chunks: ['popup']
      }),
      new HtmlWebpackPlugin({
        template: './src/extension/options/options.html',
        filename: 'options.html',
        chunks: ['options']
      }),
      new HtmlWebpackPlugin({
        template: './src/app/pages/Dashboard/dashboard.html',
        filename: 'dashboard.html',
        chunks: ['dashboard']
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'manifest-new.json', to: 'manifest.json' },
          { from: 'public', to: '.', noErrorOnMissing: true }
        ]
      })
    ],
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          }
        }
      }
    }
  };
};
