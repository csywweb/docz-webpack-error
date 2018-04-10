import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

// import Readme from './README.md';
const Readme = require('./README.md');

import { withReadme, withDocs } from 'storybook-readme';
import { withKnobs, text, number, array, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';

import ListByPage from './index';

const datasets = [{
    item_id: '5024217',
    bro_uvpv: '0/0',
    stock_num: '60',
    sold_num: 0,
}, {
    item_id: '5024277',
    bro_uvpv: '0/0',
    stock_num: 59,
    sold_num: 0,
}, {
    item_id: '13213123',
    bro_uvpv: '0/0',
    stock_num: 159,
    sold_num: 0,
}];

const columns = [{
    title: 'Product',
    bodyRender: data => (
        <div>{data.item_id}</div>
    ),
}, {
    title: 'PV',
    name: 'bro_uvpv',
    width: '200px',
}, {
    title: 'Stock',
    name: 'stock_num',
    width: '100px',
    textAlign: 'center',
    isMoney: true,
}, {
    width: '3em',
    title: 'Sales',
    name: 'sold_num',
}];


class TableDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            total: 101,
            params: {
                current: 0,
            },
        };
    }

    getList = () => new Promise((resolve) => {
        setTimeout(() => {
            resolve();
            this.setState({
                list: datasets,
                total: datasets.length,
            });
        }, 500);
    });


    render() {
        return (
            <ListByPage
                action={this.getList}
                filter={this.state.params} // 过滤条件
                total={this.state.total}
                list={this.state.list}
                rowKey="itemId"
                columns={columns}
                pageSize={this.props.pageSize}
                emptyLabel="暂无数据"
            />
        );
    }
}


storiesOf('Table', module)
    .addDecorator(withKnobs)
    .addDecorator(withDocs(Readme))
    .addDecorator(withReadme(Readme))
    .add('ListByPage', () => (<TableDemo
        pageSize={number('pageSize', 20, {
            range: true,
            min: 1,
            max: 200,
        })}
    />));
