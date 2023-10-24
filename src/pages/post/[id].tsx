import React from 'react';
import prisma from '@/lib/prisma';
import Comments from "@/components/Comments";
import Icon from '@/components/Icon'
import LikeIcon from "@/components/LikeIcon";
import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';
import config from '@/utils/markdown.conf'
import {Space} from 'antd'
import Head  from "next/head";

interface IProps {
    post: Post
    likes: Like[]
    comments: Comment[]
}

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            hljs.configure(config.hljs)
            return hljs.highlightAuto(code).value;
        }
    })
);

const LinkDetail: React.FC<IProps> = ({post, comments, likes}) => {
    return <>
        <Head>
            <title>{post.title}</title>
            <meta name="keywords" content={process.env.NEXT_PUBLIC_META_KEYWORDS}/>
            <meta name="Description" content={post.desc}/>
        </Head>
        <h3 className='text-center font-bold mb-1 text-xl'>{post.title}</h3>
        <div className="flex justify-center space-x-4 mb-2">
            <Space>
                <Icon type={'icon-xiaoxijilu'}/>
                <span className='text-[#45474B]'>{post.updateAt}</span>
            </Space>
            <Space>
                <LikeIcon target={post} type='post' refresh={() => window.location.reload()}/>
                <span>{likes.length}</span>
            </Space>
            <Space>
                <Icon type={'icon-pinglun'}/>
                <span>{comments.length}</span>
            </Space>
        </div>
        <div className="markdown" dangerouslySetInnerHTML={{__html: marked.parse(post.content) as string}}/>
        <Comments comments={comments} relegation={post.id}/>
    </>
}

export default LinkDetail;
export const getServerSideProps = async ({params, res}) => {
    const post = await prisma.post.findUnique({
        where: {
            id: String(params?.id),
        }
    });
    if (!post) {
        res.writeHead(302, {Location: '/post'});
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
            post,
            likes,
            comments
        },
    };
};
