import React from 'react';
import { configure, addDecorator } from '@storybook/react'; //  addDecorator是装饰器，可以部分也可以是全局
import { setOptions } from '@storybook/addon-options';
import { setDefaults } from '@storybook/addon-info';
import '@storybook/addon-console';
import StoryContainer from './container';

setOptions({
    name: '美业React组件库',
    url: 'http://gitlab.qima-inc.com/sz-web/beauty-component-react',
    /**
     * show addon panel as a vertical panel on the right
     * @type {Boolean}
     */
    addonPanelInRight: true,
    /**
     * enable/disable shortcuts 键盘快捷方式
     * @type {Boolean}
     */
    enableShortcuts: false, // true by default
});

setDefaults({
    header: false,
    inline: true,
});

addDecorator(story => <StoryContainer story={story} />);

// automatically import all files ending in *.stories.js
const req = require.context('../src/components', true, /.stories.js$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}


configure(loadStories, module);
