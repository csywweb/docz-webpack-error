/**
 * Created by zhouzhen on 2017/9/26.
 */
import RegionSelect from '@youzan/region-select';
import ReactMap from '@youzan/react-amap';
import '@youzan/region-select/lib/index.css';
import '@youzan/react-amap/lib/index.css';
import isEqual from 'lodash/isEqual';
import {
    Form as ZentForm, Button, Input, Pop, Icon,
} from 'zent';
import { AddressDiv } from './style';

const { Field, InputField, getControlGroup } = ZentForm;

const RegionField = getControlGroup((props) => {
    const onChange = (data) => {
        props.onChange(data.county_id);
        props.change({
            province: data.province,
            city: data.city,
            district: data.area,
            areaCode: data.county_id,
        });
    };

    return <RegionSelect value={props.value} onChange={onChange} />;
});

const AddressDetailField = getControlGroup((props) => {
    const onChange = (e) => {
        const detailedAddress = e.target.value;
        props.onChange(detailedAddress);
    };

    const confirmHandle = () => {
        props.change({
            detailedAddress: props.value,
        });
    };

    return (
        <div>
            <Input
                className="address-detail"
                value={props.value}
                onChange={onChange}
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
        city,
    } = props.data;


    const onMapChange = (options, detailedAddress, obj) => {
        if (options.lng) {
            longitude = options.lng;
            latitude = options.lat;
        } else {
            longitude = options[0];
            latitude = options[1];
        }

        props.change({
            detailedAddress,
            latitude, // 纬度
            longitude, // 经纬度
        });
    };

    const API_KEY = 'd556dc1b176626ac55ce4a748c5bdb6d';
    const mapConfig = {
        zoom: 12,
        resizeEnable: true,
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
                defaultValue={[longitude, latitude]} // 经纬度不要搞反
                onChange={onMapChange}
            />
        </div>
    );
});


const TitPop = () => (
    <div className="map-tit-pop">
        <p style={{ color: '#555555' }}>1、找不到您的店铺地址？</p>
        <p>美业采用的是高德地图的控件，您可以前往高德地图新增店铺地址信息，审核通过后即可搜索。</p>
        <p style={{ color: '#555555' }}>2、找不到时您可以这么做</p>
        <p>当搜索不到您的店铺地址时，可在地图上进行手动拖动，可能会有100米左右的误差，所以请务必填写详细店铺地址。</p>
    </div>
);

export default class AddressField extends React.PureComponent {
    state = {
        ...this.props,
    };

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props, nextProps)) {
            this.setState(nextProps);
        }
    }

    change = (values) => {
        this.setState({
            ...values,
        });
    };

    amapChange=(values) => {
        const { detailedAddress, ..._values } = values;
        this.change(_values);
    }


    render() {
        const shopAddress = this.state;
        /*
         * province: get(model, 'shopAddress.province'),
         city: get(model, 'shopAddress.city'),
         area: get(model, 'shopAddress.area'),
         areaCode: get(model, 'shopAddress.areaCode'),
         * */
        return (
            <AddressDiv>
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
                        },
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
                    helpDesc="店铺地址将会展示给会员，请填写详细地址，包括楼层、门牌号，方便会员查找"
                    validations={{
                        validDetail(values, value) {
                            if (!value) {
                                return '具体地址不能为空';
                            }

                            return true;
                        },
                    }}
                />
                <Field
                    name="amap"
                    helpDesc={(
                        <Pop
                            trigger="hover"
                            position="bottom-center"
                            content={<TitPop />}
>
                            <span className="gray-text mr-10" style={{ fontSize: 12 }}>
找不到地址？
<Icon type="help-circle-o" className="deduct-help-icon" />
</span>
</Pop>
                    )}
                    label="地图定位："
                    data={{
                        city: shopAddress.city,
                        detailedAddress: shopAddress.detailedAddress,
                        latitude: shopAddress.latitude || shopAddress.lat, // 纬度
                        longitude: shopAddress.longitude || shopAddress.lng, // 经纬度
                    }}
                    component={AMapField}
                    change={this.amapChange}
                    validations={{
                        validField(values, value) {
                            if (!shopAddress.latitude || !shopAddress.latitude) {
                                return '请在地图上选择坐标';
                            }
                            return true;
                        },
                    }}
                    required
                />
                <Field
                    name="shopAddress"
                    component={InputField}
                    value={shopAddress}
                    type="hidden"
                    className="hide"
                />
            </AddressDiv>
        );
    }
}
