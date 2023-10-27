import React, { useState} from 'react';
import {Tabs} from 'antd';
import SetClipboard from "@/components/Clipboard/setClipboard";
import GetClipboard from "@/components/Clipboard/getClipboard";
import HistoryClipboard from "@/components/Clipboard/historyClipboard";

const Clipboard: React.FC<{ active: string, code: string }> = ({active, code}) => {
    const [activeKey, setActive] = useState(active)
    return <>
        <Tabs
            destroyInactiveTabPane
            activeKey={activeKey}
            onChange={setActive}
            items={[
                {
                    label: '创建云剪切板',
                    key: 'add',
                    children: <SetClipboard/>
                },
                {
                    label: '获取剪切板',
                    key: 'get',
                    children: <GetClipboard code={code}/>
                },
                {
                    label: '历史记录',
                    key: 'history',
                    children: <HistoryClipboard/>
                }
            ]}
        />
    </>;
};

export const getServerSideProps = async ({query}) => {
    const active = query?.active || 'add';
    const code = query?.code || '';
    return {
        props: {
            active,
            code
        },
    };
};
export default Clipboard;
