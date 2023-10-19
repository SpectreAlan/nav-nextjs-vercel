import React, {useContext, useEffect, useState} from 'react';
import {Menu} from 'antd';
import {GlobalContext} from '@/GlobalContext'
import Icon from '@/components/Icon'
import type {MenuProps} from 'antd';

const SideMenu: React.FC = () => {
    const {nav} = useContext(GlobalContext)
    const [menu, setMenu] = useState<MenuItem[]>([])
    const [active, setActive] = useState<string>('hot');
    useEffect(() => {
        setMenu(generateMenu())
    }, [nav])

    const generateMenu = (): MenuItem[] => {
        const list: MenuItem[] = [
            {
                sort: 0,
                key: 'hot',
                label: '热门推荐',
                icon: <Icon type={'icon-paihangbang'}/>
            }
        ]
        const subMenu: MenuItem[] = []
        for (let i = 0; i < nav.length; i++) {
            const {parentId, key, icon: iconType, label, sort, authorId} = nav[i]
            // @ts-ignore
            const icon = iconType ? <Icon type={iconType} className={'text-lg'}/> : null
            const target: MenuItem = {sort, key, label, icon}
            parentId === '0' ? list.push(target) : subMenu.push({...target, parentId, authorId})
        }
        list.sort((a, b) => a.sort - b.sort)
        for (let i = 0; i < subMenu.length; i++) {
            const {parentId, authorId, ...res} = subMenu[i]
            const target: MenuItem = list.find(item => item.key === parentId)!
            if (!target.children) {
                target.children = []
            }
            target.children.push(res)
        }
        list.map(item => item?.children?.sort((a, b) => a.sort - b.sort))
        return list
    }

    const handleClick: MenuProps['onClick'] = (e) => {
        const key = e.key
        setActive(key)
        document.getElementById(key)?.scrollIntoView({behavior: 'smooth'})
    };
    return <Menu
        selectedKeys={[active]}
        theme="dark"
        mode="inline"
        items={menu}
        onClick={handleClick}
    />
};

export default SideMenu;