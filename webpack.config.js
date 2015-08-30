module.exports = {
    entry: './app/static/js/main.js',
    output: {
        path: 'app/static',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    }
};
