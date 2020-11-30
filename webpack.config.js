const webpack = require('webpack');
const path = require('path');
const nodeSass = require('node-sass');
const bourbon = require('bourbon');
const Dotenv = require('dotenv-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

// variables
// isProduction: is this a prod-like environment (stage, prod)
const isProduction = (process.argv.indexOf('-p') >= 0 ||
    process.env.NODE_ENV === 'production') &&
    process.env.NODE_ENV !== 'dev';
const runBundleReport = (process.env.RUN_BUNDLE_REPORT === 'true');

const rootPath = path.join(__dirname);
const sourcePath = path.join(__dirname, 'src');
const assetsPath = path.join(__dirname, 'src', 'assets');
const publicPath = path.join(__dirname, 'public');
const outPath = path.join(__dirname, 'dist');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

// functions
const encodebase64 = (str) => {
    const buffer = new Buffer.from(str.getValue());
    return nodeSass.types.String(buffer.toString('base64'));
};


module.exports = {
    context: sourcePath,
    entry: {
        app: './index.tsx',
    },
    output: {
        path: outPath,
        filename: 'static/js/[name].bundle.[hash].js',
        chunkFilename: 'static/js/[name].[chunkhash].js',
        publicPath: '/',
    },
    target: 'web',
    devtool: isProduction ? false : 'eval-source-map',
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.scss'],
        // Fix webpack's default behavior to not load packages with jsnext:main module
        // (jsnext:main directs not usually distributable es6 format, but es6 sources)
        mainFields: ['module', 'browser', 'main'],
        modules: ['node_modules', sourcePath],
    },
    externals: [ 'aws-sdk', 'commonjs2 firebase-admin' ],
    module: {
        rules: [
            // .ts, .tsx
            {
                test: /^.*\.tsx?$/,
                exclude: /^.*\.(spec|test)\.tsx?$/,
                use: [
                    isProduction && {
                        loader: 'babel-loader',
                        options: {plugins: ['react-hot-loader/babel']},
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            onlyCompileBundledFiles: true,
                            transpileOnly: true
                        },
                    }
                ].filter(Boolean),
            },
            // css
            {
                test: /\.s?css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    "css-modules-typescript-loader",
                    {
                        loader: 'css-loader',
                        query: {
                            modules: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('postcss-import')({addDependencyTo: webpack}),
                                require('postcss-url')(),
                                require('postcss-preset-env')({stage: 4}),
                                require('postcss-reporter')(),
                            ],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: !isProduction,
                            implementation: require('sass'),
                            sassOptions: {
                                functions: {
                                    encodebase64: encodebase64,
                                    includePaths: [assetsPath].concat(bourbon.includePaths),
                                },
                            },
                        },
                    },
                ].filter(Boolean),
            },
            // static assets
            {
                test: /\.(eot|ttf|otf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'static/[path][name].[contenthash].[ext]',
                }
            },
            {
                test: /\.(jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: 'static/[path][name].[contenthash].[ext]',
                }
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 6000,
                            name: 'static/[path][name].[contenthash].[ext]',
                        }
                    }
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {loader: "babel-loader"},
                    {
                        loader: "react-svg-loader",
                        options: {jsx: true}
                    }
                ]
            },
            {
                test: /\.(ogg|wav)$/,
                loader: 'file-loader',
                include: [path.resolve(__dirname, 'src/assets/sounds')],
                options: {
                    name: 'static/media/[path][name].[contenthash].[ext]'
                }
            }
        ],
    },
    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: -10,
                },
            },
        },
        runtimeChunk: true,
        usedExports: true,
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.join(rootPath, 'tsconfig.json')
            }
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false,
            DISABLE_IN_PROGRESS_FEATURES: false,
        }),
        new Dotenv(),
        new CleanWebpackPlugin(),
        new ManifestPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash].css',
            disable: !isProduction,
        }),
        new HtmlWebpackPlugin({
            template: path.join(publicPath, 'index.html'),
            favicon: path.join(publicPath, 'favicon.ico'),
        }),
        runBundleReport ? new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
            analyzerMode: 'static',
        }) : null,
    ].filter(x => x !== null),
    devServer: {
        contentBase: sourcePath,
        disableHostCheck: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        historyApiFallback: {
            disableDotRule: true,
        },
        host: '0.0.0.0',
        inline: true,
        port: 5000,
        stats: 'minimal',
    },
    node: {
        // workaround for webpack-dev-server issue
        // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
        fs: 'empty',
        net: 'empty',
    },
};
