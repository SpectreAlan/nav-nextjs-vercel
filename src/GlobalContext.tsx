import {createContext, useContext, useState} from 'react';

const initState:InitState = {
    nav: [],
    setNav: (nav:Nav):void=>{}
}

export const GlobalContext = createContext(initState);

export function GlobalProvider({children}) {
    const [nav, setNav] = useState<Nav[]>([]);
    return (
        <GlobalContext.Provider value={{nav, setNav}}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    return useContext(GlobalContext);
}
