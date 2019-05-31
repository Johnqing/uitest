const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
    // mode: "production",
    entry: './src/index.js',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        clientLogLevel: 'info',
        open: false
    },
    resolve: {
        extensions: [".js", ".json", ".less"]
    },
    externals: {
        'echarts': 'echarts'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [{
                    loader: "babel-loader"
                }]
            },
            {
                test: /\.svg$/,
                include: [
                    path.resolve(__dirname, './src/pages/'),
                ],
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: 'icon-[name]'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },

                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    },

                    {
                        loader: 'less-loader' // compiles Less to CSS
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },

                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    }
                ]
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',   // initial、async和all
            minSize: 30000,   // 形成一个新代码块最小的体积
            maxAsyncRequests: 5,   // 按需加载时候最大的并行请求数
            maxInitialRequests: 3,   // 最大初始化请求数
            automaticNameDelimiter: '~',   // 打包分割符
            name: true,
            cacheGroups: {
                vendors: { // 基本框架
                  chunks: 'all',
                  test: /(react|react-dom|react-dom-router)/,
                  priority: 100,
                  name: 'vendors',
                },
                commons: { // 其余同步加载包
                  chunks: 'all',
                  minChunks: 2,
                  name: 'commons',
                  priority: 80,
                },
              }

          },
    },
    performance: {
        hints: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.ejs',
            template: './view/index.ejs',
            minify: {
                // 折叠空白符
                collapseWhitespace: true,
                // 移除注释
                removeComments: true,
                // 移除属性多余的引号
                removeAttributeQuotes: true
            }
        })
    ],
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist')
    }
};