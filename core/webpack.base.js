const path = require('path')
const webpack = require('webpack')
const ChromeReloadPlugin = require('wcer')
const {cssLoaders, htmlPage, RequireFromString} = require('./tools')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const Manifest = require('')

let resolve = dir => path.join(__dirname, '..', 'src', dir)
module.exports = {
    entry: {
        // tab: resolve('./tab'),
        popup: resolve('./popup'),
        // options: resolve('./options'),
        // content: resolve('./content'),
        // devtools: resolve('./devtools'),
        background: resolve('./backend'),
        // panel: resolve('./devtools/panel'),
        // inject: resolve('./content/inject'),
    },
    output: {
        path: path.join(__dirname, '..', 'build'),
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].[name].js?[hash]',
        library: '[name]'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true,
                    loaders: {
                        ...cssLoaders(),
                        js: {loader: 'babel-loader',}
                    },
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test')],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.html$/,
                loader: 'raw-loader',
            }

        ]
    },
    plugins: [
        // htmlPage('home', 'app', ['tab']),
        htmlPage('popup', 'popup', ['manifest', 'vendor', 'popup']),
        // htmlPage('panel', 'panel', ['panel']),
        // htmlPage('devtools', 'devtools', ['devtools']),
        // htmlPage('options', 'options', ['options']),
        htmlPage('background', 'background', ['manifest', 'vendor', 'background']),
        new CopyWebpackPlugin([{from: path.join(__dirname, '..', 'static')}]),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, '..', 'src', 'manifest.js'),
            to: 'manifest.json',
            transform(content, path) {
                content = RequireFromString(content.toString())
                return Buffer.from(JSON.stringify(content))
            },
        }])
        // new CopyWebpackPlugin([{from: path.join(__dirname, '..', 'static')}]),
        // new ChromeReloadPlugin({
        //     // port: 3001,
        //     manifest: path.join(__dirname, '..', 'src', 'manifest.js')
        // }),
    ],
    performance: {hints: false},
}