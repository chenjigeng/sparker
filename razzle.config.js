const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports =  {
  modify: (config, {target, dev}, webpack) => {
    // do something to config
    // console.log(config);
    const appConfig = Object.assign({}, config);
    if (target === 'web') {
      appConfig.module.rules.push(
        dev ? {
          test: /.less$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: require.resolve('less-loader') // compiles Less to CSS
            }
          ]
        } : {
          test: /.less$/,
          use: ExtractTextPlugin.extract({
            fallback: require.resolve('style-loader'),
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('less-loader') // compiles Less to CSS
              }
            ]
          })
        }
      )

      if (!dev) {
        appConfig.plugins.push(
          new ExtractTextPlugin('static/css/[name].[contenthash:8].css')
        )
        appConfig.plugins.push(
          new ManifestPlugin({
            fileName: 'asset-manifest.json',
          })
        );
        appConfig.plugins.push(
          new SWPrecacheWebpackPlugin({
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            logger(message) {
              if (message.indexOf('Total precache size is') === 0) {
                // This message occurs for every build and is a bit too noisy.
                return;
              }
              if (message.indexOf('Skipping static resource') === 0) {
                // This message obscures real errors so we ignore it.
                // https://github.com/facebookincubator/create-react-app/issues/2612
                return;
              }
              console.log(message);
            },
            minify: true,
            // For unknown URLs, fallback to the index page
            navigateFallback: process.env.PUBLIC_PATH + '/index.html',
            // Ignores URLs starting from /__ (useful for Firebase):
            // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            // Don't precache sourcemaps (they're large) and build asset manifest:
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
          })
        );
      }
    } else {
      appConfig.module.rules.push({
        test: /.less$/,
        use: 'css-loader',
      });
    }


    return appConfig
  }
}