import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import fs from 'fs';
import CompressionPlugin from 'compression-webpack-plugin';
import { createRequire } from 'module';
import { generateAlias, generateFallback } from './lib/webpackConfigHelper.mjs';
import { createProgressPlugin } from './lib/progress.mjs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(import.meta.url);
const packageJson = require('../../package.json');
const port = process.env.PORT || 5001;
const host = process.env.HOST || 'localhost';
export const ApiUrl = `http://${host}:${port}`;
const isProd = process.env.NODE_ENV === 'production';
const appEntryTs = path.resolve(process.cwd(), 'electron/index.ts');
const appEntryJs = path.resolve(process.cwd(), 'electron/index.js');
// Plugin to copy vector icon fonts (non-blocking async version)
class CopyFontsPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('CopyFontsPlugin', (compilation, callback) => {
            const sourceDir = path.join(__dirname, '../react-native-vector-icons/Fonts');
            const destDir = path.join(process.cwd(), 'web/fonts');
            try {
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true });
                }
                // Add fallback check for missing source directory
                if (!fs.existsSync(sourceDir)) {
                    console.warn(`[CopyFontsPlugin] Warning: Fonts directory not found at ${sourceDir}. Skipping font copy.`);
                    callback();
                    return;
                }
                const files = fs.readdirSync(sourceDir);
                files.forEach(file => {
                    const source = path.join(sourceDir, file);
                    const dest = path.join(destDir, file);
                    fs.copyFileSync(source, dest);
                });
                callback();
            }
            catch (error) {
                console.error(`[CopyFontsPlugin] Error copying fonts:`, error);
                callback(error);
            }
        });
    }
}
export default {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'eval-cheap-module-source-map',
    cache: {
        type: 'filesystem',
        compression: 'gzip',
        allowCollectingMemory: true,
        buildDependencies: {
            config: [__filename],
        },
    },
    entry: fs.existsSync(appEntryTs) ? appEntryTs : appEntryJs,
    stats: 'none',
    infrastructureLogging: {
        level: 'error',
    },
    devServer: {
        port: port,
        host: host,
        hot: true,
        compress: true,
        historyApiFallback: true,
        liveReload: true,
        static: {
            directory: path.join(process.cwd(), 'web'),
            publicPath: '/',
        },
        devMiddleware: {
            stats: 'errors-only',
        },
        client: {
            logging: 'none',
            overlay: {
                errors: true,
                warnings: false,
            },
            reconnect: false,
            progress: false,
        },
    },
    resolve: {
        extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
        mainFields: ['browser', 'module', 'main'],
        fullySpecified: false,
        symlinks: false,
        alias: {
            ...generateAlias(),
        },
        fallback: generateFallback(),
    },
    module: {
        rules: [
            // Single Babel rule for all JS/JSX/TS/TSX files
            {
                test: /\.(js|jsx|ts|tsx)$/,
                // REPLACED: Using include instead of exclude for MUCH faster transpiling
                include: [
                    path.resolve(process.cwd(), 'src'),
                    path.resolve(process.cwd(), 'lib'),
                    path.resolve(process.cwd(), 'node_modules/react-native'),
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        // Production optimizations
                        compact: isProd,
                        minified: isProd,
                        comments: false,
                        presets: [
                            // Optimized preset-env for Electron
                            [
                                '@babel/preset-env',
                                {
                                    modules: false,
                                    targets: {
                                        electron: '35' // Electron 35+ supports modern JS
                                    }
                                }
                            ],
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ],
                        plugins: [
                            ['@babel/plugin-transform-class-properties', { loose: true }],
                            ['@babel/plugin-transform-private-methods', { loose: true }],
                            ['@babel/plugin-transform-private-property-in-object', { loose: true }],
                            '@babel/plugin-transform-runtime',
                        ],
                    },
                },
            },
            // Images and other assets
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
            // Modern asset modules for ALL font files (no file-loader)
            {
                test: /\.(ttf|otf|woff|woff2|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: isProd ? 'fonts/[name].[contenthash][ext]' : 'fonts/[name][ext]',
                },
            },
        ],
    },
    output: {
        filename: isProd ? '[name].[contenthash].js' : '[name].js',
        chunkFilename: isProd ? '[name].[contenthash].js' : '[name].js',
        path: path.resolve(process.cwd(), 'web'),
        clean: true,
        assetModuleFilename: isProd
            ? 'assets/[name].[contenthash][ext]'
            : 'assets/[name][ext]',
    },
    optimization: {
        // Deterministic IDs for better caching and chunk stability
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        // Tree Shaking Configuration - Fully Enabled
        usedExports: true,
        sideEffects: true,
        providedExports: true,
        minimize: isProd,
        // Enhanced tree shaking with concatenation
        concatenateModules: isProd,
        // Split chunks configuration - Optimized for better performance
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 250000,
            cacheGroups: {
                // React-specific vendor chunk
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-native-web)[\\/]/,
                    name: 'react-vendor',
                    priority: 20,
                    reuseExistingChunk: true,
                },
                // All other vendor chunks
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                    reuseExistingChunk: true,
                },
            },
        },
        runtimeChunk: 'single',
        // Minimizer configuration
        minimizer: isProd ? [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                    ecma: 2020,
                    module: true,
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log', 'console.info', 'console.debug'],
                        passes: 2,
                        // Additional tree shaking optimizations
                        dead_code: true,
                        unused: true,
                        side_effects: true,
                        evaluate: true,
                        booleans: true,
                        loops: true, // Optimize loops
                        // REMOVED: toplevel: true - Can break packages
                    },
                    mangle: {
                    // REMOVED: toplevel: true - Can break packages
                    },
                    format: {
                        comments: false, // Preserve no comments
                    },
                },
            }),
        ] : [],
    },
    plugins: [
        createProgressPlugin(),
        // DefinePlugin for stripping development code (VERY IMPORTANT)
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(!isProd),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        // Moment.js IgnorePlugin - Prevents bundling of locale files (saves several MB)
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        // Brotli Compression - Massive transfer reduction (up to 70-80% smaller than gzip)
        isProd && new CompressionPlugin({
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg|json)$/,
            compressionOptions: {
                level: 11, // Maximum compression level for Brotli
            },
            filename: '[path][base].br',
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false, // Keep original files as fallback
        }),
        !isProd && new ReactRefreshWebpackPlugin({
            overlay: false,
        }),
        new CopyFontsPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'lib/index.html'),
            inject: 'body',
            templateParameters: {
                title: packageJson.name,
            },
            minify: isProd ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            } : false,
        }),
    ].filter(Boolean),
    performance: {
        hints: isProd ? 'warning' : false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};
