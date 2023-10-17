import React, {useContext, useEffect, useState} from 'react'
import {Drawer, Button, Tree, Dropdown, Spin, Menu, Modal, message} from 'antd'
import {GlobalContext} from '@/GlobalContext'
import AddOrEditModal from "@/components/navModal/addOrEditModal";
import Icon from "@/components/Icon";
import type {MenuProps} from 'antd';
import {useSession} from "next-auth/react";
import httpRequest from "@/utils/httpRequest";

interface IProps {
    setNavModal: (boolean) => void
}

const AddOrEditLink: React.FC<IProps> = ({setNavModal}) => {
    const {nav, refreshNav} = useContext(GlobalContext)
    const [treeData, setTreeData] = useState<Nav[]>([])
    const [info, setInfo] = useState<Nav>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const {data: session} = useSession();
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
    useEffect(() => {
        setTreeData(generateMenu())
    }, [nav])
    const generateMenu = (): Nav[] => {
        const list: Nav[] = []
        const subMenu: Nav[] = []
        const filterNav: Nav[] = nav.filter(item => item.type === (session?.user?.role === 'admin' ? 'base' : 'custom'))
        for (let i = 0; i < filterNav.length; i++) {
            const {parentId} = filterNav[i]
            parentId === '0' ? list.push(filterNav[i]) : subMenu.push(filterNav[i])
        }
        for (let i = 0; i < subMenu.length; i++) {
            const {parentId, ...res} = subMenu[i]
            const target: Nav = list.find(item => item.key === parentId)!
            if (!target.children) {
                target.children = []
            }
            target.children.push(subMenu[i])
        }
        return list
    }
    const handleMenuItemClick = (key: string, nav: Nav) => {
        if (key === 'del') {
            Modal.confirm({
                title: '温馨提示',
                content: `确定要删除${nav.label}吗？`,
                okText: '删除',
                cancelText: '取消',
                onOk: () => {
                    setLoading(true)
                    httpRequest.post('/api/nav/delete', nav).then(() => {
                        refreshNav()
                        message.success('删除成功')
                        setLoading(false)
                    }).catch(e => {
                        setLoading(false)
                    })
                }
            })
        } else {
            setInfo(nav)
            setModalVisible(true)
        }
    }
    return <Drawer
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
                onClick={() => setModalVisible(true)}
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
                        overlay={<Menu items={items} onClick={(event) => handleMenuItemClick(event.key, nav)}/>}
                    >
                        <span>{nav.label}</span>
                    </Dropdown>
                }
            />
        </Spin>
        {
            modalVisible ? <AddOrEditModal setModalVisible={setModalVisible} info={info}/> : null
        }

    </Drawer>
}


export default AddOrEditLink