import React from 'react';
import BeautyTable from './index';

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

const fetchDataPromise = () => new Promise(resolve => resolve({ data: datasets, total: datasets.length }));

const formatData = data => ({
    list: data.data,
    total: data.count,
});

export default () => <BeautyTable fetchData={fetchDataPromise} formatData={formatData} columns={columns} />;
