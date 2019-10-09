import React, { PureComponent } from 'react';
import {
    Button, Dialog,
} from 'zent';
import SimpleForm, { FieldTypes, isFormValid, getFormValues } from './index';

const fieldsConfig1 = [
    {
        name: 'type',
        label: '打印机型号：',
        fType: FieldTypes.INPUT,
        type: 'text',
        required: true,
        validations: {
            required: true,
        },
        validationErrors: {
            required: '请输入打印机型号',
        },
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
    },
];
class FormDialog extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    getDialogBtns() {
        return (
            <div>
                <Button type="primary" onClick={this.updated}>保存</Button>
                <Button type="primary" outline onClick={this.onCancel}>取消</Button>
            </div>
        );
    }

    updated = () => {
        if (isFormValid(this.form).isValid) {
            // 通过 ref 的方式取到 form 实例，再使用 getFormValues API 取得 form 字段值
            const data = getFormValues(this.form);
            this.onCancel();
            console.log(data);
        }
    }

    onCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const formProps = {
            fieldsConfig: fieldsConfig1,
            onSubmit: this.updated,
            showSubmit: false,
            showCancel: false,
        };

        return [
            <Dialog
                title="标题"
                visible={this.state.visible}
                onClose={this.onCancel}
                footer={this.getDialogBtns()}
            >
                <SimpleForm {...formProps} ref={(ref) => { this.form = ref; }} />
            </Dialog>,
            <Button onClick={() => this.setState({ visible: true })}>点我体验</Button>,
        ];
    }
}

const fieldsConfig = [
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
                if (value > 10000) {
                    return false;
                }
                return true;
            },
        },
        validationErrors: {
            min: '充值金额必须大于0',
            max: '充值金额不超过10000元',
        },
    },
];

class NormalForm extends React.Component {
    onSubmit = (formValues) => {
        console.log(formValues);
    }

    onCancel = () => {
        console.log('onCancel');
    }


    render() {
        const formProps = {
            fieldsConfig,
            onSubmit: this.onSubmit,
            onCancel: this.onCancel,
        };
        return (
            <SimpleForm {...formProps} />
        );
    }
}
export {
    FormDialog, NormalForm,
};
