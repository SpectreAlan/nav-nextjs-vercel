import React, {useEffect, useState} from "react";
import type {MenuProps} from 'antd';
import {Menu, message} from 'antd';
import {signOut, useSession} from 'next-auth/react';
import Icon from '@/components/Icon'
import NavModal from "../navModal";
import {useRouter} from "next/navigation";
import {LoadingOutlined} from '@ant-design/icons';
import Link from 'next/link';


const Header: React.FC = () => {
    const router = useRouter();
    const items: MenuProps['items'] = [
        {
            icon: <Icon type='icon-blog-solid'/>,
            label: (<Link href='/post'>趣集精选</Link>),
            key: 'post',
        },
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
                            label: '创建趣集',
                            key: 'newPost',
                            icon: <Icon type='icon-caidan'/>
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
                    icon: <LoadingOutlined rev=''/>
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
    }, [status, session])

    const onClick: MenuProps['onClick'] = async ({key}) => {
        switch (key) {
            case 'login':
                router.push('/auth/login');
                break;
            case 'newPost':
                if (session?.user.role === 'admin') {
                    router.push('/post/newOrEdit');
                } else {
                    message.warning('暂未开放此权限')
                }

                break;
            case 'logout':
                await signOut()
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
                navModal ? <NavModal setNavModal={setNavModal}/> : null
            }
        </>
    );
};

export default Header;
