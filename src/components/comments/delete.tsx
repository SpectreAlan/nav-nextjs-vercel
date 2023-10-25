import React, {useContext} from 'react'
import Icon from "@/components/Icon";
import {message, Modal} from "antd";
import httpRequest from "@/utils/httpRequest";
import {useSession} from "next-auth/react";
import {GlobalContext} from "@/GlobalContext";

interface IProps {
    comment: Comment
}

const DeleteComment: React.FC<IProps> = ({comment}) => {
    const {data: session} = useSession();
    const {setGlobalLoading} = useContext(GlobalContext)
    const del = () => {
        Modal.confirm({
            title: '温馨提示',
            content: `确定要删除该条评论吗？`,
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                setGlobalLoading(true)
                httpRequest.post('/api/comments/delete', comment).then(() => {
                    message.success('删除成功')
                    window.location.reload()
                }).catch(() => {
                    setGlobalLoading(false)
                })
            }
        })
    }
    return (session?.user.role === 'admin' || session?.user.id === comment.userId) ? <Icon type={'icon-shanchu'} onClick={del} title='删除评论'/> : null
}
export default DeleteComment