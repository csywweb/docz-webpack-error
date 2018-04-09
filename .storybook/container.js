import React from 'react';
import 'zent/css/index.css';

export default props => (
    <div
        style={{
            padding: '20px',
            color: '#333',
            fontSize: '12px',
            fontFamily: 'Arial, Helvetica, sans-serif',
        }}
    >
        {props.story()}
    </div>
);
