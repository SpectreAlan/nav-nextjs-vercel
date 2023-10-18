interface Nav {
    authorId: string
    sort: number
    key: string
    type: string
    navType: number
    label: string
    parentId: string
    children?: any
    icon: JSX.Element | string | null
}

type MenuItem = Required<MenuProps>['items'];