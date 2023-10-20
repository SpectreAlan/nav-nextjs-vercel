import {message} from 'antd'
export const copy = async (val)=> {
    const input = document.createElement('input')
    input.value = val
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
    message.success('复制成功！')
}