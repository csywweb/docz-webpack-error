##  SimpleForm

### 使用指南

支持2种调用方式：
```
 # 第一种是传统的form提交，默认有保存和取消按钮，只需要传入field配置和submit回调
 # 第二种是Dialog的形式，隐藏操作按钮，通过工具函数isFormValid和getFormValues获取表单验证状态和表单值（借助ref），不需要传submit回调，提交逻辑自行处理
 # onSubmit被触发时，会传入2个参数：values, zentForm
 ```

### 例子
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
        name: 'deviceNo',
        label: '打印机机身号：',
        fType: FieldTypes.INPUT,
        type: 'text',
        required: true,
        validations: {
            required: true,
        },
        validationErrors: {
            required: '请输入打印机机身号',
        },
    }, {
        name: 'deviceKey',
        label: '打印机KEY：',
        fType: FieldTypes.INPUT,
        type: 'text',
        required: true,
        validations: {
            required: true,
        },
        validationErrors: {
            required: '请输入打印机KEY',
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
        name: 'deviceType',
        fType: FieldTypes.INPUT,
        type: 'hidden',
        value: 10,
        className: 'hide',
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
| name | 表单元素名 | string | 是 | desc |