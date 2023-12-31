import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const {authorId} = req.query
    const result = await prisma.like.findMany({
        where: {
            authorId
        }
    });
    return res.json(result);
}
