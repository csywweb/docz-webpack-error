import React from 'react';

import { storiesOf } from '@storybook/react';
import { withReadme, withDocs } from 'storybook-readme';
import {
    withKnobs, text, number, array, boolean,
} from '@storybook/addon-knobs';

import SimpleForm, { FieldTypes } from './index';

// import Readme from './README.md';
const Readme = require('./README.md');

const fieldsConfig = [
    {
        name: 'deptId',
        label: '所在门店：',
        fType: FieldTypes.SELECT,
        data: [{ deptId: 1, deptName: '南山店' }, { deptId: 1, deptName: '保安店' }],
        optionValue: 'deptId',
        optionText: 'deptName',
        required: true,
        validations: {
            checkDept: (values, value) => (!!value)
            ,
        },
        validationErrors: {
            checkDept: '请输入所在门店',
        },
    }, {
        name: 'deviceName',
        label: '名称：',
        fType: FieldTypes.INPUT,
        type: 'text',
        required: true,
        validations: {
            required: true,
        },
        validationErrors: {
            required: '请输入备注名称',
        },
    },
];

storiesOf('SimpleForm', module)
    .addDecorator(withKnobs)
    .addDecorator(withDocs(Readme))
    .addDecorator(withReadme(Readme))
    .add('basic',
        () => {
            const formProps = {
                fieldsConfig,
                showSubmit: boolean('Show submit button', true),
                showCancel: boolean('Show cancel button', true),
            };

            return (
                <SimpleForm {...formProps} />
            );
        });
