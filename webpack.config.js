module.exports = {
    entry: './web/app.es6',
    output: {
        path: require('path').resolve('./web'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony' },
            { test: /\.es6$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony' }
        ]
    }
};
