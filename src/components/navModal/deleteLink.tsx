import React from 'react'
import Icon from "@/components/Icon";
import {message, Modal} from "antd";
import httpRequest from "@/utils/httpRequest";
interface IProps {
    link: Link
    refreshLinks: () => void
    setLoading: (boolean) => void
}

const DeleteLink:React.FC<IProps> = ({link,refreshLinks, setLoading})=>{
    const del = () => {
        Modal.confirm({
            title: '温馨提示',
            content: `确定要删除${link.name}吗？`,
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                setLoading(true)
                httpRequest.post('/api/link/delete', link).then(() => {
                    refreshLinks()
                    message.success('删除成功')
                }).catch(() => {
                    setLoading(false)
                })
            }
        })
    }
    return <>
        <Icon type={'icon-shanchu'} onClick={del} title='删除链接'/>
    </>
}
export default DeleteLink