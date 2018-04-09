import React from 'react';
import { Table } from 'zent';
import PropTypes from 'prop-types';

export default class BeautyTable extends React.Component {
    static defaultProps = {
        params: {},
        pageInfo: {},
    }

    static propTypes = {
        columns: PropTypes.array.isRequired,
        params: PropTypes.object,
        pageInfo: PropTypes.object,
        fetchData: PropTypes.func.isRequired,
        formatData: PropTypes.func,
    }

    state = {
        list: [],
        loading: true,
        pageInfo: {
            pageNo: 1,
            pageSize: 20,
            total: 0,
        },
    }

    componentDidMount() {
        this.setState({
            pageInfo: {
                ...this.state.pageInfo,
                ...this.props.pageInfo,
            },
        }, this.refreshTable);
    }

    render() {
        const { pageInfo, list, loading } = this.state;
        const { columns } = this.props;
        const formattedPageInfo = {
            current: pageInfo.pageNo,
            limit: pageInfo.pageSize,
            total: pageInfo.total,
        };

        return (<Table
            columns={columns}
            datasets={list}
            onChange={this.onTableChange}
            pageInfo={formattedPageInfo}
            loading={loading}
        />);
    }

    refreshTable = () => {
        const { pageInfo } = this.state;
        const { params, formatData } = this.props;

        this.setState({ loading: true });

        this.props.fetchData({ ...pageInfo, ...params }).then((data) => {
            const { list, total } = formatData ? formatData(data) : data;

            this.setState({
                list,
                pageInfo: { ...this.state.pageInfo, total },
                loading: false,
            });
        }).catch(() => {
            this.setState({ loading: false });
        });
    }

    onTableChange = ({ current }) => {
        this.setState({
            pageInfo: { ...this.state.pageInfo, pageNo: current },
        }, this.refreshTable);
    }
}
