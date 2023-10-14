"use client";
import {signIn} from "next-auth/react";
import {useState} from "react";
import {Spin} from "antd";

export default () => {
    const [loading, setLoading] = useState<boolean>(false)
    const login = async () => {
        setLoading(true)
        await signIn("google", {callbackUrl: '/'})
    }
    return (
        <Spin spinning={loading}>
            <button
                className="mb-4 mx-auto flex rounded-md border border-[#001529] bg-white text-[#001529]  px-4 py-3 text-sm font-semibold  transition-all hover:font-bold"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => signIn("google", {
                    callbackUrl: 'http://localhost:3000/'
                })}
            >
                <svg className="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="4829" width="20" height="20">
                    <path
                        d="M214.101333 512c0-32.512 5.546667-63.701333 15.36-92.928L57.173333 290.218667A491.861333 491.861333 0 0 0 4.693333 512c0 79.701333 18.858667 154.88 52.394667 221.610667l172.202667-129.066667A290.56 290.56 0 0 1 214.101333 512"
                        fill="#FBBC05" p-id="4830"></path>
                    <path
                        d="M516.693333 216.192c72.106667 0 137.258667 25.002667 188.458667 65.962667L854.101333 136.533333C763.349333 59.178667 646.997333 11.392 516.693333 11.392c-202.325333 0-376.234667 113.28-459.52 278.826667l172.373334 128.853333c39.68-118.016 152.832-202.88 287.146666-202.88"
                        fill="#EA4335" p-id="4831"></path>
                    <path
                        d="M516.693333 807.808c-134.357333 0-247.509333-84.864-287.232-202.88l-172.288 128.853333c83.242667 165.546667 257.152 278.826667 459.52 278.826667 124.842667 0 244.053333-43.392 333.568-124.757333l-163.584-123.818667c-46.122667 28.458667-104.234667 43.776-170.026666 43.776"
                        fill="#34A853" p-id="4832"></path>
                    <path
                        d="M1005.397333 512c0-29.568-4.693333-61.44-11.648-91.008H516.650667V614.4h274.602666c-13.696 65.962667-51.072 116.650667-104.533333 149.632l163.541333 123.818667c93.994667-85.418667 155.136-212.650667 155.136-375.850667"
                        fill="#4285F4" p-id="4833"></path>
                </svg>
                <div className="ml-3">Sign in with Google</div>
            </button>
        </Spin>);
}
