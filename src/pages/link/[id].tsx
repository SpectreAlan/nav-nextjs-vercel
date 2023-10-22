import React from 'react';
import {Descriptions, Image, Space} from 'antd';
import prisma from '@/lib/prisma';
import Copy from "@/components/Icon/copy";
import type {DescriptionsProps} from 'antd';
import Comments from "@/components/Comments";
import Link from '@/components/linkModal/link'
import LikeIcon from "@/components/LikeIcon";

interface IProps {
    link: Link
    likes: Like[]
    comments: Comment[]
}
const LinkDetail: React.FC<IProps> = ({link, comments, likes}) => {
    let items: DescriptionsProps['items'] = [
        {
            label: '网站名称',
            children: link.name
        },
        {
            label: '链接',
            children: <Space>
                <Link link={link}/>
                <Copy title='链接' val={link.link}/>
            </Space>
        },
        {
            label: '所属分类',
            children: link.updateAt
        },
        {
            label: '最后更新',
            children: link.updateAt
        },
        {
            label: '跳转量',
            children: link.scan
        },
        {
            label: '收藏',
            children: <Space>
                <LikeIcon target={link} type='nav' refresh={() => window.location.reload()}/>
                <span>{likes.length}</span>
            </Space>
        },
        {
            label: '评论',
            children: comments.length
        },
        {
            label: '描述',
            span: 1,
            children: link.desc
        }
    ]
    if (link.userName) {
        items.splice(4, 0, {
            label: '用户名',
            children: <Space>
                <span>{link.userName}</span>
                <Copy title='用户名' val={link?.userName}/>
            </Space>
        }, {
            label: '密码',
            children: <Space>
                <span>{link.password}</span>
                <Copy title='密码' val={link?.password}/>
            </Space>
        })
    }
    return <>
        <Descriptions
            title={<Space>
                <span>{link.name}</span>
                <Image width={40} src={link.icon}/>
            </Space>}
            bordered
            items={items}
        />
        <Comments comments={comments} relegation={link.id}/>
    </>
}
export const getServerSideProps = async ({params}) => {
    const link = await prisma.links.findUnique({
        where: {
            id: String(params?.id),
        }
    });
    const comments = await prisma.comments.findMany({
        where: {
            relegation: String(params?.id),
        }
    });
    const likes = await prisma.like.findMany({
        where: {
            relegation: String(params?.id),
        }
    });
    return {
        props: {
            link,
            likes,
            comments
        },
    };
};
export default LinkDetail;