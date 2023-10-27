import prisma from '@/lib/prisma';

export default async (req, res) => {
    const {authorId, page} = req.query
    const perPage = 10;
    const skip = (page - 1) * perPage;
    const list = await prisma.clipboard.findMany({
        skip: skip,
        take: perPage,
        orderBy: {
            updateAt: 'desc',
        },
        where: {authorId}
    });
    const total = await prisma.clipboard.count({
        where: {authorId}
    });
    return res.json({list, total});
}
