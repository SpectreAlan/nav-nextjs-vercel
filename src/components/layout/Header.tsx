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
import LinkModal from "../linkModal";
import MenuModal from "../menuModal";



const Header: React.FC = () => {
    const items: MenuProps['items'] = [
        {
            icon: <AppstoreOutlined rev={''}/>,
            label: (
                <a href="https://jszoo.com" target="_blank" rel="noopener noreferrer">
                    个人博客
                </a>
            ),
            key: 'blog',
        }
    ];
    const [menu, setMenu] = useState<MenuProps['items']>(items)
    const [linkModal, setLinkModal] = useState<boolean>(false)
    const [menuModal, setMenuModal] = useState<boolean>(false)
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
                            label: '编辑导航条',
                            key: 'editMenu',
                            icon: <EditOutlined rev={''}/>
                        },
                        {
                            label: '新增链接',
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
                setLinkModal(true)
                break
            case 'editMenu':
                setMenuModal(true)
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
                linkModal ? <LinkModal setLinkModal={setLinkModal}/> : null
            }
            {
                menuModal ? <MenuModal setMenuModal={setMenuModal}/> : null
            }
        </>

    );
};

export default Header;
