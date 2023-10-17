import React, {useEffect, useState} from 'react'
import {Drawer, Button, Card, Spin, Modal, Space, message} from 'antd'
import AddOrEditLink from "@/components/linkModal/addOrEditLink";
import Icon from "@/components/Icon";
import httpRequest from "@/utils/httpRequest";

interface IProps {
    setLinkDrawerVisible: (boolean) => void
    navId: string
}

const LinkDrawer: React.FC<IProps> = ({setLinkDrawerVisible, navId}) => {
    const [info, setInfo] = useState<Link>();
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

    const del = (link: Link)=>{
        Modal.confirm({
            title: '温馨提示',
            content: `确定要删除${link.name}吗？`,
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                setLoading(true)
                httpRequest.post('/api/link/delete', link).then(() => {
                    queryLinks()
                    message.success('删除成功')
                    setLoading(false)
                }).catch(e => {
                    setLoading(false)
                })
            }
        })
    }

    const edit = (link: Link)=>{
        setInfo(link)
        setLinkModalVisible(true)
    }

    const add = ()=>{
        setInfo(null)
        setLinkModalVisible(true)
    }

    return <Drawer
        width={900}
        title='链接管理'
        open={true}
        maskClosable={false}
        onClose={() => setLinkDrawerVisible(false)}
        className='link-manage-drawer'
        footer={[
            <Button type='primary' key="back" onClick={() => setLinkDrawerVisible(false)}>
                关闭
            </Button>,
        ]}
    >
        <Spin spinning={loading}>
            <Button
                type='primary'
                icon={<Icon type='icon-lianjie'/>}
                className='add'
                onClick={add}
            >添加链接</Button>
            <div className="cards">
                <Space direction="vertical" size={16}>
                    {
                        links.map((link: Link) => <Card
                            title={link.name}
                            extra={<Space>
                                <Icon type={'icon-bianji'} onClick={()=>edit(link)}/>
                                <Icon type={'icon-shanchu'} onClick={()=>del(link)}/>
                        </Space>}
                            className='link-card'
                        >
                            <p>{link.link}</p>
                            <p>{link.desc}</p>
                        </Card>)
                    }
                </Space>
            </div>
        </Spin>
        {
            linkModalVisible ? <AddOrEditLink
                setLinkModalVisible={setLinkModalVisible}
                info={info}
                navId={navId}
                refreshLinks={queryLinks}
            /> : null
        }

    </Drawer>
}


export default LinkDrawer