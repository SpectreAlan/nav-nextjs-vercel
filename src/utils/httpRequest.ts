import {message} from 'antd'

const BASE_URL =
    process.env.NODE_ENV == 'production' ? '' : ''

type configType = {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data: any
}

class HttpRequest {
    baseURL: string

    constructor(config: { baseURL: string }) {
        this.baseURL = config.baseURL
    }

    async request<T = any>(config: configType) {
        const {url, data, method} = config
        let fetchURL = this.baseURL + url
        const fetchConfig: RequestInit = {
            method
        }
        if (method === 'GET') {
            const queryString = new URLSearchParams(data).toString();
            fetchURL += `?${queryString}`
        } else {
            fetchConfig.headers = {'Content-Type': 'application/json'}
            fetchConfig.body = JSON.stringify(data)
        }
        const response = await fetch(fetchURL, fetchConfig)
        const {ok, statusText} = response
        if (ok) {
            return await response.json()
        }
        message.error(statusText)
        throw new Error(statusText);
    }

    get<T1 = any, T2 = any>(url: string, data?: T2) {
        return this.request<T1>({url, method: 'GET', data})
    }

    post<T1 = any, T2 = any>(url: string, data?: T2) {
        return this.request<T1>({url, method: 'POST', data})
    }
}

export default new HttpRequest({
    baseURL: BASE_URL
})
