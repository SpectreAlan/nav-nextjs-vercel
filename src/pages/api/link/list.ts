import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const {authorId, type, navId} = req.query
    const nav = { navId }
    const base = { type: 'base' }
    const user = { authorId: req.query.authorId}
    const OR:any= []
    switch (type) {
        case 'nav':
            OR.push(nav)
            break
        case 'user':
            OR.push(user)
            break
        case 'all':
            OR.push(base)
            if(authorId){
                OR.push(user)
            }
    }
    const result = await prisma.links.findMany({
        select: {
            id: true,
            link: true,
            name: true,
            desc: true,
            type: true,
            icon: true,
            hot: true,
            navId: true,
            authorId: true,
        },
        where: {
            OR
        }
    });
    return res.json(result);
}
