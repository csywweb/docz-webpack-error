import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

// import Readme from './README.md';
const Readme = require('./README.md');

import { withReadme, withDocs } from 'storybook-readme';
import { withKnobs, text, number, array, boolean, object } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';

import {
    Form,
} from 'zent';
import AddressField from './index';
const {
    createForm,
    Field,
    InputField,
} = Form;

const shopAddress={
    areaCode:"370102",
    city:"山东省",
    detailedAddress:"北京市东城区东环居苑(西门)",
    district:"历下区",
    latitude:39.898579,
    longitude:116.445219,
    province:"山东省"
}




const FormByMap=()=>{
    return  (<Form style={{textAlign: 'left'}} horizontal>
        <AddressField
            {...shopAddress}
        />
    </Form>)
};

const App=createForm()(FormByMap);


storiesOf('Field', module)
    .addDecorator(withKnobs)
    .addDecorator(withDocs(Readme))
    .addDecorator(withReadme(Readme))
    .add('AddressField', () => (
        <App />
));
