const path = require("path");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MODE = process.env.NODE_ENV === "production" ? "production" : "development";
let filename = "[name].js";
if (MODE == "production" ) {
  // filename = "[name]-[hash].js";
}

// ソース・出力先の設定
const opts = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'dist')
}


// entry
const files = {
  index: 'assets/js/index.js'
}

const cssLoader = { 
  loader: 'css-loader',
  options: {
    url: false   // url()を変換しない
  }
};
let common = {
  mode: MODE,
  context: opts.src,
  entry: files,
  output: {
      path: opts.dest ,
      filename: 'assets/js/' + filename
  },
  resolve: {
      modules: [opts.src, "node_modules"],
      extensions: [".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader"}
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  }
};


if (MODE === "development") {
  console.log("Building for dev...");
  module.exports = merge(common, {
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: [/elm-stuff/, /node_modules/],
          use: [
            { loader:"style-loader"}, 
            cssLoader
          ]
        }
      ]
    },
    // 開発サーバの設定
    devServer: {
      contentBase: './src/html',
      inline: true,
      port: 8080,
      host:"0.0.0.0",
      hot: true,
      clientLogLevel: "info",
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 5000
    }
  });
}

if (MODE === "production") {
  console.log("Building for Production...");
  module.exports = merge(common, {
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '/assets/css/[name].css',
        chunkFilename: '/assets/css/[id].css'
      })
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: [/elm-stuff/, /node_modules/],
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                  url: false,
                  minimize: true,
              }
            }
          ]
        }
      ]
    }
  });
}
