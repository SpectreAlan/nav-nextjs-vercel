import React, {useContext, useEffect, useState} from 'react';
import {Button, List, message, Modal, Skeleton} from 'antd';
import httpRequest from "@/utils/httpRequest";
import {useSession} from "next-auth/react";
import Copy from "@/components/Icon/copy";
import Icon from "@/components/Icon";
import {GlobalContext} from "@/GlobalContext";

const HistoryClipboard: React.FC = () => {
    const {data: session} = useSession();
    const {setGlobalLoading, globalLoading} = useContext(GlobalContext)
    const [list, setList] = useState<Clipboard[]>([]);
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        queryList(page)
    }, []);

    const queryList = (page) => {
        if(!session?.user.id){
            return
        }
        setGlobalLoading(true);
        httpRequest.get('/api/clipboard/list', {
            authorId: session?.user.id,
            page,
        }).then((res) => {
            setList([...list, ...res.list]);
            setTotal(res.total)
            setGlobalLoading(false);
        }).catch(e => {
            setGlobalLoading(false)
        })
    }

    const onLoadMore = () => {
        const newPage = page + 1
        setPage(newPage)
        queryList(newPage)
    };

    const loadMore =
        list.length !== total ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore} type={'primary'}>加载更多</Button>
            </div>
        ) : null;
    const del = (clipboard: Clipboard) => {
        Modal.confirm({
            title: '温馨提示',
            content: `确定要删除 ${clipboard.title} 吗？`,
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                setGlobalLoading(true)
                httpRequest.post('/api/clipboard/delete', clipboard).then(() => {
                    message.success('删除成功')
                    setList([])
                    setTotal(0)
                    queryList(1)
                }).catch(() => {
                    setGlobalLoading(false)
                })
            }
        })
    }
    return <List
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(clipboard) => (
            <List.Item
                key={clipboard.id}
                actions={[
                    <Copy val={clipboard.content}/>,
                    <Icon type={'icon-shanchu'} onClick={() => del(clipboard)} title='删除剪切板'/>
                ]}
            >
                <Skeleton avatar title={false} loading={globalLoading} active>
                    <List.Item.Meta
                        title={clipboard.title}
                        description={clipboard.content.length > 30 ? clipboard.content.slice(0,30) + '...' : clipboard.content}
                    />
                    <div>提取码: <span className='text-red-400'>{clipboard.code}</span></div>
                </Skeleton>
            </List.Item>
        )}
        locale={{
            emptyText:  <div className='flex items-center justify-center'><Icon type='icon-dialogue_sad' className='text-4xl mr-2'/> 暂无剪切板</div>
        }}
    />
};

export default HistoryClipboard;