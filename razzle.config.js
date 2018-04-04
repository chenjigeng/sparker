const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


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