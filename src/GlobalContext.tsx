import {createContext, useContext, useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import httpRequest from "@/utils/httpRequest";

const initState: InitState = {
    nav: [],
    likes: [],
    refreshLikes: ():void=>{},
    globalLoading: false,
    refreshNavs: (): void => {},
    links: [],
    refreshLinks: (): void => {},
    setGlobalLoading: (): void => {},
}

export const GlobalContext = createContext(initState);

export function GlobalProvider({children}) {
    const [nav, setNav] = useState<Nav[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [likes, setLikes] = useState<Like[]>([]);
    const [globalLoading, setGlobalLoading] = useState(true)
    const {data: session} = useSession();
    const refreshNavs = async () => {
        setGlobalLoading(true)
        httpRequest.get('/api/nav/list', {
            authorId: session?.user?.id || '',
            type: 'all',
        }).then(res=>{
            setNav(res);
            setGlobalLoading(false)
        }).catch(()=>setGlobalLoading(false))
    }
    const refreshLinks = async () => {
        setGlobalLoading(true)
        httpRequest.get('/api/link/list', {
            authorId: session?.user?.id || '',
            type: 'all',
        }).then(res=>{
            setLinks(res);
            setGlobalLoading(false)
        }).catch(()=>setGlobalLoading(false))
    }
    const refreshLikes = async () => {
        if(!session?.user?.id ){
            return
        }
        setGlobalLoading(true)
        httpRequest.get('/api/like/list', {
            authorId: session.user.id
        }).then(res=>{
            setLikes(res);
            setGlobalLoading(false)
        }).catch(()=>setGlobalLoading(false))
    }
    useEffect(() => {
        refreshNavs()
        refreshLinks()
        refreshLikes()
    }, [session])
    return (
        <GlobalContext.Provider value={{
            nav,
            refreshNavs,
            refreshLinks,
            links,
            globalLoading,
            setGlobalLoading,
            likes,
            refreshLikes
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    return useContext(GlobalContext);
}
