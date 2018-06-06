const path = require('path');

const config = {
    entry: './lib/flexible.js',
    mode: "production",
    output: {
        filename: 'flexible.min.js',
        path: path.resolve(__dirname, './dist'),
        library: 'flexible',
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            }
        ]
    }
}

module.exports = config;