import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(process.cwd(), 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(process.cwd(), 'public'),
    },
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: true,
  },
};
