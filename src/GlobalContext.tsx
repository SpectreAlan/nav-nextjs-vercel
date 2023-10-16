import {createContext, useContext, useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import {message} from "antd";

const initState:InitState = {
    nav: [],
    setNav: (nav:Nav):void=>{},
    refreshNav: ():void=>{},
}

export const GlobalContext = createContext(initState);

export function GlobalProvider({children}) {
    const [nav, setNav] = useState<Nav[]>([]);
    const {data: session} = useSession();
    const refreshNav = async ()=>{
        const queryParams = {
            authorId: session?.user?.id || '',
            type: 'all',
        };

        const queryString = new URLSearchParams(queryParams).toString();
        const response:Response = await fetch(`/api/nav/list?${queryString}`, {
            method: "GET",
        })
        const {statusText, ok} = response
        if(ok){
            response.json().then(res=>{
                setNav(res);
            })
        }else{
            message.error(statusText)
        }
    }
    useEffect(()=>{
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
