import React, { PureComponent, createElement } from 'react';
import { Form, Button, DatePicker } from 'zent';
import PropTypes from 'prop-types';
import values from 'lodash/values';

const { getControlGroup } = Form;

function DatePickerField({
    onChange, format, value, className, placeholder,
}) {
    function onDateChange(val) {
        onChange(val);
    }

    return (
        <DatePicker
            valueType="string"
            className={className}
            placeholder={placeholder}
            onChange={onDateChange}
            value={value}
            format={format}
        />
    );
}

const DateField = getControlGroup(DatePickerField);


const {
    Field, createForm, InputField, SelectField, RadioGroupField,
} = Form;

export const FieldTypes = {
    INPUT: 1,
    SELECT: 2,
    RADIO: 3,
    DATE: 4,
    CUSTOMIZED: 10,
};

/**
 * 支持2种调用方式：
 * 第一种是传统的form提交，默认有保存和取消按钮，只需要传入field配置和submit回调
 * 第二种是Dialog的形式，隐藏操作按钮，通过工具函数isFormValid和getFormValues获取表单验证状态和表单值（借助ref），
 *   不需要传submit回调，提交逻辑自行处理
 * onSubmit被触发时，会传入2个参数：values, zentForm
 */

class SimpleForm extends PureComponent {
    constructor(props) {
        super(props);

        const { fieldsConfig } = props;
        const fieldTypes = values(FieldTypes);

        if (!fieldsConfig || fieldsConfig.length === 0) {
            throw new Error('fields config cannot be empty');
        }

        fieldsConfig.forEach((field) => {
            if (!fieldTypes.includes(field.fType)) {
                throw new Error(`field type: ${field.fType}, is not supported`);
            }
        });
    }

    render() {
        const {
            handleSubmit, fieldsConfig, onSubmit, onCancel, showSubmit, showCancel, zentForm, submitText = '保存',
        } = this.props;
        const isSubmitting = zentForm.isSubmitting();
        return (
            <div>
                <Form horizontal onSubmit={handleSubmit(onSubmit)}>
                    {
                        fieldsConfig.map((fieldConfig) => {
                            const {
                                name, label, fType, hide, ...rest
                            } = fieldConfig;

                            if (hide) {
                                return null;
                            }

                            let Cpn;
                            switch (fType) {
                                case FieldTypes.INPUT:
                                    Cpn = InputField;
                                    break;
                                case FieldTypes.SELECT:
                                    Cpn = SelectField;
                                    break;
                                case FieldTypes.RADIO:
                                    Cpn = RadioGroupField;
                                    break;
                                case FieldTypes.DATE:
                                    Cpn = DateField;
                                    break;
                                case FieldTypes.CUSTOMIZED:
                                    Cpn = fieldConfig.component;
                                    break;
                                default:
                                    Cpn = undefined;
                            }

                            const props = {
                                key: name,
                                name,
                                label,
                                component: Cpn,
                                ...rest,
                            };

                            return createElement(Field, props);
                        })
                    }
                    {
                        (showSubmit || showCancel)
                        && (
                            <section style={{ marginLeft: '130px', marginTop: '30px' }}>
                                {
                                    showCancel
                                    && <Button onClick={onCancel} className="btn-mid">取消</Button>
                                }
                                {
                                    showSubmit
                                    && (
                                        <Button type="primary" htmlType="submit" className="btn-mid" loading={isSubmitting}>
                                            {submitText}
                                        </Button>
                                    )
                                }
                            </section>
                        )
                    }
                </Form>
            </div>
        );
    }
}

SimpleForm.propTypes = {
    fieldsConfig: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        fType: PropTypes.number.isRequired,
        hide: PropTypes.bool,

    })).isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    showSubmit: PropTypes.bool,
    showCancel: PropTypes.bool,
};

SimpleForm.defaultProps = {
    showSubmit: true,
    showCancel: true,
    onSubmit: undefined,
    onCancel: undefined,
};

const HOCForm = createForm()(SimpleForm);

HOCForm.FieldTypes = FieldTypes;

export const isFormValid = (zentForm) => {
    zentForm.validateForm();
    const errors = zentForm.getValidationErrors();
    zentForm.setFieldValidationErrors(errors);

    return {
        isValid: zentForm.isValid(),
        errors,
    };
};

export const getFormValues = zentForm => zentForm.getFormValues();

HOCForm.isFormValid = isFormValid;
HOCForm.getFormValues = getFormValues;

export default HOCForm;
