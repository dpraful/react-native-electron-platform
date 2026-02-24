import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import fs from 'fs';
import packageJson from '../../package.json' with { type: 'json' };
import { generateAlias, generateFallback } from './src/webpackConfigHelper.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Plugin to copy vector icon fonts
class CopyFontsPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('CopyFontsPlugin', () => {
      const sourceDir = path.join(__dirname, '../../node_modules/react-native-vector-icons/Fonts');
      const destDir = path.join(__dirname, '../../web-build/fonts');

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const files = fs.readdirSync(sourceDir);
      files.forEach(file => {
        const source = path.join(sourceDir, file);
        const dest = path.join(destDir, file);
        fs.copyFileSync(source, dest);
      });
    });
  }
}

export default {
  mode: 'development',
  entry: path.resolve(__dirname, '../../electron/index.js'),
  devtool: 'source-map',

  devServer: {
    port: 5001,
    host: 'localhost',
    hot: true,
    compress: true,
    historyApiFallback: true,
    liveReload: true,
    static: {
      directory: path.join(__dirname, '../../web-build'),
      publicPath: '/',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      reconnect: true,
    },
  },

  resolve: {
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
    mainFields: ['browser', 'module', 'main'],
    fullySpecified: false,
    alias: generateAlias(),
    fallback: generateFallback(),
  },

  module: {
    rules: [
      // Your source files
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!react-native-electron)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
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

      // node_modules packages that contain JSX
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: /node_modules.*(@react-navigation|react-native|@react-native|react-native-vector-icons)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              ['@babel/plugin-transform-class-properties', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
            ],
          },
        },
      },

      // Assets
      { test: /\.(png|jpg|gif|svg)$/, type: 'asset/resource' },

      // Font files for react-native-vector-icons
      {
        test: /\.(ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: '/fonts/',
            },
          },
        ],
        include: /node_modules\/react-native-vector-icons/,
      },

      // General font files
      { test: /\.(woff|woff2|eot)$/, type: 'asset/resource' },
    ],
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../web-build'),
    clean: true,
    libraryTarget: 'umd', // UMD fixes 'exports is not defined'
    globalObject: 'this',
    assetModuleFilename: 'fonts/[name].[ext]',
  },

  plugins: [
    new CopyFontsPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: false,
      templateParameters: {
        title: packageJson.name,
      },
    }),
  ],

  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
