import React from "react";
import {getCsrfToken} from "next-auth/react";
import {Tabs, Form, Input, Button, Divider} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import Github from "@/components/Icon/github";

export default ({csrfToken}) => {
    const loginWithMail = () => {
    }
    return <Tabs
        className='w-1/5 mx-auto'
        defaultActiveKey="login"
        centered
        items={[
            {
                label: '登录',
                key: 'login',
                children: [<Form
                    className='w-4/5 mx-auto border'
                    key={'mail-form'}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{remember: true}}
                    onFinish={loginWithMail}
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        rules={[{required: true, message: 'Please input your Username!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" rev=''/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your Password!'}]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" rev=''/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" className="login-form-button">
                            Login
                        </Button>
                    </Form.Item>
                </Form>,
                    <Divider key={'mail-Divider'}>Or</Divider>,
                    <Github  key={'Github'} />
                ],

            },
            {
                label: '注册',
                key: 'signup',
                children: 'Tab 2',
            },
        ]}
    />
}

export async function getServerSideProps(context) {
    const csrfToken = await getCsrfToken(context);
    return {
        props: {csrfToken},
    };
}