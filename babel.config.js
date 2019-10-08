const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
];
const plugins = [
    'add-module-exports',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/proposal-object-rest-spread',
];

module.exports = {
    presets,
    plugins,
};
