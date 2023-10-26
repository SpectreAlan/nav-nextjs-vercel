import React, {useContext} from 'react';
import {Button, Form, Input, Radio, Alert, notification} from 'antd';
import {getRandomCode} from '@/utils/common'
import Marquee from 'react-fast-marquee';
import {useSession} from "next-auth/react";
import httpRequest from "@/utils/httpRequest";
import {GlobalContext} from "@/GlobalContext";
import dayjs from "dayjs";
import Icon from "@/components/Icon";

const setClipboard: React.FC = () => {
    const [form] = Form.useForm();
    const {data: session} = useSession();
    const {setGlobalLoading} = useContext(GlobalContext)
    const onFinish = () => {
        form.validateFields().then(async (values) => {
            setGlobalLoading(true)
            const updateAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
            httpRequest.post('/api/clipboard/save', {
                ...values,
                updateAt,
                authorId: session?.user?.id,
            }).then(() => {
                notification.open({
                    message: `温馨提示`,
                    description: <div>创建成功，请使用 <span className='text-red-400'>{values.code}</span> 提取</div>,
                    icon: <Icon type={'icon-chenggong'}/>,
                    placement: 'topRight',
                    duration: 10
                });
                setGlobalLoading(false)
                form.resetFields()
            }).catch(e => {
                setGlobalLoading(false)
            })
        })
    };

    const getCode = ()=>{
        const values = form.getFieldsValue()
        if(!values.code){
            form.setFieldsValue({code: getRandomCode()})
        }
    }
    return <div className='w-full sm:max-w-screen-md mx-auto'>
        <Alert
            banner
            type="info"
            message={
                <Marquee pauseOnHover gradient={false}>
                    一次性剪切板会在提取成功后自动删除，登录用户可以创建永久剪切板,创建成功后通过提取码获取剪切板内容
                </Marquee>
            }
        />
        <Form
            form={form}
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            initialValues={{type: 0}}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="记录类型"
                name="type"
            >
                <Radio.Group>
                    <Radio value={0}>一次性</Radio>
                    <Radio value={1} disabled={!session?.user.id}>永久</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prevValues, nextValues, info) => prevValues.type !== nextValues.type}>
                {({getFieldValue}) => {
                    return getFieldValue('type') === 1 ? <Form.Item name='title' label='标题' rules={[{
                        required: true,
                        message: '标题不能为空'
                    }]}>
                        <Input placeholder='请输入标题'/>
                    </Form.Item> : null
                }}
            </Form.Item>
            <Form.Item
                label="内容"
                name="content"
                rules={[{required: true, message: '请输入需要剪切的内容'}]}
            >
                <Input.TextArea placeholder='请输入需要剪切的内容' autoSize onInput={getCode}/>
            </Form.Item>
            <Form.Item
                label="提取码"
                name="code"
                rules={[{required: true}]}
            >
                <Input readOnly/>
            </Form.Item>
            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit">
                    创建
                </Button>
            </Form.Item>
        </Form>
    </div>
}

export default setClipboard;