interface InitState {
    nav: Nav[]
    globalLoading: boolean
    links: Link[]
    likes: Like[]
    refreshNavs: ()=>void
    refreshLinks: ()=>void
    refreshLikes: ()=>void
    setGlobalLoading: (boolean)=>void
}