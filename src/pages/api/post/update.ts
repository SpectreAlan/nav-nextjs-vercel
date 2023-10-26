import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const { id, ...data } = req.body;
    const result = await prisma.post.update({
        where: { id },
        data,
    });
    return res.json(result ? {ok: true} : null);
}
