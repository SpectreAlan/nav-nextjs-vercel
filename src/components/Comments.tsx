import {Avatar, List, Input, Divider, Space, Button, Empty} from 'antd';
import React, {ReactNode, useState} from "react";
import Icon from '@/components/Icon'
import {useSession} from "next-auth/react";
import httpRequest from "@/utils/httpRequest";

interface IProps {
    comments: Comment[]
    relegation: string
}

const Comments: React.FC<IProps> = ({comments, relegation}) => {
    const {data: session} = useSession();
    const [loading, setLoading] = useState<boolean>(false)
    const [replay, setReplay] = useState<IReplay | null>(null)
    const handleSave = (content: string) => {
        if (loading) {
            return
        }
        setLoading(true)
        httpRequest.post('/api/comments/save', {
            ...replay,
            content,
            relegation,
            userName: session?.user.name,
            userAvatar: session?.user.image
        }).then((res) => {
            window.location.reload()
        }).catch(e => {
            setLoading(false)
        })
    }

    return <>
        <Divider
            children={
                <Space>
                    <Icon type='icon-pinglun'/>
                    <span>吐槽专区</span>
                </Space>
            }
            orientation='left'
        />
        {
            replay?.replyId ? null : <Input.Search
                placeholder="吐槽一下..."
                enterButton="提交"
                loading={loading}
                onSearch={handleSave}
            />
        }
        <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment, index) => (
               <>
                   <List.Item
                       key={comment.id}
                       actions={[
                           replay?.replyId === comment.id ? null :
                               <Button
                                   type={'text'}
                                   onClick={() => setReplay({
                                       replyUser: comment.userName,
                                       replyId: comment.id,
                                       replyAvatar: comment.userAvatar,
                                   })}
                                   icon={<Icon type={'icon-pinglun'}
                                   />}>回复</Button>
                       ]}
                   >
                       <List.Item.Meta
                           avatar={<Avatar src={comment.userAvatar}/>}
                           title={<Space>
                               <span className='font-bold text-black'> { comment.userName }</span>
                               {comment.replyId ? <span className='text-blue-400'>@{comment.replyUser}<Avatar src={comment.replyAvatar}/></span> : ''}
                           </Space>}
                           description={
                               <div>
                                   <p className='text-teal-800'>{comment.content}</p>
                                   <span>{comment.updateAt}</span>
                                   {
                                       replay?.replyId === comment.id ?
                                           <div className='w-full flex justify-between items-center'>
                                               <Input.Search
                                                   placeholder={`回复: ${comment.userName}`}
                                                   enterButton="提交"
                                                   loading={loading}
                                                   onSearch={handleSave}
                                               />
                                               <Button className='ml-1' type={"dashed"}
                                                       onClick={() => setReplay(null)}>取消</Button>
                                           </div> : null
                                   }
                               </div>
                           }
                       />
                   </List.Item>
               </>
            )}
            locale={{
                emptyText: <Empty description='暂无数据'/>
            }}
        />
    </>
}

export default Comments