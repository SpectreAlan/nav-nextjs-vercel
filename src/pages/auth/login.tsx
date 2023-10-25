import React, {useEffect, useState} from "react";
import {getCsrfToken, getSession, signOut, signIn, useSession} from "next-auth/react";
import {Tabs, Form, Input, Button, Divider} from 'antd';
import Github from "@/components/Icon/github";
import Google from "@/components/Icon/google";
import Twitter from "@/components/Icon/twitter";
import Icon from '@/components/Icon'
import {FormInstance} from "antd/es/form";
import {useRouter} from "next/navigation"
import {message} from "antd";

export default ({csrfToken}) => {
    const {data: session} = useSession();
    const formRef = React.useRef<FormInstance>(null);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(()=>{
        if(session?.user){
            signOut()
        }
    }, [])
    const loginWithMail = async (values) => {
        setLoading(true);
        signIn('credentials', {...values, redirect: false}).then(async (res) => {
            if (res?.error) {
                setLoading(false);
                message.error(res.error || '用户名/密码错误')
                return
            }
            router.push('/')
            await getSession()
        })
    }
    return <Tabs
        className='login-page select-none'
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
                        rules={[{required: true, message: '请输入用户名/邮箱!'}]}
                    >
                        <Input prefix={<Icon type={'icon-jurassic_user'}/>} placeholder="用户名/邮箱"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: '请输入密码!'}]}
                    >
                        <Input
                            prefix={<Icon type={'icon-tianchongxing-'}/>}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType="submit" className="w-full" loading={loading}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>,
                    <Divider key={'mail-Divider'}>OR CONTINUE WITH</Divider>,
                    <Github key={'Github'}/>,
                    <Google key={'Google'}/>,
                    <Twitter key={'Twitter'}/>
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