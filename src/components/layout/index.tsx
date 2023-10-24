import React, {useState, ReactNode, useContext} from 'react';
import {Layout, Button, theme, Spin} from 'antd';
import CustomHeader from './Header'
import SideMenu from './SideMenu'
import Icon from '@/components/Icon'
import {GlobalContext} from "@/GlobalContext";
import GlobalLoading from '@/components/GlobalLoading'
import {useRouter} from "next/navigation";


type Props = {
    children: ReactNode;
};

const {Header, Sider, Content} = Layout;

const App: React.FC<Props> = ({children}) => {
    const router = useRouter();
    const {globalLoading} = useContext(GlobalContext)
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Spin spinning={globalLoading}>
            <GlobalLoading/>
            <Layout>
                <Sider
                    theme={'light'}
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    className={'overflow-auto fixed left-0 top-0 bottom-0 h-screen'}
                >
                    <div className='w-full text-center align-middle'>
                        <img
                            src='https://nav-vercel.oss-cn-hongkong.aliyuncs.com/base/logo.png'
                            alt="logo"
                            onClick={() => router.push(`/`)}
                            className={'cursor-pointer w-20'}
                        />
                    </div>
                    <SideMenu theme={colorBgContainer}/>
                </Sider>
                <Layout style={{
                    paddingLeft: collapsed ? '80px' : '200px',
                }}>
                    <Header
                        className={`p-0 fixed top-0 flex items-center justify-between`}
                        style=
                            {{
                                left: collapsed ? '80px' : '200px',
                                width: `calc(100% - ${collapsed ? '80px' : '200px'})`,
                                backgroundColor: colorBgContainer
                            }}
                    >
                        <Button
                            type="text"
                            icon={collapsed ? <Icon type={'icon-zhankai'}/> : <Icon type={'icon-zhedie-shouqi'}/>}
                            onClick={() => setCollapsed(!collapsed)}
                            className={'text-xl text-white'}
                        />
                        <CustomHeader theme={colorBgContainer}/>
                    </Header>
                    <Content
                        className={'app-content'}
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Spin>
    );
};

export default App;