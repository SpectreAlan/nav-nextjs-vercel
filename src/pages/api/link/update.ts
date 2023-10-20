import prisma from '@/lib/prisma';

export default async (req, res) => {
    const {id, link, name, desc, icon, userName, password, hot, navId, updateAt} = req.body;
    const result = await prisma.links.update({
        where: {id},
        data: {
            link, name, desc, icon, userName, password, hot, navId, updateAt
        },
    });
    return res.json(result);
}
