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

### API

| 参数 | 类型 | 是否必填 | 默认值 | 说明
|------|------|------|------|------|
| fieldsConfig | array | 无 | 是 | 组件类型配置数组，其中`name`和`fType`字段必填 |
| onSubmit | func | 否 | undefined | form 提交的回调函数，会传入 formValues 和 zentForm |
| onCancel | func | 否 | undefined | 取消的回调函数 |
| showSubmit | boolean | 否 | true | 是否显示保存按钮 |
| showCancel | boolean | 否 | true | 是否显示取消按钮 |