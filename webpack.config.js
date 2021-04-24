const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
    {
        entry: {
            sw: './src/sw.js',
            index: './src/index.js'
        },
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {from: 'src/icons', to: 'icons'},
                    {from: 'src/locales', to: '_locales'},
                    {from: 'src/manifest.json', to: 'manifest.json'},
                ],
            }),
        ],
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
    }
];