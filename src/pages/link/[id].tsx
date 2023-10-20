import React from 'react';
import {Descriptions, Image, Space, Avatar, List} from 'antd';
import prisma from '@/lib/prisma';
import Copy from "@/components/Icon/copy";
import type {DescriptionsProps} from 'antd';

interface IProps {
    link: Link
    comments: Comment[]
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
    return {
        props: {
            link,
            comments
        },
    };
};

const LinkDetail: React.FC<IProps> = ({link, comments}) => {
    let items: DescriptionsProps['items'] = [
        {
            label: '网站名称',
            span: {xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2},
            children: link.name
        },
        {
            label: '链接',
            span: {xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2},
            children: <Space>
                <a href={link.link} target='_blank'>{link.link}</a>
                <Copy title='链接' val={link.link}/>
            </Space>
        },
        {
            label: '最后更新',
            span: {xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2},
            children: link.updateAt
        },
        {
            label: '跳转量',
            span: {xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2},
            children: link.scan
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
            span: {xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2},
            children: <Space>
                <span>{link.userName}</span>
                <Copy title='用户名' val={link?.userName}/>
            </Space>
        }, {
            label: '密码',
            span: {xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2},
            children: <Space>
                <span>{link.password}</span>
                <Copy title='密码' val={link?.password}/>
            </Space>
        })
    }
    return <>
        <Descriptions
            title={<Image width={60} src={link.icon}/>}
            bordered
            column={{xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4}}
            items={items}
        />
        <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={item.userAvatar}/>}
                        title={item.userName}
                        description={
                            <div>
                                <p>{item.content}</p>
                                <span>{item.updateAt}</span>
                            </div>
                        }
                    />
                </List.Item>
            )}
        />
    </>
}

export default LinkDetail;