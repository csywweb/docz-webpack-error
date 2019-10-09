/**
 * @author Happi
 *
 * 组件解决的问题：
 * 封装了zent Table组件，内部维护list数据以及翻页操作，外部只需要关心表格接口，以及需要展示的表格列，降低Zent Table的使用成本
 *
 *
 * 组件属性介绍：
 * pageInfo: object，可选，默认值：{pageNo: 1, pageSize: 20}，提供初始化页码，以及每页多少条数据，
 * params:  object, 可选，默认值：{}，提供过滤查询参数，
 * formatData: function, 可选，格式化数据函数, 该函数的入参是接口返回的原始数据，用于将非标准化翻页数据重新组装成标准翻页格式的数据，标准如下：
 *             {list: [], total: 100, current: 1, pageSize: 20}
 * fetchData: function, 必填，使用现有的api，则必须绑定api上下文，才能传入，例如：const getOrderList = orderApi.getOrderList.bind(orderApi)
 * columns: 必填，跟zent Table组件无任何差异，另外zent的Table的所有属性均支持，比如rowKey等等
 *
 *
 * 使用例子：
 * import BeautyTable from 'cpn/beauty_table';
 * import orderApi from 'common/api/order';
 *
 * const getOrderList = orderApi.getOrderList.bind(orderApi);
 *
 * <BeautyTable
 *  columns={[{title: '名称1', name: 'name1'},{title: '名称2', name: 'name2'}]}        //必填
 *  fetchData={getOrderList} //必填
 *  pageInfo={{pageSize: 5}} //可选
 *  params={{type: 1}        //可选
 *  formatData={this.formatData}} //可选，函数示例： function formatData(data) {
 *                                          return {
 *                                              total: data.total, current: data.current, list: data.data
 *                                          }
 *                                       }
 * />
 *
 * 外部如果需要主动刷新表格，请使用ref引用，并调用组件的refreshTable方法，例如：this.orderList.refreshTable();
 *
 * 实际使用场景参考实例：src/marketing/coupon_publisher/member_list.js文件
 */
import React from 'react';
import { Table } from 'zent';
import { pick } from 'lodash';
import PropTypes from 'prop-types';

export default class BeautyTable extends React.Component {
    static defaultProps = {
        params: {},
        pageInfo: {},
        formatData: null,
        autoFetchData: true,
        onChange: () => {},
        onTotalChange: () => {},
        onFetchDataError: () => {},
    }

    static propTypes = {
        columns: PropTypes.array.isRequired,
        params: PropTypes.object,
        pageInfo: PropTypes.object,
        fetchData: PropTypes.func.isRequired,
        onFetchDataError: PropTypes.func,
        formatData: PropTypes.func,
        onChange: PropTypes.func,
        onTotalChange: PropTypes.func,
        autoFetchData: PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: true,
            pageInfo: {
                pageNo: props.pageInfo.pageNo || 1,
                pageSize: props.pageInfo.pageSize || 20,
                total: 0,
            },
        };
    }

    componentDidMount() {
        if (this.props.autoFetchData) {
            this.refreshTable();
        }
    }

    onTableChange = ({ current, sortType, sortBy }) => {
        if (current) {
            this.setState({
                pageInfo: { ...this.state.pageInfo, pageNo: current },
            }, this.refreshTable);
        } else {
            this.props.onChange({ sortType, sortBy });
        }
    }

    /**
     * 刷新表格，不会改变pageNo
     */
    refreshTable = () => {
        const { pageInfo } = this.state;
        const { params, formatData, onTotalChange } = this.props;
        // 合并查询参数
        const query = { ...pageInfo, ...params };

        this.setState({ loading: true });
        // 这里把page参数也传入，兼容新版后端api，因为新版后端api的参数是page，不再是pageNo了，
        // 这里把page和pageNo都传给后台，他想用哪个就用哪个
        this.props.fetchData({ ...query, page: query.pageNo }).then((data) => {
            // 这里使用items，也是为了兼容新版后端api，新版api的列表数据返回的是items，不是list了
            // 另外，totalCount数据保存在了paginator字段里面了，这里这样写，是为了兼容2种方案
            // 传pageInfo可以在formatData中进行手动分页
            const { list: listData, total: listTotal, items } = formatData ? formatData(data, pageInfo) : data;
            const { totalCount } = data.paginator || {};
            // 没有total字段的时候，才使用totalCount
            const total = listTotal === undefined ? totalCount : listTotal;
            const list = listData || items || [];

            this.setState({
                list,
                pageInfo: { ...pageInfo, total },
                loading: false,
            });

            onTotalChange(total);
        }).catch((err) => {
            this.setState({ loading: false });
            this.props.onFetchDataError(err);
        });
    }

    /**
     * 重载表格: 会将pageNo重置为1，然后刷新
     */
    resetTable = () => {
        this.setState({ pageInfo: { ...this.state.pageInfo, pageNo: 1 } }, this.refreshTable);
    }

    render() {
        const { pageInfo, list, loading } = this.state;
        const { columns } = this.props;
        // 表格原来的配置
        const originProps = pick(this.props, [
            'rowKey', 'sortBy', 'sortType', 'emptyLable', 'emptyLabel', 'selection', 'getRowConf',
            'expandation', 'batchComponents', 'batchComponentsAutoFixed', 'autoStick', 'autoScroll', 'className',
            'prefix', 'scroll',
        ]);
        // 格式化成Table自己的配置格式
        const formattedPageInfo = {
            current: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
        };

        return (
            <Table
                columns={columns}
                datasets={list}
                onChange={this.onTableChange}
                pageInfo={formattedPageInfo}
                loading={loading}
                {...originProps}
            />
        );
    }
}
