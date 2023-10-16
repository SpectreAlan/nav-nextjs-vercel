import {createContext, useContext, useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import {message} from "antd";
import httpRequest from "@/utils/httpRequest";

const initState: InitState = {
    nav: [],
    setNav: (nav: Nav): void => {
    },
    refreshNav: (): void => {
    },
}

export const GlobalContext = createContext(initState);

export function GlobalProvider({children}) {
    const [nav, setNav] = useState<Nav[]>([]);
    const {data: session} = useSession();
    const refreshNav = async () => {
        httpRequest.get('/api/nav/list', {
            authorId: session?.user?.id || '',
            type: 'all',
        }).then(res=>{
            setNav(res);
        })
    }
    useEffect(() => {
        refreshNav()
    }, [session])
    return (
        <GlobalContext.Provider value={{nav, setNav, refreshNav}}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    return useContext(GlobalContext);
}
