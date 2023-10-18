import React, {useContext, useEffect, useState} from 'react'
import {Button, Modal, Form, Input, InputNumber, TreeSelect, message, Radio} from 'antd'
import {GlobalContext} from "@/GlobalContext";
import {DefaultOptionType} from "antd/es/select";
import {useSession} from "next-auth/react";
import httpRequest from "@/utils/httpRequest";

interface IProps {
    setNavModalVisible: (boolean) => void
    info: Nav | null
}

const AddOrEditNav: React.FC<IProps> = ({setNavModalVisible, info}) => {
    const {data: session} = useSession();
    const [form] = Form.useForm();
    const {nav, refreshNavs} = useContext(GlobalContext)
    const [loading, setLoading] = useState<boolean>(false)
    const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([])

    useEffect(() => {
        if (info?.key) {
            const {label, type, navType, sort, parentId, icon} = info
            form.setFieldsValue({label, type, navType, sort, parentId, icon})
        }
        setTreeData([
            {
                value: '0',
                title: '顶级目录',
                children: nav.filter(item => item.parentId === '0' && item.navType === 0).sort((a, b) => a.sort - b.sort).map(item => ({
                    value: item.key,
                    title: item.label
                }))
            }
        ])
    }, [])

    const onFinish = () => {
        form.validateFields().then(async (values) => {
            setLoading(true)
            if (info?.key) {
                httpRequest.post('/api/nav/update', {
                    ...values,
                    key: info?.key,
                }).then(() => {
                    refreshNavs()
                    message.success('编辑成功')
                    setLoading(false)
                    setNavModalVisible(false)
                }).catch(e => {
                    setLoading(false)
                })
                return
            }
            const type = session?.user?.role === 'admin' ? 'base' : 'custom'
            httpRequest.post('/api/nav/save', {
                ...values,
                type,
                authorId: session?.user?.id,
                parentId: values?.parentId || '0'
            }).then(() => {
                refreshNavs()
                message.success('添加成功')
                setLoading(false)
                setNavModalVisible(false)
            }).catch(e => {
                setLoading(false)
            })
        })
    }

    return <Modal
        className={'edit-nav-modal'}
        width={500}
        title={info?.key ? '编辑导航' : '添加导航'}
        open={true}
        maskClosable={false}
        onCancel={() => setNavModalVisible(false)}
        footer={[
            <Button key="back" onClick={onFinish} type='primary' loading={loading}> 保存 </Button>,
        ]}
    >
        <Form
            form={form}
            labelCol={{span: 6}}
            wrapperCol={{span: 16}}
            initialValues={{
                navType: 0
            }}
        >
            <Form.Item name="label" label="名称" rules={[{required: true, message: '名称不能为空'}]}>
                <Input placeholder='请输入名称'/>
            </Form.Item>
            <Form.Item name="navType" label="类型" rules={[{required: true, message: '类型不能为空'}]}>
                <Radio.Group disabled={info?.key !== undefined}>
                    <Radio value={0}>目录</Radio>
                    <Radio value={1}>菜单</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.navType !== curValues.navType} noStyle>
                {({getFieldValue}) => {
                    return getFieldValue('navType') === 1 ? <Form.Item name='parentId' label='上级目录' rules={[{
                        required: true,
                        message: '上级目录不能为空'
                    }]}>
                        <TreeSelect
                            disabled={info?.key !== undefined}
                            style={{width: '100%'}}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            treeData={treeData}
                            placeholder="请选择上级目录"
                            treeDefaultExpandAll
                        />
                    </Form.Item> : null
                }}
            </Form.Item>
            <Form.Item name='sort' label='序号' rules={[{required: true, message: '序号不能为空'}]}>
                <InputNumber min={0} className={'sort'} placeholder={'请输入排序号'}/>
            </Form.Item>
        </Form>
    </Modal>
}

export default AddOrEditNav