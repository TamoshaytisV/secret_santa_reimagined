import React, {useState} from 'react';
import {Tab} from "./Tab";

import styles from './styles.scss';


export interface Tab {
    label: string;
    children?: any;
}


const Tabs = ({items}: { items: Tab[] }) => {
    const [activeTab, setActiveTab] = useState(items[0]);

    const onSelect = (tab: any) => {
        if (!tab.hasOwnProperty('children')) {
            tab.children = null;
        }
        setActiveTab(tab);
    }

    return <React.Fragment>
        <div className={styles.tabs}>
            {items.map((tab: any, idx: number) =>
                <Tab key={idx}
                     label={tab.label}
                     active={tab.label === activeTab.label}
                     onClick={() => onSelect(tab)}/>
            )}
        </div>
        <div className={styles.tabContent}>
            {activeTab.children}
        </div>
    </React.Fragment>;
};

export {Tabs};
