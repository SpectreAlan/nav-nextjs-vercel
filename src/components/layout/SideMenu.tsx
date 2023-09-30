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
            const {parentId, key, icon, label, sort} = nav[i]
            if (parentId === '0') {
                list.push({
                    sort,
                    key,
                    label,
                    icon: icon ? <Icon type={icon} className={'text-lg'}/> : null,
                    children: []
                })
            } else {
                subMenu.push(nav[i])
            }
        }
        list.sort((a, b) => a.sort - b.sort)
        for (let i = 0; i < subMenu.length; i++) {
            const {icon, parentId, authorId, ...res} = subMenu[i]
            const target: MenuItem = list.find(item => item.key === parentId)!
            target.children.push({
                ...res,
                icon:  icon ? <Icon type={icon} className={'text-lg'}/> : null,
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