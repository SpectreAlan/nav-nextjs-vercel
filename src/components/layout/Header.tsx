import React from "react";
import {useRouter} from "next/navigation";
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {signOut, useSession} from 'next-auth/react';
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const items: MenuProps['items'] = [
    {
        label: '登录',
        key: 'mail',
        icon: <MailOutlined rev={''}/>,
    },
    {
        label: 'Navigation Two',
        key: 'app',
        icon: <AppstoreOutlined rev={''}/>,
        disabled: true,
    },
    {
        label: 'Navigation Three - Submenu',
        key: 'SubMenu',
        icon: <SettingOutlined rev={''}/>,
        children: [
            {
                type: 'group',
                label: 'Item 1',
                children: [
                    {
                        label: 'Option 1',
                        key: 'setting:1',
                    },
                    {
                        label: 'Option 2',
                        key: 'setting:2',
                    },
                ],
            },
            {
                type: 'group',
                label: 'Item 2',
                children: [
                    {
                        label: 'Option 3',
                        key: 'setting:3',
                    },
                    {
                        label: 'Option 4',
                        key: 'setting:4',
                    },
                ],
            },
        ],
    },
    {
        label: (
            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                Navigation Four - Link
            </a>
        ),
        key: 'alipay',
    },
];

const Header: React.FC = () => {
    const router = useRouter();
    const {data: session, status} = useSession();

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        console.log(session);
        console.log(status);
    };

    return (
        <Menu
            theme={'dark'}
            onClick={onClick}
            mode="horizontal"
            items={items}
        />
    );
};

export default Header;
