const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const entryFileName = process.env.FILE || "article_editor";
const outputFileName = entryFileName.split("_").reduce((previous, current) => {
  const _fileName = current.substring(0, 1).toUpperCase();
  return previous + _fileName + current.substring(1, current.length);
}, "");

module.exports = {
  // context: path.resolve(__dirname, "./comps/src"),
  entry: {
    common_react: ["react", "react-dom", "react-icons"],
    // article_editor: "./comps/src/ArticleEditor/index.tsx",
    // article_list: "./comps/src/ArticleList/index.tsx",
    [entryFileName]: "./comps/src/" + outputFileName + "/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "./comps/dist"),
    // filename: "./[name].min.js",
    filename: "./" + entryFileName + "/[name].min.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules|comps\/ckeditor/,
        use: "ts-loader",
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devtool: "cheap-module-source-map",
  cache: false,
  plugins: [
    new HtmlWebpackPlugin({
      filename:
        process.env.NODE_ENV === "production"
          ? entryFileName + "/" + entryFileName + ".html"
          : "index.html",
      // filename:  "index.html",
      template: path.join(__dirname, "index.html"),
    }),
  ],
  devServer: {
    static: [
      {
        directory: __dirname,
        serveIndex: true,
      },
      {
        directory: path.join(__dirname, "comps"),
      },
    ],
    // port: 3000,
    host: "0.0.0.0",
    hot: true,
  },
};
