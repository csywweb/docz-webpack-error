/**
 * Created by zhouzhen on 2017/9/26.
 */
import React, { PureComponent } from 'react';
import { Form as ZentForm, Button, Loading, Notify, Input, Dialog, Select, Pop, Checkbox } from 'zent';
const { Field, InputField, getControlGroup } = ZentForm;
import RegionSelect from '@youzan/region-select';
import ReactMap from '@youzan/react-amap';
import '@youzan/region-select/lib/index.css';
import '@youzan/react-amap/lib/index.css';
import './address.scss';
import isEqual from 'lodash/isEqual';


const RegionField = getControlGroup((props) => {
    const onChange = (data) => {
        props.onChange(data.county_id);
        props.change({
            province: data.province,
            city: data.city,
            district: data.area,
            areaCode: data.county_id,
        })
    };

    return <RegionSelect value={props.value} onChange={onChange}/>;
});
const AddressDetailField = getControlGroup((props) => {
    const onChange = (e) => {
        let detailedAddress = e.target.value;
        props.onChange(detailedAddress);
    };

    const confirmHandle = () => {
        console.log(props.value);
        props.change({
            detailedAddress: props.value
        })
    };

    return (
        <div>
            <Input
                className="address-detail"
                value={props.value} onChange={onChange}
                onPressEnter={confirmHandle}
                onBlur={confirmHandle}
            />
            <Button className="address-search-btn btn-mid" type="primary" onClick={confirmHandle}>搜索地图</Button>
        </div>
    );
});

const AMapField = getControlGroup((props) => {
    let {
        detailedAddress,
        longitude,
        latitude,
        city
    } = props.data;


    const onMapChange = (options, detailedAddress, obj) => {
        if (options.lng) {
            longitude = options.lng;
            latitude = options.lat;
        } else {
            longitude = options[ 0 ];
            latitude = options[ 1 ];
        }

        props.change({
            detailedAddress: detailedAddress,
            latitude: latitude, //纬度
            longitude: longitude,   //经纬度
        });
    };

    const API_KEY = 'd556dc1b176626ac55ce4a748c5bdb6d';
    const mapConfig = {
        zoom: 12,
        resizeEnable: true
    };

    return (
        <div>
            <ReactMap
                className="store-map"
                idName="amap"
                mapConfig={mapConfig}
                apiKey={API_KEY}
                version="1.3"
                city={city}
                query={detailedAddress}
                defaultValue={[ longitude, latitude ]}  //经纬度不要搞反
                onChange={onMapChange}
            />
        </div>
    );
});

export default class AddressField extends PureComponent {
    state = {
        ...this.props,
    };

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props, nextProps)) {
            // console.log(nextProps);
            this.setState(nextProps);
        }
    }

    change = (values) => {
        this.setState({
            ...values
        }, () => {
            // typeof this.props.onChange === 'function' && this.props.onChange(values)
        });
    };

    render() {
        let shopAddress = this.state;
        /*
         * province: get(model, 'shopAddress.province'),
         city: get(model, 'shopAddress.city'),
         area: get(model, 'shopAddress.area'),
         areaCode: get(model, 'shopAddress.areaCode'),
         * */
        return (
            <div>
                <Field
                    name="areaCode"
                    label="门店地址："
                    value={shopAddress.areaCode}
                    component={RegionField}
                    change={this.change}
                    validations={{
                        validCounty(values, value) {
                            if (value > 0) return true;
                            return '门店地址不能为空';
                        }
                    }}
                    required
                />
                <Field
                    placeholder="请填写具体地址"
                    name="detailedAddress"
                    label=""
                    value={shopAddress.detailedAddress || shopAddress.addressDetail}
                    component={AddressDetailField}
                    change={this.change}
                    validations={{
                        validDetail(values, value) {
                            if (!value) {
                                return '具体地址不能为空';
                            }

                            return true;
                        }
                    }}
                />
                <Field
                    name="amap"
                    label="地图定位："
                    data={{
                        city: shopAddress.city,
                        detailedAddress: shopAddress.detailedAddress,
                        latitude: shopAddress.latitude || shopAddress.lat, //纬度
                        longitude: shopAddress.longitude || shopAddress.lng,   //经纬度
                    }}
                    component={AMapField}
                    change={this.change}
                    validations={{
                        validField(values, value) {
                            if (!shopAddress.latitude || !shopAddress.latitude) {
                                return '请在地图上选择坐标';
                            }

                            return true;
                        }
                    }}
                    required
                />
                <Field name="shopAddress"
                       component={InputField}
                       value={shopAddress}
                       type="hidden"
                       className="hide"
                />
            </div>
        )
    }
}
