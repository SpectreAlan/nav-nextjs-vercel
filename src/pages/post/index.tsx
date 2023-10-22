import React from 'react'
import {Avatar, List, Empty} from 'antd';
import prisma from "@/lib/prisma";
import {useRouter} from "next/navigation";
import Actions from "@/components/post/Actions";

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
    const pagination: any = {
        position: 'bottom',
        align: 'center',
        onChange: handlePageChange,
        current: page,
        total,
        showTotal: ()=>`共 ${total} 条`,
        pageSize: 10
    }
    return <>
        <List
            pagination={pagination}
            dataSource={posts}
            renderItem={(item, index) => (
                <List.Item
                    actions={Actions(item)}
                >
                        <List.Item.Meta
                            avatar={
                                <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}/>
                            }
                            title={<a href="https://ant.design">{item.title}</a>}
                            description={item?.desc || item.content.slice(0, 40) + '...'}
                        />
                        <div>{item.updateAt}</div>

                </List.Item>
            )}
            locale={{
                emptyText: <Empty description='暂无数据'/>
            }}
        />
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