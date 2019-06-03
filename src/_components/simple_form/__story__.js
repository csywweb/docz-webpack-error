import React, { createElement } from 'react';

import { storiesOf } from '@storybook/react';
import { withReadme, withDocs } from 'storybook-readme';
import {
    withKnobs, text, number, array, boolean,
} from '@storybook/addon-knobs';

import { Radio } from 'zent';
import SimpleForm, { FieldTypes } from './index';

const MAX_RECHARGE_AMOUNT = 1000000; // 最大充值金额是50000
const MAX_RECHARGE_PRESENT_AMOUNT = 1000000; // 最大赠送金额是一百万

const moneyValidation = { //eslint-disable-line
    validate: (value, allowEmpty = false) => {
        if (allowEmpty && value === '') return true;
        const reg = /^(0|[1-9]\d*)(\.\d{0,2})?$/; // 钱的正则
        return reg.test(value);
    },
    error: '输入的金额不合法',
};

const ReadmeD = require('./README_d.md');
const ReadmeS = require('./README_s.md');

const fieldsConfig1 = [
    {
        name: 'type',
        label: '打印机型号：',
        fType: FieldTypes.RADIO,
        type: 'text',
        required: true,
        value: 0,
        children: createElement(Radio, { value: 0 }, 'Printcenter 365'),
    }, {
        name: 'deviceName',
        label: '备注名称：',
        fType: FieldTypes.INPUT,
        type: 'text',
        required: true,
        validations: {
            required: true,
        },
        validationErrors: {
            required: '请输入备注名称',
        },
    }, {
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
        name: 'id',
        fType: FieldTypes.INPUT,
        type: 'hidden',
        className: 'hide',
    },
];

const fieldsConfig2 = [
    {
        name: 'ruleName',
        label: '规则名称:',
        fType: FieldTypes.INPUT,
        type: 'text',
        required: true,
        value: '',
        placeholder: '最多20个汉字',
        className: 'ruleName',
        validations: {
            required: true,
            maxLength: 20,
        },
        validationErrors: {
            required: '规则名称不能为空',
            maxLength: '最多20个汉字',
        },
    },
    {
        name: 'rechargeAmount',
        label: '储值金额:',
        fType: FieldTypes.INPUT,
        type: 'number',
        required: true,
        addonAfter: '元',
        value: '',
        placeholder: '0.0',
        validations: {
            required: true,
            min: (values, value) => value > 0,
            max: (values, value) => {
                if (value > MAX_RECHARGE_AMOUNT) {
                    return false;
                }
                return true;
            },
            right: (values, value) => moneyValidation.validate(value),
        },
        validationErrors: {
            min: '充值金额必须大于0',
            max: `充值金额不超过${MAX_RECHARGE_AMOUNT}元`,
            right: moneyValidation.error,
        },
    },
    {
        name: 'isSupportOnline',
        label: '网店充值:',
        fType: FieldTypes.RADIO,
        required: true,
        value: 1,
        children: [
            createElement(Radio, { value: 1 }, '支持'),
            createElement(Radio, { value: 0 }, '不支持'),
        ],
    },
];

storiesOf('SimpleForm', module)
    .addDecorator(withKnobs)
    .add('Dialog 形式', withDocs(ReadmeD, () => {
        const formProps = {
            fieldsConfig: fieldsConfig1,
            showSubmit: boolean('Show submit button', false),
            showCancel: boolean('Show cancel button', false),
        };

        return (
            <SimpleForm {...formProps} />
        );
    }))
    .add('传统形式', withDocs(ReadmeS, () => {
        const formProps = {
            fieldsConfig: fieldsConfig2,
            showSubmit: boolean('Show submit button', true),
            showCancel: boolean('Show cancel button', true),
        };

        return (
            <SimpleForm {...formProps} />
        );
    }));
