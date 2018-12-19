##  SimpleForm

### 使用指南

支持2种调用方式：
```
 # 第一种是Dialog的形式，隐藏操作按钮，通过工具函数isFormValid和getFormValues获取表单验证状态和表单值（借助ref），不需要传submit回调，提交逻辑自行处理
 # 第二种是传统的form提交，默认有保存和取消按钮，只需要传入field配置和submit回调
 # onSubmit被触发时，会传入2个参数：values, zentForm
 ```

### Dialog 形式例子
```javascript
import React, { PureComponent, createElement } from 'react';
import { Button, Radio, Dialog, Notify } from 'zent';
import SimpleForm, { FieldTypes, isFormValid, getFormValues } from 'cpn/simple_form';
import { isManager } from 'common/utils/role_helper';
import { getDeptsWithoutHq } from 'common/utils/dept_helper';

const fieldsConfig = [
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
        data: getDeptsWithoutHq(),
        optionValue: 'deptId',
        optionText: 'deptName',
        required: true,
        hide: !isManager,
        validations: {
            checkDept: (values, value) => !(isManager && !value)
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
class AddDeviceDialog extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getDialogBtns() {
        return (
            <div>
                <Button type="primary" onClick={() => this.updated()}>保存</Button>
                <Button type="primary" outline onClick={this.props.onCancel}>取消</Button>
            </div>
        );
    }

    updated() {
        if (isFormValid(this.form).isValid) {
            // 通过 ref 的方式取到 form 实例，再使用 getFormValues API 取得 form 字段值
            const data = getFormValues(this.form);
            this.props.onOk(data);
        }
    }

    render() {
        const editData = this.props.editData;

        const formProps = {
            fieldsConfig,
            onSubmit: this.updated,
            showSubmit: false,
            showCancel: false,
        };

        return (
            <Dialog
                title={editData.id ? '编辑打印机' : '新增打印机'}
                visible={this.props.visible}
                onClose={this.props.onCancel}
                footer={this.getDialogBtns()}
            >
                <SimpleForm {...formProps} ref={(ref) => { this.form = ref; }} />
            </Dialog>
        );
    }
}

export default AddDeviceDialog;
```

### 传统形式例子
```javascript
import React, { createElement } from 'react';
import { moneyUtil } from '@youzan/beauty-util';
import SimpleForm, { FieldTypes } from 'cpn/simple_form';
import { moneyValidation } from 'common/validations';
import settingApi from 'common/api/setting';
import { Radio, Loading } from 'zent';
import { hashHistory } from 'react-router';
import scss from './index.scss';
import { MAX_RECHARGE_AMOUNT, MAX_RECHARGE_PRESENT_AMOUNT } from '../../../bill_new/constants';
import { DEFAULT_PREPAID_RULE_ID, DEFAULT_PREPAID_RULE_NAME } from '../constants';

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

export default class RechargeCreate extends React.Component {
    constructor(props) {
        super(props);

        const { ruleId } = this.props.params;

        this.state = {
            loading: this.props.params.operate === 'edit',
            fieldsConfig,
        };
    }

    async componentDidMount() {
        const { operate, ruleId } = this.props.params;
        const { fieldsConfig } = this.state;

        // 如果是编辑，需要先拉取详情数据
        if (operate === 'edit') {
            this.setState({ loading: true });
            const {
                ruleName, rechargeAmount, presentAmount, isSupportOnline,
            } = await settingApi.getRechargeRuleById(ruleId);
            this.setState({ loading: false });

            if (ruleId === DEFAULT_PREPAID_RULE_ID) {
                fieldsConfig[0].value = isSupportOnline;
            } else {
                fieldsConfig[0].value = ruleName;
                fieldsConfig[1].value = moneyUtil.f2y(rechargeAmount);
                fieldsConfig[2].value = moneyUtil.f2y(presentAmount);
                fieldsConfig[3].value = isSupportOnline;
            }

            this.setState({ fieldsConfig });
        }
    }

    onSubmit = async (formValues) => {
        const { operate, ruleId } = this.props.params;
        const isEdit = operate === 'edit';
        const {
            ruleName, rechargeAmount, presentAmount, isSupportOnline,
        } = formValues;

        // 编辑模式
        if (isEdit) {
            const isDefaultPrepaid = this.props.params.ruleId === DEFAULT_PREPAID_RULE_ID;
            await settingApi.updateRechargeRule({
                ruleId: isDefaultPrepaid ? DEFAULT_PREPAID_RULE_ID : ruleId,
                ruleName: isDefaultPrepaid ? DEFAULT_PREPAID_RULE_NAME : ruleName,
                rechargeAmount: isDefaultPrepaid ? 1 : moneyUtil.y2f(rechargeAmount),
                presentAmount: isDefaultPrepaid ? 0 : moneyUtil.y2f(presentAmount),
                isSupportOnline,
            });
        } else {
            // 创建模式
            await settingApi.createRechargeRule({
                ruleName,
                rechargeAmount: moneyUtil.y2f(rechargeAmount),
                presentAmount: moneyUtil.y2f(presentAmount),
                isSupportOnline,
            });
        }
        hashHistory.go(-1);
    }

    onCancel = () => {
        hashHistory.go(-1);
    }


    render() {
        const { fieldsConfig, loading } = this.state;
        const formProps = {
            fieldsConfig,
            onSubmit: this.onSubmit,
            onCancel: this.onCancel,
        };
        const { ruleId } = this.props.params;
        if (loading) return <Loading show />;
        return (
            <div className={scss.style}>
                {
                    ruleId === DEFAULT_PREPAID_RULE_ID &&
                    <div className="zent-form zent-form--horizontal">
                        <div className="zent-form__control-group ruleName">
                            <label className="zent-form__control-label" >规则名称:</label>
                            <div className="zent-form__controls" >{DEFAULT_PREPAID_RULE_NAME}</div>
                        </div>
                        <div className="zent-form__control-group ruleName">
                            <label className="zent-form__control-label" >充值金额:</label>
                            <div className="zent-form__controls" >自定义充值金额</div>
                        </div>
                    </div>
                }
                <SimpleForm {...formProps} />
            </div>
        );
    }
}

```

### API

| 参数 | 类型 | 是否必填 | 默认值 | 说明
|------|------|------|------|------|
| fieldsConfig | array | 无 | 是 | 组件类型配置数组，其中`name`和`fType`字段必填 |
| onSubmit | func | 否 | undefined | form 提交的回调函数，会传入 formValues 和 zentForm |
| onCancel | func | 否 | undefined | 取消的回调函数 |
| showSubmit | boolean | 否 | true | 是否显示保存按钮 |
| showCancel | boolean | 否 | true | 是否显示取消按钮 |