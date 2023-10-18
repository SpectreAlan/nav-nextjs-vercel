import React, {useContext, useEffect, useState} from 'react';
import {Menu} from 'antd';
import {GlobalContext} from '@/GlobalContext'
import Icon from '@/components/Icon'
import {
    LoadingOutlined,
} from '@ant-design/icons';

const SideMenu: React.FC = () => {
    const {nav} = useContext(GlobalContext)
    const [menu, setMenu] = useState<MenuItem[]>([])
    useEffect(() => {
        setMenu(generateMenu())
    }, [nav])

    const generateMenu = (): MenuItem[] => {
        const list: MenuItem[] = []
        const subMenu: Nav[] = []
        for (let i = 0; i < nav.length; i++) {
            const {parentId, key, icon:iconType, label, sort} = nav[i]
            // @ts-ignore
            const icon = iconType ? <Icon type={iconType} className={'text-lg'}/> : null
            if (parentId === '0') {
                list.push({
                    sort,
                    key,
                    label,
                    icon
                })
            } else {
                subMenu.push({...nav[i],icon})
            }
        }
        list.sort((a, b) => a.sort - b.sort)
        for (let i = 0; i < subMenu.length; i++) {
            const {parentId, authorId, ...res} = subMenu[i]
            const target: MenuItem = list.find(item => item.key === parentId)!
            if(!target.children){
                target.children = []
            }
            target.children.push({
                ...res
            })
        }
        return list
    }
    return (
        menu.length ?
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={menu}
        /> : <LoadingOutlined rev={'2.0'}/>
    );
};

export default SideMenu;