import React from 'react';
import {Tabs } from 'antd';
import SetClipboard from "@/components/Clipboard/setClipboard";
import GetClipboard from "@/components/Clipboard/getClipboard";

const Clipboard: React.FC = () => {
    return <>
        <Tabs
            defaultActiveKey="add"
            items={[
                {
                    label: '创建云剪切板',
                    key: 'add',
                    children: <SetClipboard/>
                },
                {
                    label: '获取剪切板',
                    key: 'get',
                    children: <GetClipboard/>
                },
                {
                    label: '历史记录',
                    key: 'history',
                    children: <SetClipboard/>
                }
            ]}
        />
    </>;
};

export default Clipboard;