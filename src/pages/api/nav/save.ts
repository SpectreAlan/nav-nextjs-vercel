import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const { parentId, label, sort, icon, type, authorId, navType } = req.body;
    const result = await prisma.nav.create({
        data: {
            navType,
            authorId,
            type,
            parentId,
            label,
            sort,
            icon
        },
    });
    return res.json(result);
}
