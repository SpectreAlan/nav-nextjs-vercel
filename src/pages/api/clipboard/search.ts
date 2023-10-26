import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const {code} = req.query
    const result = await prisma.clipboard.findUnique({
        where: {
            code
        }
    });
    return res.json(result);
}
