import React, {useEffect, useState} from "react";
import type {MenuProps} from 'antd';
import {Menu, message, notification, Button} from 'antd';
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
            icon: <Icon type='icon-zuanshix' className={'text-2xl'}/>,
            label: (<Link href='/post'>趣集精选</Link>),
            key: 'post',
        },
        {
            icon: <Icon type='icon-fuzhi1' className={'text-2xl'}/>,
            label: (<Link href='/clipboard'>云剪切板</Link>),
            key: 'clipboard',
        },
        {
            icon: <Icon type='icon-zhuye-' className={'text-2xl'}/>,
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
                            label: session?.user.password ? '修改密码' : '设置邮箱/密码',
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
                openNotification()
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
                    icon: <Icon type='icon-denglu1' className={'text-2xl'}/>
                })
        }
        setMenu([...items, ...userMenu])
    }, [status, session])

    const openNotification = () => {
        if (session?.user && (!session.user.email || !session.user.password) && !sessionStorage.getItem('notification')) {
            notification.open({
                message: `温馨提示`,
                description: <div>
                    <div className='text-xs mb-2'>您的账号还没有设置{session?.user.email ? '' : 'Email和'}密码，设置以后可以使用
                        邮箱+密码 登录
                    </div>
                    <div className="flex justify-between">
                        <Button type={'dashed'}
                                onClick={hideNotification}>不再提醒</Button>
                        <Button type={'primary'} onClick={goToSet}>立即设置</Button>
                    </div>
                </div>,
                icon: <Icon type={'icon-wutuijian2'}/>,
                placement: 'topRight',
                duration: 10
            });
        }
    }
    const goToSet = () => {
        setPasswordModal(true)
        notification.destroy()
    }

    const hideNotification = () => {
        sessionStorage.setItem('notification', 'mute')
        notification.destroy()
    }

    const onClick: MenuProps['onClick'] = async ({key}) => {
        switch (key) {
            case 'login':
                router.push('/auth/login');
                break;
            case 'newPost':
                session?.user.role === 'admin' ? router.push('/post/newOrEdit') : message.warning('暂未开放此权限')
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
                style={{borderBottom: `1px solid ${theme}`}}
                className='select-none justify-end flex-auto min-w-0 menu-bg header-menu'
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
