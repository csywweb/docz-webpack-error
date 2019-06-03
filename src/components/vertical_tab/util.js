import React from 'react';
import Pannel from './pannel';

const util = {
    getTabList(children, activeId) {
        const list = [];
        const childrenList = React.Children.toArray(children);

        React.Children.forEach(childrenList, (child) => {
            if (this.checkIfPanel(child)) {
                const {
                    id,
                    text,
                    children,
                } = child.props;
                list.push({
                    id,
                    text,
                    isActive: activeId === id,
                    children,
                });
            }
        });

        return list;
    },

    checkIfPanel(child) {
        const type = child && child.type;
        return (
            type === Pannel ||
            (type && type.prototype instanceof Pannel)
        );
    },
};

export default util;
