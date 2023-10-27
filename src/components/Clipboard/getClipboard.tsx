import React, {useEffect, useState} from 'react';
import {Input, Alert, Button, message} from 'antd';
import httpRequest from "@/utils/httpRequest";
import Copy from "@/components/Icon/copy";

const getClipboard: React.FC<{code: string}> = ({code}) => {
    const [loading, setLoading] = useState(false)
    const [clipboard, setClipboard] = useState<Clipboard | null>(null)
    const [value, setValue] = useState('')
    useEffect(()=>{
        if(code){
            setValue(code)
            onSearch(code)
        }
    }, [])
    const onSearch = (code) => {
        if (!/^\d{6}$/.test(code)) {
            message.error('提取码为6为数字')
            return
        }
        setLoading(true)
        httpRequest.get('/api/clipboard/search', {
            code
        }).then((res) => {
            setLoading(false)
            setClipboard(res)
            if (res?.type === 0) {
                del(res)
            }
            if (!res) {
                message.warning('内容不存在，请检查提取码是否正确')
            }
        }).catch(e => {
            setLoading(false)
        })
    };
    const del = (clipboard) => {
        httpRequest.post('/api/clipboard/delete', clipboard).then((res) => {
        }).catch(e => {
        })
    }
    return <div className='w-full sm:max-w-screen-md mx-auto'>
        <Input.Search
            addonBefore="提取码:"
            placeholder="请输入提取码"
            allowClear
            onSearch={onSearch}
            loading={loading}
            enterButton="提取"
            className='mb-4'
            value={value}
            onChange={e=>setValue(e.target.value)}
        />
        {
            clipboard ? <Alert
                message={clipboard.content}
                type="success"
                action={
                    <Copy val={clipboard.content}/>
                }
            /> : null
        }
    </div>
}

export default getClipboard;