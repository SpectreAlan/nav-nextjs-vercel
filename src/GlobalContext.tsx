import {createContext, useContext, useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import httpRequest from "@/utils/httpRequest";

const initState: InitState = {
    nav: [],
    refreshNavs: (): void => {},
    links: [],
    refreshLinks: (): void => {},
}

export const GlobalContext = createContext(initState);

export function GlobalProvider({children}) {
    const [nav, setNav] = useState<Nav[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const {data: session} = useSession();
    const refreshNavs = async () => {
        httpRequest.get('/api/nav/list', {
            authorId: session?.user?.id || '',
            type: 'all',
        }).then(res=>{
            setNav(res);
        })
    }
    const refreshLinks = async () => {
        httpRequest.get('/api/link/list', {
            authorId: session?.user?.id || '',
            type: 'all',
        }).then(res=>{
            setLinks(res);
        })
    }
    useEffect(() => {
        refreshNavs()
        refreshLinks()
    }, [session])
    return (
        <GlobalContext.Provider value={{nav, refreshNavs, refreshLinks, links}}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    return useContext(GlobalContext);
}
