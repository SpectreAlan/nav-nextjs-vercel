interface Nav {
    authorId: string
    sort: number
    key: string
    label: string
    parentId: string
    icon: JSX.Element | string | null
}

type MenuItem = Required<MenuProps>['items'];