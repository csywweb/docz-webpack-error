import React from 'react';
import {
    Popover, Button, Loading, Notify,
} from 'zent';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import scss from './index.scss';


// 弹层
export default class PopSelector extends React.Component {
    static propTypes = {
        ordered: PropTypes.bool,
    }

    static defaultProps = {
        ordered: true,
    }

    constructor(props) {
        super(props);
        const { selectedOptions } = this.props;
        this.state = {
            loading: false,
            noSelected: false,
            data: [],
            selectedOptions,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { selectedOptions = [] } = nextProps;
        // 设置好已选择的，同时需要更新一下原始数据中的data选中状态
        this.setState({ selectedOptions }, this.formatDataWithSelectedOptions);
    }

    onOptionSelect = (index, item) => {
        const { data = [] } = this.state;
        const selectedCount = data.filter(x => x.selected);
        if (item.selected && selectedCount.length >= 10) return Notify.error('不能超过10人');
        data[index] = item;
        this.setState({ data, noSelected: selectedCount === 0 });
        return null;
    }

    onShow = () => {
        const { data = [] } = this.state;
        const { selectedOptions = [] } = this.state;
        const { fetchData, formatData } = this.props;

        if (data.length === 0) {
            this.setState({ loading: true });
            fetchData().then((data) => {
                // 如果有传入formatData函数，则先格式化数据
                data = typeof formatData === 'function' ? formatData(data) : data;
                // 补偿数据：就是在selectedOptions中，但是不在data中的数据
                const patchData = selectedOptions.filter(item => !data.some(opt => opt.id === item.id));
                // 把补偿的数据放到最上面
                data = [...patchData, ...data];
                // const otherData = data.filter()
                this.setState({ data, loading: false }, this.formatDataWithSelectedOptions);
            }).catch(() => {
                this.setState({ loading: false });
            });
        }
    }

    formatDataWithSelectedOptions = () => {
        const { data, selectedOptions } = this.state;
        const newData = data.map((item) => {
            const selectedItem = selectedOptions.find(opt => opt.id == item.id);
            return {
                ...item,
                selected: !!selectedItem,
                assigned: selectedItem ? selectedItem.assigned : false,
                selectedIndex: selectedItem && selectedOptions.indexOf(selectedItem),
            };
        });

        this.setState({ data: newData });
    }

    onVisibleChange = () => {

    }

    onConfirm = () => {
        this.onClose();
        const { data } = this.state;
        const { ordered, onChange } = this.props;
        let selectedOptions = data.filter(item => item.selected);
        if (ordered) {
            selectedOptions = selectedOptions.sort((x, y) => x.selectedIndex - y.selectedIndex);
        }
        onChange(selectedOptions);
    }

    onClose = () => {
        document.body.click();
    }

    onNoSelectClick = () => {
        const { data: oldData } = this.state;
        const data = oldData.map(item => ({ ...item, selected: false }));
        this.setState({ selectedOptions: [], data, noSelected: true });
    }

    renderOptions() {
        const { loading, data } = this.state;
        const { option: OptionComponent, emptyText = '无可用数据' } = this.props;

        if (loading) {
            return <Loading show />;
        }

        if (data.length > 0) {
            return data.map((item, index) => (
                <OptionComponent
                    data={data}
                    key={index}
                    item={item}
                    index={index}
                    onOptionSelect={this.onOptionSelect}
                />
            ));
        }

        return <div className="pop-empty-text">{emptyText}</div>;
    }

    render() {
        const {
            title = '', placeholder = '请选择', noSelectText = '不选择',
            position = Popover.Position.BottomLeft,
        } = this.props;
        const { data = [], loading, noSelected } = this.state;
        const noSelectedClassName = classnames({
            'pop-option': true,
            'pop-option-selected': noSelected,
            'no-select-text': true,
        });
        return (
            <Popover
                className={scss.selector}
                position={position}
                onShow={this.onShow}
                display="inline"
                cushion={5}
            >
                <Popover.Trigger.Click>
                    <span className="pop-selector-placeholder">{placeholder}</span>
                </Popover.Trigger.Click>
                <Popover.Content>

                    <div className="pop-container">
                        <div className="pop-header">
                            {title || placeholder}
                            {' '}
                            <span className="pop-close" onClick={this.onClose}>&times;</span>
                        </div>
                        <div className="pop-body">
                            {
                                data.length > 0 && !loading
                                && (
                                    <div className={noSelectedClassName} onClick={this.onNoSelectClick}>
                                        {noSelected && (
                                            <svg className="pop-icon-selected" aria-hidden="true">
                                                {' '}
                                                <use xlinkHref="#icon-selected" />
                                                {' '}
                                            </svg>
                                        )}
                                        {noSelectText}
                                    </div>
                                )
                            }
                            {this.renderOptions()}
                        </div>
                        <div className="pop-footer"><Button type="primary" onClick={this.onConfirm}>确定</Button></div>
                    </div>

                </Popover.Content>
            </Popover>
        );
    }
}
