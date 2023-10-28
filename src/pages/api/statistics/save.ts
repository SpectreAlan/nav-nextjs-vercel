import prisma from '@/lib/prisma';
import dayjs from "dayjs";

export default async (req, res) => {
    const {save, platform} = req.query
    if (save && process.env.NEXT_PUBLIC_ENV !== 'dev') {
        const ip = req.connection.remoteAddress
        const updateAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`)
        const json = await response.json()
        const {country, regionName, city} = json
        await prisma.statistics.create({
            data: {
                country, regionName, city, updateAt, platform, ip
            },
        });
    }
    const total = await prisma.statistics.count()
    const today = await prisma.statistics.count({
        where: {
            updateAt: {
                contains: dayjs().format('YYYY-MM-DD')
            }
        }
    })
    return res.json({total, today});
}
