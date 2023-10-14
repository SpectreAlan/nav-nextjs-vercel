import React, {useContext, useEffect, useState} from 'react'
import {Button, Modal, Form, Input, InputNumber, TreeSelect} from 'antd'
import {GlobalContext} from "@/GlobalContext";
import {DefaultOptionType} from "antd/es/select";
import {useSession} from "next-auth/react";
import { NextResponse } from 'next/server';

interface IProps {
    setModalVisible: (boolean) => void
    info?: Nav
}

const AddOrEditModal: React.FC<IProps> = ({setModalVisible, info}) => {
    const {data: session} = useSession();
    const [form] = Form.useForm();
    const {nav} = useContext(GlobalContext)
    const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([])

    useEffect(() => {
        setTreeData([
            {
                value: '0',
                title: '顶级目录',
                children: nav.filter(item => item.parentId === '0').map(item => ({value: item.key, title: item.label}))
            }
        ])
    }, [])

    const onFinish = () => {
        form.validateFields().then(async (values)=>{
            const type = session?.user?.role === 'admin' ? 'base' : 'custom'
            const res = await fetch('/api/nav/save', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    type,
                    authorId: session?.user?.id
                }),
            })
            console.log(res.ok);
        })
    }

    return <Modal
        className={'edit-nav-modal'}
        width={500}
        title={info?.key ? '编辑导航' : '添加导航'}
        open={true}
        maskClosable={false}
        onCancel={() => setModalVisible(false)}
        footer={[
            <Button key="back" onClick={onFinish} type='primary'> 保存 </Button>,
        ]}
    >
        <Form
            form={form}
            labelCol={{span: 6}}
            wrapperCol={{span: 16}}
        >
            <Form.Item name="label" label="名称" rules={[{required: true, message: '名称不能为空'}]}>
                <Input placeholder='请输入名称'/>
            </Form.Item>
            <Form.Item name='parentId' label='上级目录' rules={[{required: true, message: '上级目录不能为空'}]}>
                <TreeSelect
                    style={{width: '100%'}}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={treeData}
                    placeholder="请选择上级目录"
                    treeDefaultExpandAll
                />
            </Form.Item>
            <Form.Item name='sort' label='序号' rules={[{required: true, message: '序号不能为空'}]}>
                <InputNumber min={0} className={'sort'} placeholder={'请输入排序号'}/>
            </Form.Item>
        </Form>
    </Modal>
}

export default AddOrEditModal