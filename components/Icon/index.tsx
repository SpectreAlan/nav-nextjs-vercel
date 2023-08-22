import React from "react"

interface Props {
    className?: string
    onClick?: ()=>void
    content: string
}
const Icon: React.FC<Props> = ({className, content, onClick})=>{
    return <span className={'iconfont ' + className} onClick={onClick}>{content}</span>
}

export default Icon