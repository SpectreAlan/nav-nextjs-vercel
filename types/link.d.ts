interface Link {
    id: string
    link: string
    name: string
    desc: string
    icon?: string
    code?: string
    hot: boolean
    navId: string
    authorId: string
    updateAt: string
    scan: number
}

interface Comment {
    id: string
    userName: string
    userAvatar: string
    content: string
    updateAt: string
    userId: string
    replyUser?: string
    replyId?: string
    replyAvatar?: string
    relegation: boolean
}
interface Like {
    id: string
    authorId: string
    relegation: string
    type: string
}
interface IReplay {
    replyId: string
    replyUser: string
    replyAvatar: string
}