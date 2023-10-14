import React, {useContext, useEffect, useState} from 'react'
import {Drawer, Button, TreeSelect} from 'antd'
import {GlobalContext} from '@/GlobalContext'
import type {DefaultOptionType} from 'antd/es/select';
import AddOrEditModal from "@/components/navModal/addOrEditModal";
import Icon from "@/components/Icon";

interface IProps {
    setNavModal: (boolean) => void
}

const AddOrEditLink: React.FC<IProps> = ({setNavModal}) => {
    const {nav} = useContext(GlobalContext)
    const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([])
    const [value, setValue] = useState<string>();
    const [info, setInfo] = useState<Nav>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        setTreeData(generateMenu())
    }, [nav])
    const generateMenu = (): Omit<DefaultOptionType, 'label'>[] => {
        const list: Omit<DefaultOptionType, 'label'>[] = []
        const subMenu: Omit<DefaultOptionType, 'label'>[] = []
        for (let i = 0; i < nav.length; i++) {
            const {parentId, key: value, label: title,} = nav[i]
            const target = {
                parentId,
                value,
                title
            }
            parentId === '0' ? list.push({...target, disabled: true}) : subMenu.push({...target, disabled: false})
        }
        for (let i = 0; i < subMenu.length; i++) {
            const {parentId, ...res} = subMenu[i]
            const target: Omit<DefaultOptionType, 'label'> = list.find(item => item.value === parentId)!
            if (!target.children) {
                target.children = []
            }
            target.children.push(subMenu[i])
        }
        return list
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
        <Button
            type='primary'
            icon={<Icon type='icon-tianjia'/>}
            className='add'
            onClick={() => setModalVisible(true)}
        >添加菜单</Button>
        <TreeSelect
            style={{width: '100%'}}
            value={value}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            treeData={treeData}
            placeholder="Please select"
            treeDefaultExpandAll
            onChange={(e) => setValue(e)}
        />
        {
            modalVisible ? <AddOrEditModal setModalVisible={setModalVisible} info={info}/> : null
        }
    </Drawer>
}


export default AddOrEditLink