import React, {useEffect, useState} from 'react'
import httpRequest from "@/utils/httpRequest";
import {getPlatform} from "@/utils/common";

export default () => {
    const [info, setInfo] = useState({total: 0, today: 0})
    useEffect(() => {
        fetchInfo()
    }, [])
    const fetchInfo = () => {
        const now = new Date().getTime()
        const last = sessionStorage.getItem('statistics') || '0'
       const save = now - Number(last) > 600000
        sessionStorage.setItem('statistics', new Date().getTime().toString())
        httpRequest.get('/api/statistics/save', {platform: getPlatform(), save}).then((res) => {
            setInfo(res);
        }).catch(e => {
        })
    }
    return <div className='py-1 text-center border-t-grey'>
        <div>Powered by <a href="https://github.com/SpectreAlan"
                           target='_blank'>SpectreAlan</a> 访客(今日/总数): {info.today} / {info.total}</div>
        <img src="https://nav-vercel.oss-cn-hongkong.aliyuncs.com/base/dance.gif" alt="dance" className='w-10'/>
    </div>
}