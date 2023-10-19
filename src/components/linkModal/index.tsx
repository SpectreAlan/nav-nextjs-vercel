import React, {useContext, useEffect, useState} from 'react'
import {Drawer, Button, Card, Spin, Modal, Space, message, Empty} from 'antd'
import AddOrEditLink from "@/components/linkModal/addOrEditLink";
import Icon from "@/components/Icon";
import httpRequest from "@/utils/httpRequest";
import {GlobalContext} from "@/GlobalContext";
import EditLink from "@/components/navModal/editLink";
import DeleteLink from "@/components/navModal/deleteLink";

interface IProps {
    setLinkDrawerVisible: (boolean) => void
    navId: string
}

const LinkDrawer: React.FC<IProps> = ({setLinkDrawerVisible, navId}) => {
    const {refreshLinks} = useContext(GlobalContext)
    const [info, setInfo] = useState<Link | null>(null);
    const [links, setLinks] = useState<Link[]>([]);
    const [linkModalVisible, setLinkModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        queryLinks()
    }, [])

    const queryLinks = () => {
        setLoading(true)
        httpRequest.get('/api/link/list', {
            navId,
            type: 'nav',
        }).then(res => {
            setLinks(res);
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }


    const add = () => {
        setInfo(null)
        setLinkModalVisible(true)
    }

    return <Drawer
        key='link-manage-drawer'
        width={900}
        title='链接管理'
        open={true}
        maskClosable={false}
        onClose={() => setLinkDrawerVisible(false)}
        className='link-manage-drawer'
        footer={[
            <Button type='primary' onClick={() => setLinkDrawerVisible(false)}>
                关闭
            </Button>,
        ]}
    >
        <Spin spinning={loading}>
            <Button
                type='primary'
                icon={<Icon type='icon-lianjie'/>}
                className='mb-2'
                onClick={add}
            >添加链接</Button>
            {
                links.length ? <div className="grid gap-x-8 gap-y-4 grid-cols-3">
                    {
                        links.map((link: Link) => <Card
                            key={link.id}
                            title={link.name}
                            extra={<Space>
                                <EditLink link={link}/>
                                <DeleteLink
                                    link={link}
                                    setLoading={setLoading}
                                    refreshLinks={() => {
                                        queryLinks()
                                        refreshLinks()
                                    }}
                                />
                            </Space>}
                        >
                            <p>{link.link}</p>
                            <p>{link.desc}</p>
                        </Card>)
                    }
                </div> : <Empty description='暂无数据'/>
            }
        </Spin>
        {
            linkModalVisible ? <AddOrEditLink
                setLinkModalVisible={setLinkModalVisible}
                info={info}
                navId={navId}
                refreshLinks={() => {
                    queryLinks()
                    refreshLinks()
                }}
            /> : null
        }
    </Drawer>
}


export default LinkDrawer