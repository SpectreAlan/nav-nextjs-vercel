import React, {useEffect, useState} from "react";
import type {MenuProps} from 'antd';
import {Menu, message, notification, Space, Button} from 'antd';
import {signOut, useSession} from 'next-auth/react';
import Icon from '@/components/Icon'
import NavModal from "../navModal";
import {useRouter} from "next/navigation";
import {LoadingOutlined} from '@ant-design/icons';
import Link from 'next/link';
import UpdatePassword from "@/components/UpdatePassword";


const Header: React.FC<{ theme: string }> = ({theme}) => {
    const router = useRouter();
    const items: MenuProps['items'] = [
        {
            icon: <Icon type='icon-zuanshix'/>,
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
    const [passwordModal, setPasswordModal] = useState<boolean>(false)
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
                            label: '编辑菜单',
                            key: 'editMenu',
                            icon: <Icon type='icon-caidan'/>
                        },
                        {
                            label: '创建趣集',
                            key: 'newPost',
                            icon: <Icon type='icon-xinjiantiezi'/>
                        },
                        {
                            label: session?.user.password ? '修改密码' : '设置密码',
                            key: 'updatePassword',
                            icon: <Icon type='icon-tianchongxing-'/>
                        },
                        {
                            label: '注销登录',
                            key: 'logout',
                            icon: <Icon type='icon-tuichu'/>
                        }
                    ]
                })
                if (!session?.user.email || !session?.user.password) {
                    notification.open({
                        message: `温馨提示`,
                        description: <Space>
                            <span className='text-xs'>您的账号还没有设置{session?.user.email ? '' : 'Email和'}密码，设置以后可以使用 邮箱+密码 登录</span>
                            <Button type={'link'} onClick={() => setPasswordModal(true)}>立即设置</Button>
                        </Space>,
                        icon: <Icon type={'icon-wutuijian2'}/>,
                        placement: 'topRight'
                    });
                }
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
            case 'updatePassword':
                setPasswordModal(true)
                break
        }
    };

    return (
        <>
            <Menu
                selectedKeys={[]}
                style={{minWidth: 0, flex: "auto", justifyContent: 'end', borderBottom: `1px solid ${theme}`}}
                theme={'light'}
                onClick={onClick}
                mode="horizontal"
                items={menu}
            />
            {
                navModal ? <NavModal setNavModal={setNavModal}/> : null
            }
            {
                passwordModal ? <UpdatePassword setPasswordModal={setPasswordModal}/> : null
            }
        </>
    );
};

export default Header;
