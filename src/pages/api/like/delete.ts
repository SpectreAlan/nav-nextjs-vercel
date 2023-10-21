import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const { id } = req.body;
    const result = await prisma.like.delete({
        where: {
            id
        },
    });
    return res.json(result);
}
