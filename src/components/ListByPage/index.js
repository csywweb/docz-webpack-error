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
 * columns
 * */

export default class ListByPage extends React.Component {
    static propTypes = {
        action: PropTypes.func.isRequired,
    };

    static defaultProps = {
        filter: {},
        list: [],
        pageKey: 'pageNo',
        pageSize: 20,
        pagination: true,
        columns: [],
        className: '',
        loading: false,
    };

    state = {
        loading: this.props.loading,
        page: {
            current: 1,
        },
        filter: this.props.filter,
        total: 0,
        list: this.props.list,
    };

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.state.filter, nextProps.filter)) {
            const prevControl = nextProps.filter.prevControl !== this.state.filter.prevControl;
            const { current } = this.state.page;
            const newCurrent = prevControl && current > 1 ? current - 1 : 1;
            this.setState({
                filter: nextProps.filter,
                page: { current: newCurrent },
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
    }

    fetchData = () => {
        this.setState({ loading: true });
        const filter = { ...this.state.filter };
        delete filter.prevControl;

        return this.props.action(assign({}, filter, mapKeys(this.state.page, () => this.props.pageKey))).then(() => {
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
