import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const { key,  label, sort, icon, } = req.body;
    const result = await prisma.nav.update({
        where: { key },
        data: {
            label,
            sort,
            icon
        },
    });
    return res.json(result ? {ok: true} : null);
}
