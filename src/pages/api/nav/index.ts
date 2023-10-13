import prisma from '@/lib/prisma';
export default async function handle(req, res) {
    const { parentId, label, sort, icon } = req.body;
    const result = await prisma.nav.create({
        data: {
            parentId,
            label,
            sort,
            icon
        },
    });
    res.json(result);
}
