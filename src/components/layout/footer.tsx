import React, {useEffect, useState} from 'react'
import httpRequest from "@/utils/httpRequest";
import {getPlatform} from "@/utils/common";
import dayjs from "dayjs";

export default () => {
    const [info, setInfo] = useState({total: 0, today: 0})
    useEffect(() => {
        fetchInfo()
        saveStatistics()
    }, [])
    const fetchInfo = () => {
        httpRequest.get('/api/statistics/search').then((res) => {
            setInfo(res);
        }).catch(e => {
        })
    }
    const saveStatistics = async () => {
        const now = new Date().getTime()
        const last = sessionStorage.getItem('statistics') || '0'
        if (process.env.NEXT_PUBLIC_ENV !== 'dev' && now - Number(last) > 600000) {
            const response = await fetch(`https://ip-api.com/json?lang=zh-CN`)
            const json = await response.json()
            const {country, regionName, city, query: ip} = json
            sessionStorage.setItem('statistics', new Date().getTime().toString())
            const updateAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
            httpRequest.post('/api/statistics/save', {
                platform: getPlatform(),
                country,
                regionName,
                city,
                ip,
                updateAt
            }).then((res) => {
                setInfo(res);
            }).catch(e => {
            })
        }

    }
    return <div className='py-1 text-center border-t-grey'>
        <div>Powered by <a href="https://github.com/SpectreAlan"
                           target='_blank'>SpectreAlan</a> 访客(今日/总数): {info.today} / {info.total}</div>
        <img src="https://nav-vercel.oss-cn-hongkong.aliyuncs.com/base/dance.gif" alt="dance" className='w-10'/>
    </div>
}