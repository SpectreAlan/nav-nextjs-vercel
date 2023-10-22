import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const {relegation} = req.query
    const result = await prisma.like.findMany({
        where: {
            relegation
        }
    });
    return res.json(result);
}
