import React, {useEffect, useState} from "react";
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {signOut, useSession} from 'next-auth/react';
import Icon from '@/components/Icon'
import LinkModal from "../linkModal";
import NavModal from "../navModal";
import {useRouter} from "next/navigation";



const Header: React.FC = () => {
    const router = useRouter();
    const items: MenuProps['items'] = [
        {
            icon: <Icon type='icon-blog-solid'/>,
            label: (
                <a href="https://jszoo.com" target="_blank" rel="noopener noreferrer">
                    站长博客
                </a>
            ),
            key: 'blog',
        }
    ];
    const [menu, setMenu] = useState<MenuProps['items']>(items)
    const [linkModal, setLinkModal] = useState<boolean>(false)
    const [navModal, setNavModal] = useState<boolean>(false)
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
                            icon: <Icon type='icon-caidan'/>
                        },
                        {
                            label: '新增链接',
                            key: 'addLink',
                            icon: <Icon type='icon-lianjie'/>
                        },
                        {
                            label: '注销登录',
                            key: 'logout',
                            icon: <Icon type='icon-tuichu'/>
                        }
                    ]
                })
                break
            case "loading":
                userMenu.push({
                    disabled: true,
                    label: '加载中...',
                    key: 'loading',
                    icon: <Icon type=''/>
                })
                break
            default:
                userMenu.push({
                    label: '登录',
                    key: 'login',
                    icon: <Icon type='icon-denglu'/>
                })
        }
        setMenu([...items, ...userMenu])
    }, [status, session ])

    const onClick: MenuProps['onClick'] = async ({key}) => {
        switch (key) {
            case 'login':
                router.push('/auth/login');
                break;
            case 'logout':
                await signOut()
                break
            case 'addLink':
                setLinkModal(true)
                break
            case 'editMenu':
                setNavModal(true)
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
                navModal ? <NavModal setNavModal={setNavModal}/> : null
            }
        </>

    );
};

export default Header;
