import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { withReadme, withDocs } from 'storybook-readme';
import {
    withKnobs, text, number, array, boolean,
} from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';

import VerticalTab from './index';
import './index.scss';

const Pannel = VerticalTab.Pannel;

// import Readme from './README.md';
const Readme = require('./README.md');

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

storiesOf('VerticalTab 垂直Tab', module)
    .addDecorator(withKnobs)
    .addDecorator(withDocs(Readme))
    .addDecorator(withReadme(Readme))
    .add('自定义Pannel', () => (
        <CustomPannelDemo />
    ))
    .add('共用一个Pannel', () => (
        <MainPannelDemo />
    ))
    .add('无Pannel', () => (
        <NoPannelDemo />
    ));
