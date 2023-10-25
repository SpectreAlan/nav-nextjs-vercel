import prisma from '@/lib/prisma';
import bcrypt from "bcrypt";
export default async (req, res)=> {
    const { id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.user.update({
        where: { id },
        data: {
            password: hashedPassword
        },
    });
    return res.json(result);
}
