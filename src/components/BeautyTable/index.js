import { Table } from 'zent';
import { pick } from 'lodash';

export default class BeautyTable extends React.Component {
    static defaultProps = {
        params: {},
        pageInfo: {},
        formatData: null,
        onChange: () => {},
    }

    static propTypes = {
        columns: PropTypes.array.isRequired,
        params: PropTypes.object,
        pageInfo: PropTypes.object,
        fetchData: PropTypes.func.isRequired,
        formatData: PropTypes.func,
        onChange: PropTypes.func,
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
        this.refreshTable();
    }

    onTableChange = ({ current }) => {
        this.setState({
            pageInfo: { ...this.state.pageInfo, pageNo: current },
        }, this.refreshTable);
    }

    /**
     * 刷新表格，不会改变pageNo
     */
    refreshTable = () => {
        const { pageInfo } = this.state;
        const { params, formatData, onChange } = this.props;
        // 合并查询参数
        const query = { ...pageInfo, ...params };

        this.setState({ loading: true });
        // 这里把page参数也传入，兼容新版后端api，因为新版后端api的参数是page，不再是pageNo了，
        // 这里把page和pageNo都传给后台，他想用哪个就用哪个
        this.props.fetchData({ ...query, page: query.pageNo }).then((data) => {
            // 这里使用items，也是为了兼容新版后端api，新版api的列表数据返回的是items，不是list了
            // 另外，totalCount数据保存在了paginator字段里面了，这里这样写，是为了兼容2种方案
            const { list: listData, total: listTotal, items } = formatData ? formatData(data) : data;
            const { totalCount } = data.paginator || {};
            // 没有total字段的时候，才使用totalCount
            const total = listTotal === undefined ? totalCount : listTotal;
            const list = listData || items || [];

            this.setState({
                list,
                pageInfo: { ...pageInfo, total },
                loading: false,
            });

            onChange(total);
        }).catch(() => {
            this.setState({ loading: false });
        });
    }

    /**
     * 重载表格: 会将pageNo重置为1，然后刷新
     */
    resetTable() {
        this.setState({ pageInfo: { ...this.state.pageInfo, pageNo: 1 } }, this.refreshTable);
    }

    render() {
        const { pageInfo, list, loading } = this.state;
        const { columns } = this.props;
        // 表格原来的配置
        const originProps = pick(this.props, [
            'rowKey', 'sortBy', 'sortType', 'emptyLable', 'selection', 'getRowConf',
            'expandation', 'batchComponents', 'batchComponentsAutoFixed', 'autoStick', 'autoScroll', 'className',
            'prefix',
        ]);
        // 格式化成Table自己的配置格式
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
            {...originProps}
        />);
    }
}
