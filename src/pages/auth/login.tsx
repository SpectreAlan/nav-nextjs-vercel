import React, {useState} from "react";
import {getCsrfToken, useSession, getSession} from "next-auth/react";
import {Tabs, Form, Input, Button, Divider} from 'antd';
import Github from "@/components/Icon/github";
import Google from "@/components/Icon/google";
import Twitter from "@/components/Icon/twitter";
import Icon from '@/components/Icon'
import {FormInstance} from "antd/es/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"
import {message} from "antd";

export default ({csrfToken}) => {
    const formRef = React.useRef<FormInstance>(null);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false)
    const loginWithMail = async (values) => {
        setLoading(true);
        signIn('credentials', {...values,  redirect: false} ).then(async (res)=>{
            if(res?.error){
                setLoading(false);
                message.error(res.error || '用户名/密码错误')
                return
            }
            router.push('/')
            await getSession()
        })
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
                    ref={formRef}
                    className={'login'}
                    key={'mail-form'}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{csrfToken: csrfToken}}
                    onFinish={loginWithMail}
                    autoComplete="off"
                >
                    <Form.Item
                        hidden={true}
                        name="csrfToken"
                    >
                        <Input
                            type="hidden"
                            name="csrfToken"
                            value={csrfToken}
                        />
                    </Form.Item>
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
                        <Button type={'primary'} htmlType="submit" className="login-form-button" loading={loading}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>,
                    <Divider key={'mail-Divider'}>OR CONTINUE WITH</Divider>,
                    <Github  key={'Github'} />,
                    <Google  key={'Google'} />,
                    <Twitter  key={'Twitter'} />
                ],

            },
            {
                label: '注册',
                key: 'signup',
                children: 'Service is not available!',
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