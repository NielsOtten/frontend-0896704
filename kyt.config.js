/* eslint-disable import/no-extraneous-dependencies */

// Base kyt config.
// Edit these properties to make changes.
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  reactHotLoader: true,
  debug: false,
  hasServer: false,
  modifyWebpackConfig: (baseConfig) => {
    baseConfig.plugins.push(new HtmlWebpackPlugin({
      template: 'src/index.ejs',
    }));
    baseConfig.resolve.extensions.push('.jsx');
    // modify baseConfig based on the options
    return baseConfig;
  },
};
