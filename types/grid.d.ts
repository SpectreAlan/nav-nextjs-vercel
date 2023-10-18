
interface NavGridItem {
    label: string
    key: string
    authorId: string
    navType: number
    parentId: string
    icon: JSX.Element | string | null
    sort: number
    links: Link[]
}
interface NavGrid extends NavGridItem{
    children?: NavGridItem[]
}
