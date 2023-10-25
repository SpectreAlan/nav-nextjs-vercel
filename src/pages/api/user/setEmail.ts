import prisma from '@/lib/prisma';
import bcrypt from "bcrypt";
export default async (req, res)=> {
    const { id, email } = req.body;
    const result = await prisma.user.update({
        where: { id },
        data: {
            email
        },
    });
    return res.json(result);
}
