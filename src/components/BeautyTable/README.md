# BeautyTable

> @author Happi

组件解决的问题：
封装了zent Table组件，内部维护list数据以及翻页操作，外部只需要关心表格接口，以及需要展示的表格列，降低Zent Table的使用成本

组件属性介绍：
pageInfo: object，可选，默认值：{pageNo: 1, pageSize: 20}，提供初始化页码，以及每页多少条数据，

params:  object, 可选，默认值：{}，提供过滤查询参数，

formatData: function, 可选，格式化数据函数, 该函数的入参是接口返回的原始数据，用于将非标准化翻页数据重新组装成标准翻页格式的数据，标准如下：{list: [], total: 100, current: 1, limit: 20}

fetchData: function, 必填，使用现有的api，则必须绑定api上下文，才能传入，例如：const getOrderList = orderApi.getOrderList.bind(orderApi)

columns: 必填，跟zent Table组件无任何差异，另外zent的Table的所有属性均支持，比如rowKey等等


使用例子：

```
import BeautyTable from 'cpn/beauty_table';
import orderApi from 'common/api/order';

const getOrderList = orderApi.getOrderList.bind(orderApi);

<BeautyTable
    columns={[{title: '名称1', name: 'name1'},{title: '名称2', name: 'name2'}]}        //必填
    fetchData={getOrderList} //必填
    pageInfo={{pageSize: 5}} //可选
    params={{type: 1}        //可选
    formatData={this.formatData}} //可选，函数示例： 
    function formatData(data) {
        return {
            total: data.total, current: data.current, list: data.data
        }
    }
/>
```

外部如果需要主动刷新表格，请使用ref引用，并调用组件的refreshTable方法，例如：this.orderList.refreshTable();
 
实际使用场景参考实例：src/marketing/coupon_publisher/member_list.js文件