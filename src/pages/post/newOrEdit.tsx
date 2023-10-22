import React, {useContext} from 'react'
import prisma from "@/lib/prisma";
import {Form, Input, Button, Radio, message} from 'antd';
import UploadAliOSS from "@/components/Upload";
import httpRequest from "@/utils/httpRequest";
import dayjs from "dayjs";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {GlobalContext} from "@/GlobalContext";

interface IProps {
    post: Post | null
}

const NewOrEditPost: React.FC<IProps> = ({post}) => {
    const {data: session} = useSession();
    const router = useRouter();
    const [form] = Form.useForm();
    const {setGlobalLoading} = useContext(GlobalContext)
    const onFinish = async (values) => {
        if(session?.user.role !== 'admin'){
            router.push('/post')
        }
        const updateAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
        setGlobalLoading(true)
        if (post) {
            httpRequest.post('/api/post/update', {
                ...values,
                id: post.id,
                updateAt
            }).then(() => {
                router.push('/post')
                message.success('编辑成功')
            }).catch(e => {
                setGlobalLoading(false)
            })
            return
        }
        httpRequest.post('/api/post/save', {
            ...values,
            updateAt,
            authorId: session?.user?.id
        }).then(() => {
            router.push('/post')
            message.success('添加成功')
        }).catch(e => {
            setGlobalLoading(false)
        })
    }
    const setUrl = (icon: string) => {
        form.setFieldsValue({icon})
    }
    return <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={post || {status: 1}}
    >
        <Form.Item
            label="标题"
            name="title"
            rules={[{required: true, message: '标题不能为空'}]}
        >
            <Input placeholder='请输入标题'/>
        </Form.Item>
        <Form.Item
            label="简介"
            name="desc"
        >
            <Input placeholder='请输入简介'/>
        </Form.Item>
        <Form.Item
            label="状态"
            name="status"
            rules={[{required: true}]}
        >
            <Radio.Group>
                <Radio value={1}>所有人可见</Radio>
                <Radio value={0}>管理员可见</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item
            label="封面"
            name="cover"
        >
            <UploadAliOSS setUrl={setUrl} icon={post?.cover} type='post'/>
        </Form.Item>
        <Form.Item
            label="内容"
            name="content"
            rules={[{required: true, message: '请输入内容'}]}
        >
            <Input.TextArea placeholder='请输入内容' autoSize/>
        </Form.Item>
        <Form.Item className='flex justify-center'>
            <Button type="default" className='mr-5'>取消</Button>
            <Button type="primary" htmlType="submit">保存</Button>
        </Form.Item>
    </Form>

}
export default NewOrEditPost

export async function getServerSideProps({query}) {
    const id = query?.id;
    if (id) {
        const post = await prisma.post.findUnique({
            where: {id},
        });
        return {props: {post}};
    }
    return {props: {}};
}