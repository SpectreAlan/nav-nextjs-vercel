import React from 'react'
import httpRequest from "@/utils/httpRequest";

const Link: React.FC<{ link: Link, title?: string }> = ({link, title}) => {
    const handleJump = () => {
        window.open(link.link)
        httpRequest.post('/api/link/update', {
            scan: link.scan + 1,
            id: link.id
        })
    }
    return <span className='cursor-pointer hover:text-blue-400' onClick={handleJump}>{title || link.link}</span>
}

export default Link