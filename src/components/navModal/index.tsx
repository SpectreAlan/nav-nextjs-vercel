import React, {useContext, useEffect, useState} from 'react'
import {Drawer , Button, TreeSelect} from 'antd'
import {GlobalContext} from '@/GlobalContext'
import type { DefaultOptionType } from 'antd/es/select';

interface IProps {
    setMenuModal: (boolean)=>void
}

const AddOrEditLink:React.FC<IProps> = ({setMenuModal})=>{
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
    return <Drawer
        title='编辑菜单'
        open={true}
        maskClosable={false}
        onClose={()=>setMenuModal(false)}
        footer={[
            <Button key="back" onClick={()=>setMenuModal(false)}>
                关闭
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
    </Drawer>
}


export default AddOrEditLink