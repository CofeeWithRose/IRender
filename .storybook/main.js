/*
 * @Author: muyin
 * @Date: 2021-01-02 16:59:05
 * @email: muyin.ph@alibaba-inc.com
 */
const path = require('path')

 module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: config => {

    config.resolve.extensions.push('.ts', '.tsx')
    config.resolve.alias['i-render'] = path.resolve(__dirname, '../lib/src/index.js')

    config.module.rules[0].test= /\.ts(x)?$/
    const babelConfig = config.module.rules[0].use[0].options
    babelConfig.presets.push(require.resolve('@babel/preset-typescript'))
    return config
  }
};
