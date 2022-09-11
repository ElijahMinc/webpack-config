const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const FriendlyErrorsWebpackPlugin = require("@soda/friendly-errors-webpack-plugin")
const path = require("path")

const PORT = 5000

let target = "web" // в режиме разработки browserslist не используется
let mode = "development"

if (process.env.NODE_ENV === "production") {
  mode = "production"
  target = "browserslist"
}

const isProd = mode === "production"

const plugins = [
  new HtmlWebpackPlugin({
    template: "./public/index.html", // Данный html будет использован как шаблон
    minify: {
      collapseWhitespace: isProd,
    },
  }),
  new MiniCssExtractPlugin({
    filename: "css/[name].[contenthash].css", // Формат имени файла
  }),
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: [`You application is running here http://localhost:${PORT}`],
      // notes: ['Happy development ^^']
    },
    onErrors: function (severity: any, errors: any) {
      // You can listen to errors transformed and prioritized by the plugin
      // severity can be 'error' or 'warning'
    },
    // should the console be cleared between each compilation?
    // default is true
    clearConsole: true,

    // add formatters and transformers (see below)
    additionalFormatters: [],
    additionalTransformers: [],
  }),
] // Создаем массив плагинов

if (!isProd) {
  plugins.push(new ReactRefreshWebpackPlugin())
}

const optimize = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: "single",
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "vendors",
    //       chunks: "all",
    //     },
    //   },
    // },
  }

  if (isProd) {
    (config as any).minimizer = [new TerserWebpackPlugin()]
  }
  return config
}

const aliases = () => ({
  "@": path.resolve(__dirname, "src"),
  "@components": path.resolve(__dirname, "src", "components"),
})

const babelPresets = (...listPresets: any[]) => {
  const presets = ["@babel/preset-env", "@babel/preset-react"]

  if (!!presets.length) {
    listPresets.forEach((preset) => presets.push(preset))
  }

  return presets
}
// ==================== LOGGER ==========================

console.log("isProd", isProd)

// ==================== /LOGGER ==========================

module.exports = {
  mode,
  plugins,
  target,
  // context: path.resolve(__dirname, "src"),
  entry: {
    index: path.resolve(__dirname, "src", "index"),
    // app: path.resolve(__dirname, "src", "app"),
  },
  devtool: mode === "development" ? "inline-source-map" : "source-map",
  optimization: optimize(),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `js/${isProd ? "main" : "[name]"}.[hash].js`,
    assetModuleFilename: "assets/[hash][ext][query]", // Все ассеты будут
    // складываться в dist/assets
    clean: true,
    chunkFilename: "[id].[chunkhash].js",
  },
  infrastructureLogging: {
    level: "error",
    colors: true,
    console: "HELLLLOOOOO",
  },
  devServer: {
    hot: true,
    open: true,
    port: PORT,
    allowedHosts: "all",
    historyApiFallback: true, // не прыгай
    // quiet: true, //Не отображать информацию консоли devServer, FriendlyErrorsWebpackPlugin заменит ее
    client: {
      progress: false,
      logging: "error",
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
  stats: "errors-warnings",
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    alias: aliases(),
  },
  module: {
    rules: [
      { test: /\.(html)$/, use: ["html-loader"] },
      {
        test: /\.(s[ac]|c)ss$/i, // /\.(le|c)ss$/i если вы используете less
        use: [
          mode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env", {}]],
              },
            },
          },
        ],
      }, // Добавляем загрузчики стилей
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: mode === "production" ? "asset" : "asset/resource", // В продакшен режиме
        // изображения размером до 8кб будут инлайнится в код
        // В режиме разработки все изображения будут помещаться в dist/assets
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true, // Использование кэша для избежания рекомпиляции
            presets: babelPresets("@babel/preset-typescript"),
          },
        },
      },
    ],
  },
}
