import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { withReadme, withDocs } from 'storybook-readme';
import {
    withKnobs, text, number, array, boolean,
} from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';

import App from './index';

const Readme = require('./README.md');

storiesOf('{{upperName}}', module)
    .addDecorator(withKnobs)
    .addDecorator(withDocs(Readme))
    .addDecorator(withReadme(Readme))
    .add('{{upperName}}', () => (
        <div>这个开发者很懒，没有写任何的 demo !</div>
    ));
