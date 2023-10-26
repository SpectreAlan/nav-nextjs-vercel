import React, {useContext} from 'react'
import {GlobalContext} from "@/GlobalContext";

export default () => {
    const {globalLoading} = useContext(GlobalContext)
    return globalLoading ? <div className="w-full h-screen text-center fixed top-0 left-0 global-loading">
        <div className="loading" />
        <img
            src='https://nav-vercel.oss-cn-hongkong.aliyuncs.com/base/loading.gif'
            alt="loading"
        />
    </div> : null
}