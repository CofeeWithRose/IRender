module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: config => {
    config.module.rules[0].test= /\.ts(x)?$/
    const babelConfig = config.module.rules[0].use[0].options
    babelConfig.presets.push(require.resolve('@babel/preset-typescript'))
    return config
  }
};
