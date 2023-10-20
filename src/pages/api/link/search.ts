import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const {id} = req.query
    const result = await prisma.links.findUnique({
        where: {
            id
        }
    });
    return res.json(result);
}
