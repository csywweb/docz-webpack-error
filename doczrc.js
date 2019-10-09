import { createPlugin } from 'docz-core';

const zent = () => createPlugin({
    onCreateBabelConfig({ actions }) {
        actions.setBabelPlugin({
            name: 'babel-plugin-zent',
            options: { automaticStyleImport: true },
        });
    },
});


export default {
    title: '美业 react 组件库',

    description: '美业 react 组件库',

    menu: ['开始', '通用组件'],
    ignore: ['README.md', 'CHANGELOG.md', 'README.md'],

    plugins: [
        zent(),
    ],
};
