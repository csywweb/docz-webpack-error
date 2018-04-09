## 美业 React 业务组件库

在开发React组件时我们通常需要处理3个问题：

1. 展示以便更多的人可以复用

2. 实例化这个组件以便调试

3. 为这个组件编写使用文档以便更好的让别人知道怎么使用这个组件

最原始的方法莫过于开发时建一个页面用于调试，开发完后再为其手写文档。然而一个详细的React组件文档应该包括：

1. 为各种使用场景编写demo以及对应的说明，同时附上demo的源码

2. 有demo可以当场体验而不是使用者要自己写代码后才能体验这个组件

3. 它的属性列表(propTypes)全覆盖：属性名、具体描述、数据类型、是否有默认值、是否必须等

4. 示例丰富