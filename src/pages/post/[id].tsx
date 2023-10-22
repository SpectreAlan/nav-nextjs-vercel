import React from 'react';
import prisma from '@/lib/prisma';
import Comments from "@/components/Comments";
import Icon from '@/components/Icon'
import LikeIcon from "@/components/LikeIcon";

interface IProps {
    post: Post
    likes: Like[]
    comments: Comment[]
}

const LinkDetail: React.FC<IProps> = ({post, comments, likes}) => {
    return <>
        <h3 className='text-center font-bold mb-1 text-xl'>{post.title}</h3>
        <div className="flex justify-center space-x-4 mb-2">
            <span>{post.updateAt}</span>
            <div>
                <LikeIcon target={post} type='post' refresh={() => window.location.reload()}/>
                <span>{likes.length}</span>
            </div>
            <div>
                <Icon type={'icon-pinglun'}/>
                <span>{comments.length}</span>
            </div>
        </div>
        <p>{post.content}</p>
        <Comments comments={comments} relegation={post.id}/>
    </>
}

export default LinkDetail;
export const getServerSideProps = async ({params}) => {
    const post = await prisma.post.findUnique({
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
            post,
            likes,
            comments
        },
    };
};
