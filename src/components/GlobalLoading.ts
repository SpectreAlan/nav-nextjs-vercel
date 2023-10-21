import {useRouter} from "next/router";
import {useContext, useEffect} from "react";
import {GlobalContext} from "@/GlobalContext";

export default ()=>{
    const router = useRouter()
    const {setGlobalLoading} = useContext(GlobalContext)
    useEffect(() => {
        const handleStart = () => {
            setGlobalLoading(true)
        }

        const handleStop = () => {
            setGlobalLoading(false)
        }

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleStop)
        router.events.on('routeChangeError', handleStop)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleStop)
            router.events.off('routeChangeError', handleStop)
        }
    }, [router])
    return null
}