import React, {useState} from 'react'

export default () => {
    const [info, setInfo] = useState({total: 0, today: 0})
    return <div className='py-1 text-center border-t-grey'>
        <div>Powered by <a href="https://github.com/SpectreAlan" target='_blank'>SpectreAlan</a> 访客(今日/总数): {info.today} / {info.total}</div>
        <img src="https://nav-vercel.oss-cn-hongkong.aliyuncs.com/base/dance.gif" alt="dance" className='w-10'/>
    </div>
}