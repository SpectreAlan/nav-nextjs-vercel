interface InitState {
    nav: Nav[]
    globalLoading: boolean
    links: Link[]
    refreshNavs: ()=>void
    refreshLinks: ()=>void
}