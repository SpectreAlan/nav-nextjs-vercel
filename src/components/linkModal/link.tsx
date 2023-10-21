import React from 'react'
import {Button} from 'antd'
import httpRequest from "@/utils/httpRequest";

const Link: React.FC<{ link: Link }> = ({link}) => {
    const handleJump = () => {
        window.open(link.link)
        httpRequest.post('/api/link/update', {
            scan: link.scan + 1,
            id: link.id
        })
    }
    return <Button type='text' onClick={handleJump}>{link.link}</Button>
}

export default Link