const path = require('path');

const rootPath = path.resolve(__dirname, '..');
const srcPath = path.resolve(rootPath, 'src');
const nodeModulesPath = path.join(rootPath, 'node_modules');

module.exports = {
    core: {
        builder: "webpack5",
    },
    webpackFinal: async (config, { configType }) => {
        const cssRules = config.module.rules.filter(r => r.test.toString() === '/\\.css$/');
        cssRules.forEach(r => { r.exclude = srcPath });

        config.resolve.modules = [
            path.join(rootPath, 'src'),
            "node_modules",
        ]

        config.resolve.alias['public'] =  path.join(rootPath, 'public')

        config.module.rules.push({
            test: /\.css$/,

            include: path.join(rootPath, 'src'),
            exclude: nodeModulesPath,

            use: [
                { loader: 'style-loader' },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        modules: {
                            localIdentName: '[name]__[local]_[hash:8]',
                        },
                    },
                },
            ],
        });

        const fileLoaderRule = config.module.rules.find(rule => rule.test.test('.svg'));
        fileLoaderRule.exclude = /\.svg$/;

        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },
    "stories": [
        "../src/components/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    "addons": [
        "@storybook/addon-actions",
        "@storybook/addon-essentials",
        "@storybook/addon-links",
        "@react-theming/storybook-addon",
    ]
};
