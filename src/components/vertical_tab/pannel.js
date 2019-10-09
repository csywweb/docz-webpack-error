import React, { Component } from 'react';

class Pannel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mounted: !!props.isActive, // 是否在视图中出现过，初始时不需要展示的Dom不展示，减少内存损耗
        };
    }

    componentWillReceiveProps(nextProps) {
        const { isActive } = nextProps;
        const { mounted } = this.state;
        if (isActive && !mounted) {
            this.setState({ mounted: true });
        }
    }

    render() {
        const { mounted = false } = this.state;
        const { isActive } = this.props || false;
        if (mounted) {
            return (
                <div className={`item-content ${isActive ? '' : 'hidden'}`}>
                    {this.props.children}
                </div>
            );
        }
        return null;
    }
}

export default Pannel;
