const path = require("path");
const rootPath = path.join(__dirname, "../..");

module.exports = {
  context: rootPath, // <-- NOTE!
  entry: {
    index: "./src/js-modules/index.js",
  },
  output: {
    path: path.resolve(rootPath, "built/webpack-out"),
    filename: "[name].built.js",
  },
  resolve: {
    modules: [
      path.resolve(rootPath, "src"),
      "node_modules",
      "libraries-frontend/node_modules"
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              loaders: {
                "scss": [
                  "vue-style-loader",
                  "css-loader",
                  "sass-loader",
                  {
                    loader: "sass-resources-loader",
                    options: {
                      resources: [
                        path.resolve(rootPath, "src/scss/_variables.scss"),
                        path.resolve(rootPath, "src/scss/sass-tools/_sass-tools.scss")
                      ]
                    }
                  }
                ],
                "sass": [
                  "vue-style-loader",
                  "css-loader",
                  "sass-loader?indentedSyntax"
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {}
      },
      {
        test: /\.(jpg|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash:8].[ext]"
          }
        }
      }
    ]
  },
};
