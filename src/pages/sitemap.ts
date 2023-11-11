import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://efv.cc',
            lastModified: new Date()
        },
        {
            url: 'https://efv.cc/post',
            lastModified: new Date(),
        },
        {
            url: 'https://efv.cc/clipboard',
            lastModified: new Date()
        },
    ]
}