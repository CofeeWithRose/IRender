// const { buildStaticStandalone } = require('@storybook/core')
const bok = require('@storybook/core-server')
const packageJson = require('../package.json')

// import { sync } from 'read-pkg-up';

const options =  {
  packageJson,
  framework: 'react',
  frameworkPresets:bok.managerPreset.frameworkPresets,
};

console.log(bok.buildStatic(options));