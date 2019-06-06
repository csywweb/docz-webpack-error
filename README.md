### 美业 React 业务组件库   @youzan/mei-components

### 浏览 
[组件预览地址](http://10.9.82.201:8080/)

### 安装使用

```sh
ynpm i --save @youzan/mei-components
// or
yyarn add @youzan/mei-components
```

### 使用

```js
import { ListByPage } from '@youzan/mei-components';

//
export default () => (
    <ListByPage />
)
```

## 如何开发

### 运行开发环境

```sh
npm run storybook
```
本地网页中通过 http://127.0.0.1:6006 进行访问

### 添加组件

禁止在 `master`分支上开发，从`master`拉取`feature`分支，开发完成，添加到`src/index.js`之中。

组件文件夹中，除了组件代码，还必须包括
- `__story__.js`：用来生成storybook
- `README.md`：组件说明文档

通过命令添加组件，会在开发目录下添加对应组件
``` javascript
npm run package -- package_name
```

### 组件命名规则
- 目前组件库采用 babel-plugin-import 进行按需加载，组建文件夹必须采用 小写加下划线命名规则
- 在项目中，css 资源通过 babel-plugin-import 进行加载，组件中禁止加载 css 资源，否则会出现bug
- css 目前使用 BEM 命名方式

### 组件开发注意事项：
- 为各种使用场景编写demo以及附上demo的源码
- 有demo可以当场体验而不是使用者要自己写代码后才能体验这个组件
- 它的属性列表(propTypes)全覆盖：属性名、具体描述、数据类型、是否有默认值、是否必须等
- 必须有详细的文档说明，否则差评

### 在业务开发中并行调试组件，可以采用以下任一方式

#### 通过 `npm link` 软连接方式进行开发。

- 在业务组件库`beauty-component-react`目录下执行`npm link`；
- 在`beauty-component-react`目录下执行`npm run build:babel:watch`;
- 在项目中`beauty-web`中执行`npm link @youzan/mei-components`；

#### 通过发布 beta 版本进行开发
- 修改 package.json 中的 version，例如：1.4.4-beta-1，发布到远程
- 最后确认没有问题后，更改 version 为正式版本，合并到 master 即可

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

- 组件单元测试支持
- TypeScript支持
- 生成单侧覆盖率报告
