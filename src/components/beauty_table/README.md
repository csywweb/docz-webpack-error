# beauty_table

如果业务中直接使用zent提供的Table组件，每一个业务都需要去维护datasets、当前页码、监听翻页动作、调用接口拉取数据等等操作，使用复杂度较高。在美业业务里面，接口结构基本统一，很多参数都是固定的，鉴于此，在zent的Table组件基础之上，封装了beauty_table组件，用户只需要配置基本的参数，就可以使用Table的所有功能，无需再监听翻页事件、维护datasets及当前页码等繁琐的操作。

## 使用指南

```javascript
import React from 'react';
import BeautyTable from '@youzan/beauty-react-components';

const data = {
    "page":1,
    "size":20,
    "total":7,
    "list":[
        {
            "id":297,
            "kdtId":327844,
            "deptId":1,
            "activityId":19025600233,
            "name":"阿斯顿发送到",
            "beginTime":1530010964000,
            "endTime":1530288000000,
            "couponIds":[
                1771
            ],
            "status":5,
            "activityType":2,
            "activityPv":0,
            "emitCount":0,
            "selectDeptCount":0,
            "memberNum":0,
            "couponVOList":[

            ]
        },
        {
            "id":215,
            "kdtId":327844,
            "deptId":1,
            "activityId":14010431271,
            "name":"aaaa",
            "beginTime":1524117654000,
            "endTime":1524153600000,
            "couponIds":[
                1289
            ],
            "status":5,
            "activityType":2,
            "activityPv":0,
            "emitCount":0,
            "selectDeptCount":0,
            "memberNum":0,
            "couponVOList":[

            ]
        }
    ]
};

/***
在实际业务中，需要从api中直接引入即可，比如：
import marketingApi from 'common/api/marketing';
const fetchData = marketingApi.getCouponPublisherActivityList.bind(marketingApi); //注意绑定函数上下文
***/
const fetchData = Promise.resolve((resolve) => {
    resolve(datasets);
});

const columns = [{
    title: '活动名称',
    bodyRender(item) {
        return item.name;
    },
},{
    title: '开始时间',
    bodyRender(item) {
        return item.beginTime;
    },
},{
    title: '结束时间',
    bodyRender(item) {
        return item.endTime;
    },
}];

class Page extends React.Component {
    refresh = () => {
        this.table.refreshTable();
    }
    render(){
        return (
            <div>
                <button ref={this.refresh()}>刷新表格</button>
                <BeautyTable
                    ref={(el) => { this.table = el; } } 
                    columns={columns} 
                    fetchData={fetchData}>
                </BeautyTable>
            </div>
        )
    }
}
```

## props
|参数|类型|是否必填|默认值|说明
|------|------|------|------|------|
|pageInfo|object|否|{ pageNo: 1, pageSize: 20 }|表格翻页翻页参数，仅pageNo和pageSize两个字段
|params|object|否|{}|接口调用参数，比如deptId
|fetchData|Promise|是||翻页api接口，必须是Promise对象
|formatData|func|否|noop|格式化数据函数，如果接口返回的数据不是标准格式，需要通过该函数序列化成标准格式
|columns|array|是|[]|表格列
|...|...|否|undefined|zent的Table组件其他配置都可以使用，参考[Table](https://youzan.github.io/zent/zh/component/table)

## api
### refreshTable
在组件外部，可以通过ref调用表格的refreshTable方法，刷新当前页面，eg：
```
this.table.refreshTable()
```
### resetTable  
在组件外部，通过ref调用表格的resetTable，把表格重置到首页并刷新，eg：
```
this.table.resetTable()
```