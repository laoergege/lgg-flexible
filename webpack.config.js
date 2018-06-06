const path = require('path');

const config = {
    devtool: 'source-map',
    entry: './demo/index.js',
    mode: "development",
    output: {
        filename: 'demo.js',
        path: path.resolve(__dirname, './dist'),
    },
    devServer: {
        contentBase: ['./demo', './dist'],
        //  局域网中的其它设备访问你本地的服务
        host: "0.0.0.0"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
            }
        ]
    }
}

module.exports = config;