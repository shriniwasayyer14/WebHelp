var webpack = require("webpack");
var BowerWebpackPlugin = require('bower-webpack-plugin');
var path = require("path");
module.exports = {
    entry:   "./js/WebHelp.js",
    output:  {
        path:     __dirname,
        filename: "bundle.js",
        libraryTarget: "var",
        library: "WebHelp"
    },
    module:  {
        loaders: [
            {test: /\.css$/, loader: "style!css"},
            {test: /\.styl$/, loader: "style!css!stylus-loader"},
            {test: /\.less$/, loader: "style!css!less"},
            {test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: "file-loader?name=[name].[ext]"}
        ]
    },
    plugins: [
        new BowerWebpackPlugin({
            //excludes: /.*\.less/
        }),
        new webpack.ProvidePlugin({
            $:      "jquery",
            jQuery: "jquery"
        })
    ]
};
