import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Table,
} from 'zent';
import mapKeys from 'lodash/mapKeys';
import isEqual from 'lodash/isEqual';
import assign from 'object-assign';

/**
 * filter   筛选参数
 * total
 * list     列表数据
 * */

export default class ListByPage extends Component {
    static propTypes = {
        filter: PropTypes.object,
        list: PropTypes.array,
        pageKey: PropTypes.string,
        pageSize: PropTypes.number,
        pagination: PropTypes.bool,
        className: PropTypes.string,
        columns: PropTypes.array.isRequired,
        action: PropTypes.func.isRequired,
    };

    static defaultProps = {
        filter: {},
        list: [],
        pageKey: 'pageNo',
        pageSize: 20,
        pagination: true,
        className: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            page: {
                current: 1,
            },
            filter: props.filter,
            total: 0,
            list: props.list,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.state.filter, nextProps.filter)) {
            this.setState({
                filter: nextProps.filter,
                page: { current: 1 },
            }, () => {
                this.fetchData();
            });
        } else {
            this.setState({
                total: nextProps.total,
                list: nextProps.list,
            });
        }
    }

    getPageData=(page) => {
        this.setState({ page }, () => {
            this.fetchData();
        });
    };

    fetchData = () => {
        this.setState({ loading: true });
        return this.props.action(assign({}, this.state.filter, mapKeys(this.state.page, () => this.props.pageKey)))
            .then(() => {
                this.setState({ loading: false });
            }).catch(() => {
                this.setState({ loading: false });
            });
    };


    render() {
        const {
            pageSize,
            pagination,
        } = this.props;

        const {
            loading,
            total,
            list,
            page,
        } = this.state;

        const pageInfo = assign({
            limit: pageSize,
            total,
        }, page);

        return (
            <Table
                {...this.props}
                datasets={list}
                loading={loading}
                pageInfo={pagination ? pageInfo : null}
                onChange={this.getPageData}
            />
        );
    }
}
