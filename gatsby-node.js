const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        plugins: [
            new webpack.ProvidePlugin({
                React: 'react',
                PropTypes: 'prop-types',
            }),
        ],
    });
};
