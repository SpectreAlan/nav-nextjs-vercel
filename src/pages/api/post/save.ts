import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const result = await prisma.post.create({
        data: req.body,
    });
    return res.json(result);
}
