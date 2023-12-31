import React, {useState} from 'react';
import {Form, Modal, Input, message} from 'antd';
import {useSession} from "next-auth/react";
import httpRequest from "@/utils/httpRequest";
import {useRouter} from "next/navigation";

interface IProps {
    setPasswordModal: (key: boolean) => void
}

const UpdatePassword: React.FC<IProps> = ({setPasswordModal}) => {
    const router = useRouter();
    const {data: session} = useSession();
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
                        router.push('/auth/login')
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
                    router.push('/auth/login')
                }).catch(e => {
                    setLoading(false)
                })
            }
        })
    }
    return (
        <Modal
            width={400}
            title={hasPassword ? '修改密码' : '设置邮箱/密码'}
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
                {
                    session?.user.email ? null : <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            {
                                required: true,
                                message: '请输入邮箱',
                            },
                            () => ({
                                validator(_, value) {
                                    if (!value || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('邮箱格式不正确!'));
                                },
                            }),
                        ]}
                    >
                        <Input placeholder={'请输入邮箱'}/>
                    </Form.Item>
                }
                <Form.Item
                    name="password"
                    label="新密码"
                    tooltip="密码是数字、字母的组合，6~12位!"
                    rules={[
                        {
                            required: true,
                            message: '请输入新密码',
                        },
                        () => ({
                            validator(_, value) {
                                if (!value || /^(?=.*\d)(?=.*[a-zA-Z]).{6,12}$/.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('密码是数字、字母的组合，6~12位!'));
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder={'密码是数字、字母的组合，6~12位!'}/>
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