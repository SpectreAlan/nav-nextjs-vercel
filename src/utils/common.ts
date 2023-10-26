import {message} from 'antd'

export const copy = async (val) => {
    const input = document.createElement('input')
    input.value = val
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
    message.success('复制成功！')
}

export const getRandomCode = (num: number = 6): string => {
    let str = ``
    for (let i = 0; i < num; i++) {
        str += parseInt((Math.random() * 9).toString())
    }
    return str
}