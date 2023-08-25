import React, {useContext} from 'react';
import {UploadOutlined, UserOutlined, VideoCameraOutlined,} from '@ant-design/icons';
import {Menu} from 'antd';
import {GlobalContext} from '@/GlobalContext'
const SideMenu: React.FC = () => {
    const contextValue =  useContext(GlobalContext)
    console.log(contextValue.nav);
    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
                {
                    key: '1',
                    icon: <UserOutlined rev={'1.0'}/>,
                    label: 'nav 1',
                },
                {
                    key: '2',
                    icon: <VideoCameraOutlined rev={'1.0'}/>,
                    label: 'nav 2',
                },
                {
                    key: '3',
                    icon: <UploadOutlined rev={'1.0'}/>,
                    label: 'nav 3',
                },
            ]}
        />
    );
};

export default SideMenu;