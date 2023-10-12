import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {signOut, useSession} from 'next-auth/react';
import {
    AppstoreOutlined,
    LoadingOutlined,
    PoweroffOutlined,
    SendOutlined
} from '@ant-design/icons';

const items: MenuProps['items'] = [
    {
        icon: <AppstoreOutlined rev={''}/>,
        label: (
            <a href="https://jszoo.com" target="_blank" rel="noopener noreferrer">
                个人博客
            </a>
        ),
        key: '个人博客',
    }
];

const Header: React.FC = () => {
    const [menu, setMenu] = useState<MenuProps['items']>(items)
    const router = useRouter();
    const {data: session, status} = useSession();

    useEffect(() => {
        let userInfo: any = null
        switch (status) {
            case "authenticated":
                const {name, image} = session.user!
                userInfo = {
                    label: name,
                    key: 'userInfo',
                    icon: <img src={image!} alt={'avatar'} className={'max-h-4'}/>,
                    children: [
                        {
                            label: '注销登录',
                            key: 'logout',
                            icon: <PoweroffOutlined rev={''}/>
                        }
                    ]
                }
                break
            case "loading":
                userInfo = {
                    disabled: true,
                    label: '加载中...',
                    key: 'loading',
                    icon: <LoadingOutlined rev={''}/>
                }
                break
            default:
                userInfo = {
                    label: '登录',
                    key: 'login',
                    icon: <SendOutlined rev={''}/>
                }
        }
        setMenu([...items, userInfo])
    }, [status])

    const onClick: MenuProps['onClick'] = async ({key}) => {
        switch (key) {
            case 'login':
                router.push('/api/auth/signin')
                break;
            case 'logout':
                await signOut()
                break
        }
    };

    return (
        <Menu
            selectedKeys={[]}
            style={{minWidth: 0, flex: "auto", justifyContent: 'end'}}
            theme={'dark'}
            onClick={onClick}
            mode="horizontal"
            items={menu}
        />
    );
};

export default Header;
