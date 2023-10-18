import React, {useContext} from "react"
import {GlobalContext} from "@/GlobalContext";


const NavPage: React.FC = () => {
    const {nav, links} = useContext(GlobalContext)
    return (
        <div>
            <main>
                <div id="nav1" className="nav1" style={{height: '800px', background: 'white'}}>
                    nav1
                </div>
                <div id="nav2" className="nav2" style={{height: '800px', background: 'green'}}>
                    nav1
                </div>
                <div id="nav3" className="nav3" style={{height: '800px', background: 'blue'}}>
                    nav1
                </div>
            </main>
        </div>
    )
}

export default NavPage
