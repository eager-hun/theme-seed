
const merge = require("webpack-merge");
const common = require("./webpack-config-common.js");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = merge(common, {
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                mangle: true,
                warnings: false
            }
        })
    ]
});
