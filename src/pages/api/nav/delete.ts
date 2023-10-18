import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const { key } = req.body;
    const result = await prisma.nav.delete({
        where: {
            key
        },
    });
    return res.json(result);
}
