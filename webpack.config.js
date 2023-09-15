const path = require('path')
const webpack = require('webpack')
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'public'),
        },
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserJSPlugin({}),
            // new OptimizeCSSAssetsPlugin({}),
            new MiniCssExtractPlugin({})
        ],
    },
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    plugins:
        [new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/template.html'), // шаблон
            filename: 'index.html', // название выходного файла
        }),
            // new CleanWebpackPlugin(),
            // new webpack.HotModuleReplacementPlugin(),
            new MiniCssExtractPlugin(
                {
                    filename: "main.css", //
                }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.resolve(__dirname, './src/pics'),
                    to: path.resolve(__dirname, './dist/pics')
                }]
            })
        ],


    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                use: ['file-loader'],
                type: 'asset/resource',
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            }
        ],
    }

}