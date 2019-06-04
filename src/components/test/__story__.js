import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { withReadme, withDocs } from 'storybook-readme';
import {
    withKnobs, text, number, array, boolean,
} from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';

import Test from './index';
import './index.css';

const Readme = require('./README.md');

class CustomPannelDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        const { tabs, activeId } = this.state;
        return (
            <Test />
        );
    }
}

storiesOf('Ttest、 垂直Tab', module)
    .addDecorator(withKnobs)
    .addDecorator(withDocs(Readme))
    .addDecorator(withReadme(Readme))
    .add('啊哈', () => (
        <CustomPannelDemo />
    ));
