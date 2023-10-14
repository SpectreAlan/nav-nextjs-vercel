"use client";
import {signIn} from "next-auth/react";
import {useState} from "react";
import {Spin} from "antd";

export default () => {
    const [loading, setLoading] = useState<boolean>(false)
    const login = async () => {
        setLoading(true)
        await signIn("twitter", {callbackUrl: '/'})
    }
    return (
        <Spin spinning={loading}>
            <button
                className="mb-4 mx-auto flex rounded-md border border-[#001529] bg-white text-[#001529]  px-4 py-3 text-sm font-semibold  transition-all hover:font-bold"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={login}
            >
                <svg aria-label="Twitter" className="u01-dtc-react__twitter-logo-icon" focusable="false" height="24"
                     role="img" viewBox="0 0 1200 1227" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
                </svg>
                <div className="ml-3">Sign in with Twitter</div>
            </button>
        </Spin>);
}
