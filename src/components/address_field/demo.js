import React, { Component } from 'react';
import { Form } from 'zent';
import AddressField from './index';

const {
    createForm,
} = Form;

class GeoPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopAddress: {},
            isMounted: false,
        };
    }

    componentDidMount() {
        // AddressField使用了amap组件，该组件会在construct时进行初始化，如果此时组件未挂载，则无法渲染，所以加此判断
        this.setState({ isMounted: true });
    }


    render() {
        const {
            shopAddress,
            isMounted,
        } = this.state;
        return (
            <Form
                className="form"
                horizontal
            >
                {isMounted && <AddressField {...shopAddress} linkage />}
            </Form>
        );
    }
}

export default createForm()(GeoPanel);
