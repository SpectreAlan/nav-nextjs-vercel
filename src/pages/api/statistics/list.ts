import prisma from '@/lib/prisma';
export default async (req, res)=> {
    const {authorId, type} = req.query
    const base = { type: 'base' }
    const user = { authorId: req.query.authorId}
    const OR:any= []
    switch (type) {
        case 'base':
            OR.push(base)
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
    const result = await prisma.nav.findMany({
        where: {
            OR
        }
    });
    return res.json(result);
}
