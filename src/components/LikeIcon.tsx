import React, {useContext} from 'react'
import Icon from "@/components/Icon";
import {GlobalContext} from "@/GlobalContext";
import httpRequest from "@/utils/httpRequest";
import {message} from "antd";
import {useSession} from "next-auth/react";

interface IProps {
    target: Link | Post
    type: string
    refresh?: ()=>void
}

const Like: React.FC<IProps> = ({target, type, refresh}) => {
    const {data: session} = useSession();
    const {likes, refreshLikes, setGlobalLoading} = useContext(GlobalContext)
    const like = likes.find(item => item.relegation === target.id)
    const handleClick = () => {
        setGlobalLoading(true)
        if (like) {
            httpRequest.post(`/api/like/delete`, {
                id: like.id,
            }).then((res) => {
                message.success('已取消点赞')
                refresh ? refresh() : refreshLikes()
            }).catch(e => {
                setGlobalLoading(false)
            })
        } else {
            if(!session?.user.id){
                message.warning('请登录后再执行该操作')
                return
            }
            httpRequest.post(`/api/like/save`, {
                relegation: target.id,
                authorId: session?.user.id,
                type,
            }).then((res) => {
                message.success('点赞成功')
                refresh ? refresh() : refreshLikes()
            }).catch(e => {
                setGlobalLoading(false)
            })
        }
    }
    return <>
        {
            like ?
                <Icon type='icon-like' key="unlike" onClick={handleClick} title='取消点赞'/> :
                <Icon type='icon-like1' key="like" onClick={handleClick} title='点赞'/>
        }

    </>
}
export default Like