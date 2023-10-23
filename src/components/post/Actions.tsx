import React, {useContext, useCallback} from 'react'
import Icon from '@/components/Icon'
import { Modal} from "antd";
import httpRequest from "@/utils/httpRequest";
import {GlobalContext} from "@/GlobalContext";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import Like from "@/components/LikeIcon";

const DeletePost = (post: Post) => {
    const {setGlobalLoading} = useContext(GlobalContext)
    const router = useRouter();
    const {data: session} = useSession();

    const edit = () => {
        router.push(`/post/newOrEdit?id=${post.id}`)
    }
    const detail = () => {
        router.push(`/post/${post.id}`)
    }
    const del = useCallback(() => {
        Modal.confirm({
            title: '温馨提示',
            content: `确定要删除${post.title}吗？`,
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                setGlobalLoading(true)
                httpRequest.post('/api/post/delete', post).then(() => {
                    window.location.reload()
                }).catch(() => {
                    setGlobalLoading(false)
                })
            }
        })
    }, [router])
    let action = [
        <Icon type='icon-pinglun' key="comment" title='吐槽一下' onClick={detail}/>,
        <Like target={post} type='post' />,
        <Icon type='icon-xiangqing' onClick={detail} title='查看详情'/>
    ]
    if (session?.user.role === 'admin') {
        action = [
            <Icon type='icon-bianji' onClick={edit}/>,
            <Icon type='icon-shanchu' onClick={del}/>,
            ...action
        ]
    }
    return action
}

export default DeletePost