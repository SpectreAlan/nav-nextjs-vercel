import React, {useState} from 'react';
import {Form, Modal, Input, message} from 'antd';
import {useSession, signOut} from "next-auth/react";
import httpRequest from "@/utils/httpRequest";

interface IProps {
    setPasswordModal: (key: boolean) => void
}

const UpdatePassword: React.FC<IProps> = ({setPasswordModal}) => {
    const {data: session, status} = useSession();
    const [form] = Form.useForm();
    const hasPassword = session?.user.password
    const [loading, setLoading] = useState<boolean>(false)
    const handleOk = () => {
        form.validateFields().then((values) => {
            setLoading(true)
            const data = {
                ...values,
                id: session?.user.id,
            }
            if (hasPassword) {
                httpRequest.post('/api/user/updatePassword', data).then(async (res) => {
                    if (res.ok) {
                        setPasswordModal(false)
                        message.success('修改成功,请重新登录')
                        await signOut()
                    } else {
                        message.error(res.msg)
                    }

                    setLoading(false)
                }).catch(e => {
                    setLoading(false)
                })
            } else {
                httpRequest.post('/api/user/setPassword', data).then(async (res) => {
                    setLoading(false)
                    setPasswordModal(false)
                    message.success('设置成功,请重新登录')
                    await signOut()
                }).catch(e => {
                    setLoading(false)
                })
            }
        })
    }
    return (
        <Modal
            width={400}
            title={hasPassword ? '修改密码' : '设置密码'}
            open={true}
            onOk={handleOk}
            onCancel={() => setPasswordModal(false)}
            okText={'保存'}
            cancelText={'取消'}
            okButtonProps={{loading}}
        >
            <Form
                labelCol={{span: 6}}
                form={form}
                scrollToFirstError
            >
                {
                    hasPassword ? <Form.Item
                        name="oldPassword"
                        label="原密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入你的原密码!',
                            },
                        ]}
                    >
                        <Input.Password placeholder={'请输入你的原密码'}/>
                    </Form.Item> : null
                }

                <Form.Item
                    name="password"
                    label="新密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的新密码!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder={'请输入你的新密码'}/>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请输入确认密码!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不匹配!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder={'请输入确认密码'}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdatePassword;