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
 * 3、未放入组件库中
 *
 * 组件库：
 *  1、组价库中样式书写不方便，pop_selector组件未完成，但已推上master
 *  2、组件库目前未合并到1.1.0-beata-1版本
 *  2、组件库分支：feature/vertical_tab
 *  3、组件库完善后再置入
 */

import React, { Component } from 'react';
import Pannel from './pannel';
import util from './util';

class VerticalTab extends Component {
    static Pannel = Pannel;

    onChange = (id) => {
        this.props.onChange && this.props.onChange(id);
    }

    renderNavs(tabs) {
        const { title, activeId, width = 200 } = this.props;
        return (
            <div className="item-slider" style={{ width }}>
                {title && <div className="tab-title">{ title }</div>}
                <ul className="item-nav">
                    {
                        tabs.map(tab => (
                            <li
                                className={activeId === tab.id ? 'actived tab-item' : 'tab-item'}
                                key={tab.id}
                                onClick={() => this.onChange(tab.id)}
                            >
                                { tab.text }
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }

    renderPannels(tabs) {
        const list = [];
        tabs.map((tab) => {
            list.push(<Pannel key={tab.id} {...tab} />);
        });
        return list;
    }

    render() {
        const { activeId, children, tabs } = this.props;
        const isCustomPannel = !tabs;
        const tabList = isCustomPannel ? util.getTabList(children, activeId) : (tabs || []);

        return (
            <div className="mei-components-vertical-tab">
                {this.renderNavs(tabList)}
                { isCustomPannel
                    ? this.renderPannels(tabList)
                    : (children && <div className="item-content">{children}</div>)}
            </div>
        );
    }
}

export default VerticalTab;
