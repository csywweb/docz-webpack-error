import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { withReadme, withDocs } from 'storybook-readme';
import {
    withKnobs, text, number, array, boolean,
} from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';

import SelectDept from './index';

// import Readme from './README.md';
const Readme = require('./README.md');

storiesOf('Select', module)
    .addDecorator(withKnobs)
    .addDecorator(withDocs(Readme))
    .addDecorator(withReadme(Readme))
    .add('deptselect', () => (
        <SelectDept deptId={number('deptId', 11, {
            min: 1,
            max: 200,
        })}
        />
    ));
