import prisma from '@/lib/prisma';
import dayjs from "dayjs";

export default async (req, res) => {
    const updateAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const {userName, userAvatar, content, relegation, replyId, replyUser, replyAvatar, userId} = req.body;
    const result = await prisma.comments.create({
        data: {
            userName, userAvatar, content, replyUser, replyId, relegation, updateAt, replyAvatar, userId
        },
    });
    return res.json(result);
}
