interface Link {
    id: string
    link: string
    name: string
    desc: string
    icon?: string
    userName?: string
    password?: string
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
    replyUser?: string
    replyId?: string
    replyAvatar?: string
    relegation: boolean
}

interface IReplay {
    replyId: string
    replyUser: string
    replyAvatar: string
}