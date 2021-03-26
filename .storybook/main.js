const path = require('path')

 module.exports = {
  stories: ['../stories/**/*.sb.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: config => {

    // config.resolve.alias['i-render'] = path.resolve(__dirname, '../lib/src/index.js')
    config.resolve.alias['i-render'] = path.resolve(__dirname, '../src/index.ts')

    return config
  }
};
