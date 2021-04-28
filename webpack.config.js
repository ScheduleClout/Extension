const path = require('path'),
    {DefinePlugin, ProvidePlugin} = require('webpack'),
    CopyPlugin = require('copy-webpack-plugin'),
    dotenv = require('dotenv').config({path: __dirname + '/.env'}),
    env = dotenv.parsed;

module.exports = [
    {
        entry: {
            sw: './src/sw.js',
            index: './src/index.js'
        },
        resolve: {
            fallback: {
                buffer: require.resolve("buffer/"),
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify")
            }
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
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                sha256: ['sha256']
            }),
            new DefinePlugin({
                "process.env": JSON.stringify(env)
            }),
            new CopyPlugin({
                patterns: [
                    {from: 'src/icons', to: 'icons'},
                    {from: 'src/locales', to: '_locales'},
                    {
                        from: 'src/manifest.json',
                        to: 'manifest.json',
                        transform: function (manifestBuffer, path) {
                            const manifestString = manifestBuffer.toString()
                                .replace(/\${NODE_HOSTNAME}/g, 'NODE_HOSTNAME' in env ? env['NODE_HOSTNAME'] : 'bitclout.com')
                                .replace(/\${NODE_API_HOSTNAME}/g, 'NODE_API_HOSTNAME' in env ? env['NODE_API_HOSTNAME'] : 'api.bitclout.com');

                            return Buffer.from(manifestString);
                        }
                    },
                ],
            }),
        ],
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
    }
];
