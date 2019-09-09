# VerticalTab

### 自定义多个Pannel
```
class CustomPannelDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: 1,
            tabs: [
                { id: 1, text: '一' },
                { id: 2, text: '二' },
                { id: 3, text: '三' },
            ],
        };
    }

    renderPannel = d => (
        <Pannel key={d.id} id={d.id} text={d.text}>
            text:
            {d.text}
        </Pannel>
    )

    onTabChange = (id) => {
        this.setState({ activeId: id });
    }

    render() {
        const { tabs, activeId } = this.state;
        return (
            <VerticalTab activeId={activeId} title="自定义Pannel" onChange={this.onTabChange}>
                {tabs.map(this.renderPannel)}
            </VerticalTab>
        );
    }
}
```
### 共用一个Pannel
```
class MainPannelDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: 1,
            tabs: [
                { id: 1, text: '一' },
                { id: 2, text: '二' },
                { id: 3, text: '三' },
            ],
        };
    }

    onTabChange = (id) => {
        this.setState({ activeId: id });
    }

    render() {
        const { tabs, activeId } = this.state;
        return (
            <VerticalTab tabs={tabs} activeId={activeId} title="自定义Pannel" onChange={this.onTabChange}>
                <div>自己传入子元素</div>
            </VerticalTab>
        );
    }
}
```

### 只展示Nav
```
class NoPannelDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: 1,
            tabs: [
                { id: 1, text: '一' },
                { id: 2, text: '二' },
                { id: 3, text: '三' },
            ],
        };
    }

    onTabChange = (id) => {
        this.setState({ activeId: id });
    }

    render() {
        const { tabs, activeId } = this.state;
        return (
            <VerticalTab
                tabs={tabs}
                activeId={activeId}
                title="自定义Pannel"
                onChange={this.onTabChange}
            />
        );
    }
}
```

### VerticalTab API

| 参数 | 类型 | 是否必填 | 默认值 | 说明
|------|------|------|------|------|
| title | String | 否 | undefined | 左侧Nav标题，不传则不展示 |
| tabs | Array | 否 | null | tabs列表，{id: xxx, text: xxx},传入后使用自定义Pannel无效 |
| activeId | Number/String | undefined | undefined | 选中tabId |
| onChange | func | activeId切换回调 | null | 提供新切换的activeId参数 |
| slideWidth | Number | 左侧slide宽度 | 200 | 默认宽度200px |
| slideMarginRight | Number | 左侧slide marginRight | 20 | 默认宽度20px |

### VerticalTab.Pannel API
| 参数 | 类型 | 是否必填 | 默认值 | 说明
|------|------|------|------|------|
| id | Number/String | 是 | undefined | Pannel Id标识 |
| text | String | 否 | undefined | Pannel 文本 |