import React, {useState} from 'react'

export default () => {
    const [info, setInfo] = useState({total: 0, today: 0})
    return <div className='py-1 text-center border-t-grey'>
        <div>Powered by SpectreAlan 访客(总数/今日): {info.today} / {info.today}</div>
        <img src="https://nav-vercel.oss-cn-hongkong.aliyuncs.com/base/dance.gif" alt="dance" className='w-10'/>
    </div>
}