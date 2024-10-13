// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }], // Transpile modern JavaScript
    '@babel/preset-react', // Handle JSX for React
    '@babel/preset-typescript' // Handle TypeScript files
  ]
};