const path = require('path')

 module.exports = {
  stories: ['../stories/**/*.sb.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: config => {

    config.resolve.extensions.push('.ts', '.tsx')
    config.resolve.alias['i-render'] = path.resolve(__dirname, '../lib/src/index.js')

    return config
  }
};
