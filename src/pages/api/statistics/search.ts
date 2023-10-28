import prisma from '@/lib/prisma';
import dayjs from "dayjs";

export default async (req, res) => {
    const total = await prisma.statistics.count()
    const today = await prisma.statistics.count({
        where: {
            updateAt: {
                contains: dayjs().format('YYYY-MM-DD')
            }
        }
    })
    return res.json({total, today});
}
