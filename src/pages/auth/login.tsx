import React from "react";
import {getCsrfToken} from "next-auth/react";
import {Tabs, Form, Input, Button, Divider} from 'antd';
import Github from "@/components/Icon/github";
import Google from "@/components/Icon/google";
import Icon from '@/components/Icon'

export default ({csrfToken}) => {
    const loginWithMail = () => {
    }
    return <Tabs
        className='mx-auto login-page'
        defaultActiveKey="login"
        centered
        items={[
            {
                label: '登录',
                key: 'login',
                children: [<Form
                    className={'login'}
                    key={'mail-form'}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{remember: true}}
                    onFinish={loginWithMail}
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        rules={[{required: true, message: 'Please input your Email!'}]}
                    >
                        <Input prefix={<Icon type={'icon-icon-email'}/>} placeholder="Email"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your Password!'}]}
                    >
                        <Input
                            prefix={<Icon type={'icon-tianchongxing-'}/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType="submit" className="login-form-button">
                            Login
                        </Button>
                    </Form.Item>
                </Form>,
                    <Divider key={'mail-Divider'}>OR CONTINUE WITH</Divider>,
                    <Github  key={'Github'} />,
                    <Google  key={'Google'} />
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