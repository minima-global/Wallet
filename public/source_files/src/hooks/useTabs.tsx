import { useState } from 'react';
import { tabStyles } from '../pages/components/MiCustom/MiTabs';
const useTabs = () => {
    const [tabs, setTabOpen] = useState(0);

    const toggleTab = (i: number) => setTabOpen(i);

    return {
        tabs,
        setTabOpen,
        toggleTab,
        tabStyles,
    };
};

export default useTabs;
