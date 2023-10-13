import React, {useContext, useEffect, useState} from 'react'
import {Modal, Button, TreeSelect} from 'antd'
import {GlobalContext} from '@/GlobalContext'
import type { DefaultOptionType } from 'antd/es/select';
interface IProps {
    setLinkModal: (boolean)=>void
    info?: any
}
const AddOrEditLink:React.FC<IProps> = ({setLinkModal, info})=>{
    const {nav} = useContext(GlobalContext)
    const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([])
    const [value, setValue] = useState<string>();

    useEffect(()=>{
        setTreeData(generateMenu())
    }, [nav])
    const generateMenu = (): Omit<DefaultOptionType, 'label'>[] => {
        const list: Omit<DefaultOptionType, 'label'>[] = []
        const subMenu: Omit<DefaultOptionType, 'label'>[] = []
        for (let i = 0; i < nav.length; i++) {
            const {parentId, key:value, label:title,} = nav[i]
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
            if(!target.children){
                target.children = []
            }
            target.children.push(subMenu[i])
        }
        return list
    }
    const handleOk = async ()=>{
    }

    return <Modal
        title={info?.id ? '编辑链接' : '添加链接'}
        open={true}
        onOk={handleOk}
        maskClosable={false}
        onCancel={()=>setLinkModal(false)}
        footer={[
            <Button key="back" onClick={handleOk}>
                保存
            </Button>,
        ]}
    >
        <TreeSelect
            style={{ width: '100%' }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="Please select"
            treeDefaultExpandAll
            onChange={(e)=>setValue(e)}
        />
    </Modal>
}


export default AddOrEditLink