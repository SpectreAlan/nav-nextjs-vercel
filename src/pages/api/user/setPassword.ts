import prisma from '@/lib/prisma';
import bcrypt from "bcrypt";

export default async (req, res) => {
    const {id, password, email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const data: any = {
        password: hashedPassword
    }
    if (email) {
        data.email = email
    }
    const result = await prisma.user.update({
        where: {id},
        data,
    });
    return res.json(result);
}
