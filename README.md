## 美业 React 业务组件库   @youzan/mei-components

[![mei-components](http://npm.qima-inc.com/badge/v/@youzan/mei-components.svg?style=flat-square)](http://npm.qima-inc.com/package/@youzan/mei-components)



## 浏览 [组件预览地址](http://10.9.82.201:8080/)

在开发React组件时我们通常需要处理3个问题：

1. 展示以便更多的人可以复用

2. 实例化这个组件以便调试

3. 为这个组件编写使用文档以便更好的让别人知道怎么使用这个组件

最原始的方法莫过于开发时建一个页面用于调试，开发完后再为其手写文档。然而一个详细的React组件文档应该包括：

1. 为各种使用场景编写demo以及对应的说明，同时附上demo的源码

2. 有demo可以当场体验而不是使用者要自己写代码后才能体验这个组件

3. 它的属性列表(propTypes)全覆盖：属性名、具体描述、数据类型、是否有默认值、是否必须等

4. 示例丰富

## 安装

```sh
ynpm i --save @youzan/mei-components

// or

yyarn add @youzan/mei-components
```

## 使用

```js
import { ListByPage } from '@youzan/mei-components';

//

export default () => (
    <ListByPage />
)
```

## 开发

### 1. 运行开发环境

```sh
npm run storybook
```

### 2. 添加组件

不要在`master`分支上开发，从`master`拉取`feature`分支，开发完成，添加到`src/index.js`之中。

除了组件本身，还应该包括

- `__story__.js`：用来生成storybook
- `README.md`：组件说明文档

### 3. 在业务开发中并行调试组件

首先我们需要了解 `npm link`。

1. 在业务组件库`beauty-component-react`目录下执行`npm link`；
2. 在`beauty-component-react`目录下执行`npm run build:babel:watch`;
3. 在项目中`beauty-web`中执行`npm link @youzan/mei-components`；

### 打包

```sh
npm run build 
```

### 发布

```
# 通过钩子会自动执行 clean && build

ynpm login
// 如果没有权限 需要 @zhouzhen 加一下 ynpm adduser
ynpm publish
```

### 更新网站

```sh
// 进入到 qa机器 10.9.82.201
// 项目目录为  /data/project/beauty-component-react
git pull 
npm run build:site
```

### 更新日志

[CHANGELOG](./CHANGELOG.md)

## TODO

- 支持scss [鼓励使用styled-components] [你需要知道的CSS-in-JS](http://www.infoq.com/cn/news/2017/11/css-in-js-need-know?utm_source=infoq&utm_campaign=footer_links&tm_medium=footer_links_article_page)
- 组件单元测试支持
- TypeScript支持
- 生成单侧覆盖率报告
