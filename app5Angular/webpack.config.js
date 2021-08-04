// @ts-ignore
const path = require("path");
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const AngularCompilerPlugin = require("@ngtools/webpack").AngularCompilerPlugin;
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = function (env) {
  const analyzeBundle = !!(env && env.analyzeBundle);
  const prodMode = !!(env && env.prod);

  const plugins = [
    new ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.resolve(__dirname, "../src")
    ),
    new AngularCompilerPlugin({
      mainPath: path.resolve(__dirname, "src/singleSpaEntry.ts"),
      tsConfigPath: path.resolve(__dirname, "tsconfig.json"),
      sourceMap: !prodMode,
      skipCodeGeneration: !prodMode,
      platform: 0,
      hostReplacementPaths: {
        "environments/environment.ts": prodMode
          ? "environments/environment.prod.ts"
          : "environments/environment.ts",
      },
    }),
  ];

  if (analyzeBundle) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  const devTypescriptLoader = [
    {
      test: /\.ts$/,
      loader: "@ngtools/webpack",
    },
  ];

  const prodTypescriptLoader = [
    {
      test: /\.js$/,
      use: [
        {
          loader: "@angular-devkit/build-optimizer/webpack-loader",
          options: {
            sourceMap: false,
          },
        },
      ],
    },
    {
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      use: [
        {
          loader: "@angular-devkit/build-optimizer/webpack-loader",
          options: {
            sourceMap: false,
          },
        },
        "@ngtools/webpack",
      ],
    },
  ];

  const typescriptLoader = prodMode
    ? prodTypescriptLoader
    : devTypescriptLoader;

  return {
    entry: {
      singleSpaEntry: "src/singleSpaEntry.ts",
      store: "src/store.ts",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "app5"),
      libraryTarget: "umd",
      library: "app5",
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },

        {
          test: /\.html$/i,
          use: [
            // ...The other file-loader and extract-loader go here.
            {
              loader: "file-loader",
              options: {
                // THIS will resolve relative URLs to reference from the app/ directory

                name: "[name].html",
              },
            },
            {
              loader: "extract-loader",
            },
            {
              loader: "html-loader",
              options: {
                attrs: ["img:src"],
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "app5/assets/[name].[ext]",
              },
            },
          ],
        },

        {
          test: /\.(eot|svg|cur)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            publicPath: "/app5/",
            root: path.resolve(__dirname, "app5"),
          },
        },

        { test: /\.ts?x$/, loader: "ts-loader", exclude: ["node_modules"] },

        {
          exclude: [path.join(process.cwd(), "src/styles.scss")],
          test: /\.scss$|\.sass$/,
          use: [
            "exports-loader?module.exports.toString()",
            "css-loader",
            "sass-loader",
            "postcss-loader",
          ],
        },
        {
          include: [path.join(process.cwd(), "src/styles.scss")],
          test: /\.scss$|\.sass$/,
          use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
        },
      ].concat(typescriptLoader),
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: false,
          parallel: true,
          uglifyOptions: {
            ecma: 6,
            warnings: false,
            ie8: false,
            mangle: true,
            compress: {
              pure_getters: true,
              passes: 2,
            },
            output: {
              ascii_only: true,
              comments: false,
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      modules: [__dirname, "node_modules"],
    },
    mode: "development",
    devtool: prodMode ? "none" : "inline-sourcemap",
    externals: [],
    plugins: plugins,
  };
};
