import React from 'react'
import {Pagination, Empty, Card, Image, Space} from 'antd';
import prisma from "@/lib/prisma";
import {useRouter} from "next/navigation";
import Actions from "@/components/post/Actions";
import Icon from "@/components/Icon";

interface IProps {
    posts: Post[]
    page: number
    total: number
}

const Posts: React.FC<IProps> = ({posts, page, total}) => {
    const router = useRouter();

    const handlePageChange = (page) => {
        router.push(`/post/list?page=${page}`)
    }

    return <>
        <div className="flex flex-wrap">
            {
                posts.length ? posts.map(post => <Card
                    hoverable
                    key={post.id}
                    className='w-[300px] mr-5 mb-5'
                    actions={Actions(post)}
                    cover={<Image
                        src={post?.cover || 'https://nav-vercel.oss-cn-hongkong.aliyuncs.com/base/cover.png'}/>}
                >
                    <Card.Meta
                        title={<span onClick={() => router.push(`/post/${post.id}`)}>{post.title}</span>}
                        description={<div>
                            <div className='w-full line-clamp-2 h-10'>{post.desc}</div>
                            <Space>
                                <Icon type={'icon-xiaoxijilu'}/>
                                <span>{post.updateAt}</span>
                            </Space>
                        </div>}
                    />
                </Card>) : <div><Icon type='icon-dialogue_sad'/> 暂无趣集</div>
            }
        </div>
        <div className='text-center'>
            <Pagination
                onChange={handlePageChange}
                current={page}
                total={total}
                showTotal={() => `共 ${total} 条`}
                pageSize={10}
            />
        </div>
    </>
}

export default Posts

export const getServerSideProps = async ({params}) => {
    const page = params?.page || 1;
    const perPage = 10;
    const skip = (page - 1) * perPage;
    const posts = await prisma.post.findMany({
        skip: skip,
        take: perPage,
        orderBy: {
            updateAt: 'desc',
        },
    });
    const total = await prisma.post.count();
    return {
        props: {
            posts,
            page,
            total
        },
    };
};