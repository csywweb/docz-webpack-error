/**
 * 垂直tab组件
 *
 *  用法一: 自由组合pannel
 * const pannel = VerticalTab.Pannel
 *   <VerticalTab activeId={1} title={TAB_TITLE} onChange={this.onTabChange}>
 *       <Pannel id={1} key={1} text={'一'}>一</Pannel>
 *       <Pannel id={2} key={2} text={'二'}>二</Pannel>
 *  </VerticalTab>
 *  用法二：传入navs集合，只有一个子元素:
 *   <VerticalTab activeId={1} title={TAB_TITLE}
 *      tabs={[{id: 1, text: '一'}, {id: 2, text: '二'}]}
 *      onChange={this.onTabChange}>
 *      <div>children 元素中我想怎么玩就怎么玩</div>
 *  </VerticalTab>
 * 用法三：只需要navs,不需要展示子元素，不传入子元素即可
 *   <VerticalTab activeId={1} title={TAB_TITLE}
 *      tabs={[{id: 1, text: '一'}, {id: 2, text: '二'}]}
 *      onChange={this.onTabChange}>
 *   </VerticalTab>
 *
 * VerticalTab参数：
 * title: tab标题，默认为undefined, 不传入则不会展示标题
 * activeId: 选中tabid， 默认为空，默认不选中
 * tabs: 自定义tab列表，默认为null，传入tabs后，请勿使用自有组合pannel模式
 * onChange: tab修改回调，提供id参数
 *
 * VerticalTab.pannel参数：
 * id: pannel id 标识
 * text: tab 文本
 *
 * 目前存在问题：
 * 1、目前tab不能disabled
 * 2、左侧Nav目前不能自定义宽度，默认宽度为200
 * 3、Pannel组合子组件模式中，目前并未排除非Pannel组件，传入非Pannel组件的情况下，可能会报错
 */

import React from 'react';

class App extends React.Component {
    render() {
        return (
            <div className="mei-components-test">
                啊，给我一杯忘情水啊
            </div>
        );
    }
}

export default App;
