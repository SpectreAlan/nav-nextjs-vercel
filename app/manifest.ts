import {MetadataRoute} from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '趣导航',
        short_name: '趣导航',
        description: '一个有趣的导航站，关注不迷路',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}