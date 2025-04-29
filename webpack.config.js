const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: './src/index.jsx',
    output: {
        filename: 'index.js',
        path: __dirname + '/build'
    }
};

