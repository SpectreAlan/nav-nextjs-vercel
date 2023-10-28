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

export const getPlatform = (): string => {
    const ua = navigator.userAgent
    if (/(Android)/i.test(ua)) {
        return 'Android'
    } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
        return 'iPhone'
    } else { // @ts-ignore
        if (ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
            return 'wechat'
        } else {
            return 'pc'
        }
    }

}