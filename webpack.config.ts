// import * as path from "path"

const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")
const FriendlyErrorsWebpackPlugin = require("@soda/friendly-errors-webpack-plugin")
const path = require("path")

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
  new FriendlyErrorsWebpackPlugin(),
] // Создаем массив плагинов

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
    ;(config as any).minimizer = [new TerserWebpackPlugin()]
  }
  return config
}

const aliases = () => ({
  "@": path.resolve(__dirname, "src"),
  "@components": path.resolve(__dirname, "src", "components"),
})

const babelPresets = (preset: string) => {
  const presets = ["@babel/preset-env"]

  if (preset) {
    presets.push(preset)
  }

  return presets
}
// ==================== LOGGER ==========================

console.log("isProd", isProd)

// ==================== /LOGGER ==========================

const config = {
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

  devServer: {
    hot: true,
    open: true,
    port: 5000,
    historyApiFallback: true, // не прыгай
    // quiet: true, //Не отображать информацию консоли devServer, FriendlyErrorsWebpackPlugin заменит ее
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      // overlay: {
      //   errors: true,
      //   warnings: false,
      // },
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
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

export default config
