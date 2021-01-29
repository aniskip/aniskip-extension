const { merge } = require("webpack-merge");
const base = require("./webpack.config");

module.exports = merge(base, {
  devtool: "cheap-module-source-map",
});
