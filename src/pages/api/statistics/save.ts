import prisma from '@/lib/prisma';

export default async (req, res) => {
    if (process.env.NEXT_PUBLIC_ENV !== 'dev') {
        const responseSave = await prisma.statistics.create({
            data: req.body
        });
        return res.json(responseSave);
    }
    return res.json({});
}
