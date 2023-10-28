import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const region = await fetch(`http://ip-api.com/json/${req.connection.remoteAddress}?lang=zh-CN`)
    return res.json(region);
}
