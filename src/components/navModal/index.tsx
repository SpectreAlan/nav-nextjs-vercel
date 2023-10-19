import React, {useContext, useEffect, useState} from 'react'
import {Drawer, Button, Tree, Dropdown, Spin, Menu, Modal, message} from 'antd'
import {GlobalContext} from '@/GlobalContext'
import AddOrEditNav from "@/components/navModal/addOrEditNav";
import LinkDrawer from "@/components/linkModal";
import Icon from "@/components/Icon";
import type {MenuProps} from 'antd';
import {useSession} from "next-auth/react";
import httpRequest from "@/utils/httpRequest";

interface IProps {
    setNavModal: (boolean) => void
}

const NavDrawer: React.FC<IProps> = ({setNavModal}) => {
    const {nav, refreshNavs} = useContext(GlobalContext)
    const [treeData, setTreeData] = useState<Nav[]>([])
    const [info, setInfo] = useState<Nav | null>(null);
    const [navModalVisible, setNavModalVisible] = useState<boolean>(false);
    const [linkDrawerVisible, setLinkDrawerVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const {data: session} = useSession();

    const generateMenuItems = (nav: Nav): MenuProps['items'] => {
        const items: MenuProps['items'] = [
            {
                label: '编辑',
                key: 'edit',
            },
            {
                label: '删除',
                key: 'del',
            }
        ]
        if (nav.navType === 1) {
            items.unshift({
                label: '链接管理',
                key: 'linkManage',
            },)
        }
        return items
    }

    useEffect(() => {
        setTreeData(generateMenu(JSON.parse(JSON.stringify(nav))))
    }, [nav])
    const generateMenu = (nav: Nav[]): Nav[] => {
        const list: Nav[] = []
        const subMenu: Nav[] = []
        const filterNav: Nav[] = nav.filter(item => item.type === (session?.user?.role === 'admin' ? 'base' : 'custom'))
        for (let i = 0; i < filterNav.length; i++) {
            const {parentId} = filterNav[i]
            parentId === '0' ? list.push(filterNav[i]) : subMenu.push(filterNav[i])
        }
        list.sort((a, b) => a.sort - b.sort)
        for (let i = 0; i < subMenu.length; i++) {
            const {parentId, ...res} = subMenu[i]
            const target: Nav = list.find(item => item.key === parentId)!
            if (!target.children) {
                target.children = []
            }
            target.children.push(subMenu[i])
        }
        list.map(item => item?.children?.sort((a, b) => a.sort - b.sort))
        return list
    }
    const handleMenuItemClick = (key: string, nav: Nav) => {
        switch (key) {
            case 'del':
                Modal.confirm({
                    title: '温馨提示',
                    content: `确定要删除${nav.label}吗？`,
                    okText: '删除',
                    cancelText: '取消',
                    onOk: () => {
                        setLoading(true)
                        httpRequest.post('/api/nav/delete', nav).then(() => {
                            refreshNavs()
                            message.success('删除成功')
                            setLoading(false)
                        }).catch(e => {
                            setLoading(false)
                        })
                    }
                })
                break
            case 'linkManage':
                setInfo(nav)
                setLinkDrawerVisible(true)
                break
            case 'edit':
                setInfo(nav)
                setNavModalVisible(true)
                break
        }
    }
    const addNav = ()=>{
        setInfo(null)
        setNavModalVisible(true)
    }
    return <Drawer
        key='navDrawer'
        title='编辑菜单'
        open={true}
        maskClosable={false}
        onClose={() => setNavModal(false)}
        className='edit-nav-drawer'
        footer={[
            <Button type='primary' key="back" onClick={() => setNavModal(false)}>
                关闭
            </Button>,
        ]}
    >
        <Spin spinning={loading}>
            <Button
                type='primary'
                icon={<Icon type='icon-tianjia'/>}
                className='add'
                onClick={addNav}
            >添加菜单</Button>
            <Tree
                className='rounded-lg border border-black-600 border-solid'
                treeData={treeData}
                fieldNames={{
                    title: 'label',
                    key: 'key',
                    children: 'children',
                }}
                titleRender={
                    (nav: Nav) => <Dropdown
                        overlay={<Menu items={generateMenuItems(nav)}
                                       onClick={(event) => handleMenuItemClick(event.key, nav)}/>}
                    >
                        <span>{nav.label}</span>
                    </Dropdown>
                }
            />
        </Spin>
        {
            navModalVisible ? <AddOrEditNav setNavModalVisible={setNavModalVisible} info={info}/> : null
        }
        {
            linkDrawerVisible ? <LinkDrawer setLinkDrawerVisible={setLinkDrawerVisible} navId={info!.key} key='linkDrawer'/> : null
        }

    </Drawer>
}


export default NavDrawer