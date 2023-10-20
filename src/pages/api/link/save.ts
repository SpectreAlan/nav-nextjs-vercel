import prisma from '@/lib/prisma';

export default async (req, res) => {
    const {link, name, desc, icon, userName, password, hot, navId, type, authorId, updateAt} = req.body;
    const result = await prisma.links.create({
        data: {
            link, name, desc, icon, userName, password, hot, navId, type, authorId, updateAt
        },
    });
    return res.json(result);
}
