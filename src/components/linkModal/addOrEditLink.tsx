import React, {useContext, useEffect, useState} from 'react'
import {Modal, Button, TreeSelect, Form, Input, Radio, message, Spin} from 'antd'
import {GlobalContext} from '@/GlobalContext'
import type {DefaultOptionType} from 'antd/es/select';
import httpRequest from "@/utils/httpRequest";
import {useSession} from "next-auth/react";
import UploadAliOSS from "@/components/Upload";
import dayjs from "dayjs";

interface IProps {
    setLinkModalVisible: (boolean) => void
    refreshLinks: () => void
    info: Link | null
    navId: string
}

const AddOrEditLink: React.FC<IProps> = ({setLinkModalVisible, info, navId, refreshLinks}) => {
    const {data: session} = useSession();
    const {nav} = useContext(GlobalContext)
    const [loading, setLoading] = useState<boolean>(false)
    const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([])
    const [form] = Form.useForm();

    useEffect(() => {
        queryInfo()
        setTreeData(generateMenu(JSON.parse(JSON.stringify(nav))))
    }, [])

    const queryInfo = () => {
        if (!info?.id) {
            return
        }
        setLoading(true)
        httpRequest.get('/api/link/search', {
            id: info.id,
        }).then((res) => {
            const {link, name, desc, icon, userName, password, hot, navId, code} = res
            form.setFieldsValue({link, name, desc, icon, userName, password, hot, navId, code})
            setLoading(false)
        }).catch(e => {
            setLoading(false)
        })
    }
    const generateMenu = (nav: Nav[]): Nav[] => {
        const list: Nav[] = []
        const subMenu: Nav[] = []
        for (let i = 0; i < nav.length; i++) {
            const target = {...nav[i], disabled: nav[i].navType === 0}
            target.parentId === '0' ? list.push(target) : subMenu.push(target)
        }
        list.sort((a, b) => a.sort - b.sort)
        for (let i = 0; i < subMenu.length; i++) {
            const target: Nav = list.find(item => item.key === subMenu[i].parentId)!
            if (!target.children) {
                target.children = []
            }
            target.children.push(subMenu[i])
        }
        list.map(item => item?.children?.sort((a, b) => a.sort - b.sort))
        return list
    }
    const handleOk = async () => {
        form.validateFields().then(async (values) => {
            setLoading(true)
            const updateAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
            if (info?.id) {
                httpRequest.post('/api/link/update', {
                    ...values,
                    updateAt,
                    id: info?.id,
                }).then(() => {
                    refreshLinks()
                    message.success('编辑成功')
                    setLoading(false)
                    setLinkModalVisible(false)
                }).catch(e => {
                    setLoading(false)
                })
                return
            }
            const type = session?.user?.role === 'admin' ? 'base' : 'custom'
            httpRequest.post('/api/link/save', {
                ...values,
                updateAt,
                type,
                authorId: session?.user?.id
            }).then(() => {
                refreshLinks()
                message.success('添加成功')
                setLoading(false)
                setLinkModalVisible(false)
            }).catch(e => {
                setLoading(false)
            })
        })
    }
    const setUrl = (icon: string) => {
        form.setFieldsValue({icon})
    }

    return <Modal
        title={info?.id ? '编辑链接' : '添加链接'}
        open={true}
        onOk={handleOk}
        maskClosable={false}
        onCancel={() => setLinkModalVisible(false)}
        footer={[
            <Button type={'primary'} onClick={handleOk} loading={loading}>
                保存
            </Button>,
        ]}
    >
        <Spin spinning={loading}>
            <Form
                form={form}
                labelCol={{span: 6}}
                wrapperCol={{span: 16}}
                initialValues={{hot: false, navId}}
            >
                <Form.Item name="name" label="名称" rules={[{required: true, message: '名称不能为空'}]}>
                    <Input placeholder='请输入名称'/>
                </Form.Item>

                <Form.Item name="navId" label="链接分类" rules={[{required: true, message: '链接分类不能为空'}]}>
                    <TreeSelect
                        fieldNames={{
                            value: 'key'
                        }}
                        style={{width: '100%'}}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        treeData={treeData}
                        placeholder="请选择链接分类"
                    />
                </Form.Item>
                <Form.Item
                    name="link"
                    label="链接地址"
                    rules={[
                        {
                            required: true,
                            message: '请输入链接地址',
                        },
                        () => ({
                            validator(_, value) {
                                if (!value || /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:[0-9]+)?(\/[^\s]*)?$/.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('链接格式不正确!'));
                            },
                        }),
                    ]}
                >
                    <Input placeholder='格式：https://google.com'/>
                </Form.Item>
                <Form.Item name="icon" label="网站图标" rules={[{required: true, message: '图标不能为空'}]}>
                    <UploadAliOSS setUrl={setUrl} icon={info?.icon} type='favicon'/>
                </Form.Item>
                <Form.Item name="desc" label="描述" rules={[{required: true, message: '描述不能为空'}]}>
                    <Input.TextArea placeholder='描述'/>
                </Form.Item>
                <Form.Item name="hot" label="是否热门">
                    <Radio.Group>
                        <Radio value={false}>否</Radio>
                        <Radio value={true}>是</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="code"
                    label="网站账号提取码"
                    tooltip= {`请先在 ${location.origin}/clipboard 创建`}
                >
                    <Input placeholder='请输入提取码'/>
                </Form.Item>
            </Form>
        </Spin>
    </Modal>
}


export default AddOrEditLink