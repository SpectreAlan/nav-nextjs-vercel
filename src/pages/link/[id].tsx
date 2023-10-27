import React from 'react';
import {Button, Descriptions, Image, Space} from 'antd';
import prisma from '@/lib/prisma';
import Copy from "@/components/Icon/copy";
import type {DescriptionsProps} from 'antd';
import Comments from "@/components/comments";
import Link from '@/components/linkModal/link'
import LikeIcon from "@/components/LikeIcon";
import Head from "next/head";

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
            label: '最后更新',
            children: link.updateAt
        },
        {
            label: '共享账号',
            children:
                link.code ? <Button
                    type={'primary'}
                    size={'small'}
                    onClick={() => {
                        window.open(`${location.origin}/clipboard?active=get&code=${link.code}`)
                    }}
                >点我获取</Button> : <span>暂无</span>
        },
        {
            label: '描述',
            span: 1,
            children: link.desc
        }
    ]
    return <>
        <Head>
            <title>{link.name}</title>
            <meta name="keywords" content={link.name}/>
            <meta name="Description" content={link.desc}/>
        </Head>
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
export const getServerSideProps = async ({params, res}) => {
    const link = await prisma.links.findUnique({
        where: {
            id: String(params?.id),
        }
    });
    if (!link) {
        res.writeHead(302, {Location: '/'});
        res.end();
    }
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