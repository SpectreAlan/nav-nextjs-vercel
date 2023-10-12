import React, {useEffect, useState} from "react";
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {signOut, useSession, signIn} from 'next-auth/react';
import {
    AppstoreOutlined,
    LoadingOutlined,
    PoweroffOutlined,
    EditOutlined,
    SendOutlined
} from '@ant-design/icons';
import AddOrEditLink from "@/components/addLink";

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
    const [addOrEditVisible, setAddOrEditVisible] = useState<boolean>(false)
    const {data: session, status} = useSession();

    useEffect(() => {
        const userMenu: MenuProps['items'] = []
        switch (status) {
            case "authenticated":
                const {name, image} = session.user!
                userMenu.push({
                    label: name,
                    key: 'userInfo',
                    icon: <img src={image!} alt={'avatar'} className={'max-h-4'}/>,
                    children: [
                        {
                            label: '添加链接',
                            key: 'addLink',
                            icon: <EditOutlined rev={''}/>
                        },
                        {
                            label: '注销登录',
                            key: 'logout',
                            icon: <PoweroffOutlined rev={''}/>
                        }
                    ]
                })
                break
            case "loading":
                userMenu.push({
                    disabled: true,
                    label: '加载中...',
                    key: 'loading',
                    icon: <LoadingOutlined rev={''}/>
                })
                break
            default:
                userMenu.push({
                    label: '登录',
                    key: 'login',
                    icon: <SendOutlined rev={''}/>
                })
        }
        setMenu([...items, ...userMenu])
    }, [status])

    const onClick: MenuProps['onClick'] = async ({key}) => {
        switch (key) {
            case 'login':
                await signIn()
                break;
            case 'logout':
                await signOut()
                break
            case 'addLink':
                setAddOrEditVisible(true)
                break
        }
    };

    return (
        <>
            <Menu
                selectedKeys={[]}
                style={{minWidth: 0, flex: "auto", justifyContent: 'end'}}
                theme={'dark'}
                onClick={onClick}
                mode="horizontal"
                items={menu}
            />
            {
                addOrEditVisible ? <AddOrEditLink setAddOrEditVisible={setAddOrEditVisible}/> : null
            }
        </>

    );
};

export default Header;
