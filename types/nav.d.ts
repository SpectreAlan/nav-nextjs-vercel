interface Nav {
    authorId: string
    sort: number
    key: string
    label: string
    parentId: string
    icon?:string
}

type MenuItem = Required<MenuProps>['items'];