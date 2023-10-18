import prisma from '@/lib/prisma';

export default async (req, res) => {
    const {id, link, name, desc, icon, userName, password, hot, navId} = req.body;
    const result = await prisma.links.update({
        where: {id},
        data: {
            link, name, desc, icon, userName, password, hot, navId
        },
    });
    return res.json(result);
}
