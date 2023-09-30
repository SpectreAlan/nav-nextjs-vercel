import React, {useContext, useEffect} from "react"
import {GetStaticProps} from "next"
import Post, {PostProps} from "../components/Post"
import prisma from '@/lib/prisma';
import {GlobalContext} from "@/GlobalContext";


export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.post.findMany({
        where: {published: true},
        include: {
            author: {
                select: {name: true},
            },
        },
    });
    const nav = await prisma.nav.findMany({});
    return {
        props: {feed, nav},
        revalidate: 10,
    };
};

type Props = {
    feed: PostProps[]
    nav: Nav[]
}

const Blog: React.FC<Props> = ({feed, nav}) => {
    const contextValue =  useContext(GlobalContext)

    useEffect(()=>{
        contextValue.setNav(nav)
    }, [nav])
    return (
        <div>
            <h1>Public Feed</h1>
            <main>
                {feed.map((post) => (
                    <div key={post.id} className="post">
                        <Post post={post}/>
                    </div>
                ))}
                <div id="nav1" className="nav1" style={{height: '800px', background: 'red'}}>
                    nav1
                </div>
                <div id="nav2" className="nav2" style={{height: '800px', background: 'green'}}>
                    nav1
                </div>
                <div id="nav3" className="nav3" style={{height: '800px', background: 'blue'}}>
                    nav1
                </div>
            </main>
        </div>
    )
}

export default Blog
