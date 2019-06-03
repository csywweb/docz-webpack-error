import React, { PureComponent } from 'react';
import { Select } from 'zent';
import pick from 'lodash/pick';
import getter from 'lodash/get';
import { SelectBox } from './style';
// import { ROLE } from 'common/conf/constant';
const ROLE = {
    CREATOR: 1, // 店铺创建者
    SUPER_ADMIN: 2, // 高级管理员
    SHOP_MANAGER: 3, // 店长
    STAFF: 4, // 员工
    ENGINEER: 5, // 技师
    FINANCE_MANAGER: 7, // 总店财务
    FINANCE_BRANCH: 8, // 驻店财务 （分店财务）
};

export default class extends PureComponent {
    constructor({
        deptId, showAll = false, showAllText = '全部', showAllValue = '', hideHeadquarter = false, headquarterText,
    }) {
        super();
        this.state = {
            selectedDept: deptId,
        };

        if (headquarterText && this.depts[0] && this.depts[0].deptId == 1) {
            this.depts[0].deptName = headquarterText || '全部';
        }

        if (showAll && this.depts[0].deptId != '') {
            this.depts.unshift({
                deptId: showAllValue,
                deptName: showAllText,
            });
        }
        if (hideHeadquarter) {
            this.depts = this.depts.filter(dept => dept.deptId != 1);
        }
    }

    componentWillMount() {
        // 默认选中
        const { defaultDept } = this.props;

        if (defaultDept && this.depts.some(item => item.deptId == defaultDept)) { // defaultDept 是门店id
            this.setState({ selectedDept: defaultDept });
        }
    }

    componentWillReceiveProps({ deptId }) {
        deptId != undefined && this.setState({ selectedDept: deptId });
    }

    onChange = (evt, data) => {
        const { props } = this;
        props.onChange && this.props.onChange(data.deptId);
        this.setState({ selectedDept: data.deptId });
    }

    depts = _global.env.dept_info.map((dept) => {
        if (dept.deptId == 1) {
            dept.deptName = '总部';
        }
        return pick(dept, ['deptId', 'deptName']);
    });

    outChangeId=(deptId) => {
        this.setState({ selectedDept: deptId });
    }


    render() {
        const { selectedDept } = this.state;
        const {
            className, labelText, hideLabel, placeholder = '请选择', alwaysShow, showAll = false, showAllText,
        } = this.props;

        const roleId = getter(_global, 'env.user_info.roleId');

        if (!alwaysShow && (roleId == ROLE.SHOP_MANAGER || roleId == ROLE.STAFF || roleId == ROLE.FINANCE_BRANCH)) {
            return null;
        }

        if (showAll && this.depts[0].deptId != '') {
            this.depts.unshift({
                deptId: '',
                deptName: showAllText,
            });
        }
        return (
            <SelectBox className={className}>
                {this.props.required ? (
                    <em className="zent-form__required">
*
                    </em>
                ) : ''}
                <div className={hideLabel ? 'hidden' : 'select-label'}>
                    {labelText || '选择门店：'}
                </div>
                <Select
                    data={this.depts}
                    disabled={this.props.disabled}
                    optionText="deptName"
                    optionValue="deptId"
                    value={selectedDept}
                    placeholder={placeholder}
                    onChange={this.onChange}
                    className="zent-select-height"
                    autoWidth
                />
            </SelectBox>
        );
    }
}
