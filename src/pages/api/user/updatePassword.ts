import prisma from '@/lib/prisma';
import bcrypt from "bcrypt";

export default async (req, res) => {
    const {id, password, oldPassword} = req.body;
    const user = await prisma.user.findUnique({
        where: {id},
    });
    const result = await bcrypt.compare(oldPassword, user?.password)
    if (result) {
        const newHashedPassword = await bcrypt.hash(password, 10);
        const result = await prisma.user.update({
            where: {id},
            data: {
                password: newHashedPassword
            },
        });
        return  res.json({ok: !!result});
    } else {
        return res.json({ok: false, msg: '旧密码不正确'})
    }
}
