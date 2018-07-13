const path = require('path');
const webpack = require('webpack');
const __global = require('./__global');


module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            react: path.resolve(__dirname, '..', 'node_modules', 'react'),
            'react-dom': path.resolve(__dirname, '..', 'node_modules', 'react-dom'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['react', 'es2015', 'stage-0'],
                        plugins: ['add-module-exports', 'transform-decorators-legacy'],
                    },
                }],
            },
            // {
            //     test: /\.md$/,
            //     use: [
            //         {
            //             loader: 'html-loader',
            //         },
            //         {
            //             loader: 'markdown-loader',
            //         },
            //     ],
            // },
            // {
            //     test: /\.md$/,
            //     use: [
            //         {
            //             loader: 'raw-loader',
            //         },
            //     ],
            // },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader',
                }],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            _global: JSON.stringify(__global),
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            PropTypes: 'prop-types',
        }),
    ],
};
