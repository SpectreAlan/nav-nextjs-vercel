import React, { useContext, useEffect, useState} from "react"
import {GlobalContext} from "@/GlobalContext";
import Icon from "@/components/Icon";
import {Card, Divider, Image, Space } from 'antd'
import EditLink from "@/components/navModal/editLink";
import DeleteLink from "@/components/navModal/deleteLink";
import Like from "@/components/LikeIcon";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import Head  from "next/head";
import Link from '@/components/linkModal/link'

const NavPage: React.FC = () => {
    const router = useRouter();
    const {nav, links, refreshLinks, setGlobalLoading} = useContext(GlobalContext)
    const [grid, setGrid] = useState<NavGrid[]>([])
    const {data: session} = useSession();

    useEffect(() => {
        generateGrid()
    }, [nav, links])

    const generateGrid = () => {
        let gridList: NavGrid[] = [
            {
                sort: 0,
                key: 'hot',
                label: '热门推荐',
                icon: 'icon-paihangbang',
                parentId: '0',
                authorId: 'admin',
                links: links.filter(link => link.hot).sort((a:Link,b:Link)=>new Date(a.updateAt).getTime() - new Date(b.updateAt).getTime()),
                navType: 1
            }
        ]
        const list: NavGrid[] = []
        const subList: NavGrid[] = []
        const temp = JSON.parse(JSON.stringify(nav))
        temp.map(item => {
            const {parentId, key} = item
            const itemLinks: Link[] = links.filter(link => link.navId === key)
            const target: NavGrid = {...item, links: itemLinks}
            parentId === '0' ? list.push(target) : subList.push(target)
        })
        list.sort((a, b) => a.sort - b.sort)
        subList.map(sub => {
            const {parentId, authorId, ...res} = sub
            const target: NavGrid = list.find(item => item.key === parentId)!
            if (!target.children) {
                target.children = []
            }
            target.children.push(sub)
        })
        list.map(item => {
            if (item.navType) {
                gridList.push(item)
            } else {
                if (item?.children) {
                    item.children.sort((a, b) => a.sort - b.sort)
                    gridList = [...gridList, ...item.children]
                }
            }
        })
        setGrid(gridList)
    }

    const generateControls = (link: Link): JSX.Element[] => {
        let controls =
            [
                <Icon type='icon-pinglun' key="comment" title='吐槽一下' onClick={()=>router.push(`/link/${link.id}`)}/>,
                <Like target={link} type='nav'/>,
                <Icon type='icon-xiangqing' key="detail" title='链接详情' onClick={()=>router.push(`/link/${link.id}`)}/>,
            ]
        if (session?.user?.id === link.authorId) {
            controls.splice(2, 0,
                <EditLink link={link}/>,
                <DeleteLink
                    link={link}
                    setLoading={setGlobalLoading}
                    refreshLinks={refreshLinks}
                />
            )
        }
        return controls
    }
    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_META_TITLE}</title>
                <meta name="keywords" content={process.env.NEXT_PUBLIC_META_KEYWORDS}/>
                <meta name="Description" content={process.env.NEXT_PUBLIC_META_DESCRIPTION}/>
            </Head>
            {
                grid.map((item: NavGrid) =>
                    <div key={item.key} className={'nav-page select-none'} id={item.key}>
                        <Divider orientation="left" orientationMargin="0">
                            <Space>
                                {
                                    item?.icon ? <Icon type={item.icon as string} key={item.label}  className={'text-2xl'}/> : null
                                }
                                {item.label}
                            </Space>
                        </Divider>
                        <div className="flex flex-wrap">
                            {
                                item.links.length ? item.links.map(link => <Card
                                    hoverable
                                    key={link.id}
                                    className='w-[300px] mr-5 mb-5 card-bg'
                                    actions={generateControls(link)}
                                >
                                    <Card.Meta
                                        avatar={<Image width={40} src={link.icon}/>}
                                        title={<Link link={link} title={link.name}/>}
                                        description={<div className='w-full line-clamp-2 h-10'>{link.desc}</div>}
                                    />
                                </Card>) : <div><Icon type='icon-dialogue_sad'/> 暂无链接</div>
                            }
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default NavPage
