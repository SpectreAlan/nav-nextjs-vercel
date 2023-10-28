import prisma from '@/lib/prisma';

export default async (req, res) => {
    const response = await prisma.statistics.create({
        data: req.body
    });
    return res.json(response);
}
