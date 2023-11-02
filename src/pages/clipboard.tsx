import React, {useEffect, useState} from 'react';
import {Tabs} from 'antd';
import SetClipboard from "@/components/Clipboard/setClipboard";
import GetClipboard from "@/components/Clipboard/getClipboard";
import HistoryClipboard from "@/components/Clipboard/historyClipboard";
import {useSession} from "next-auth/react";

const Clipboard: React.FC<{ active: string, code: string }> = ({active, code}) => {
    const [activeKey, setActive] = useState(active)
    const {data: session} = useSession();
    const [tabs, setTabs] = useState([
        {
            label: '创建云剪切板',
            key: 'add',
            children: <SetClipboard/>
        },
        {
            label: '获取剪切板',
            key: 'get',
            children: <GetClipboard code={code}/>
        }
    ])
    useEffect(() => {
        if (session) {
            setTabs((tabs) => {
                tabs[2] = {
                    label: '历史记录',
                    key: 'history',
                    children: <HistoryClipboard/>
                }
                return tabs
            })
        }
    }, [session])
    return <>
        <Tabs
            destroyInactiveTabPane
            activeKey={activeKey}
            onChange={setActive}
            items={tabs}
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
