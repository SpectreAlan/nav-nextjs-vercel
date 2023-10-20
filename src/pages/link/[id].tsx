import React from 'react';
import { Descriptions } from 'antd';
import prisma from '@/lib/prisma';
export const getServerSideProps = async ({ params }) => {
    const link = await prisma.links.findUnique({
        where: {
            id: String(params?.id),
        }
    });
    return {
        props: link,
    };
};

const LinkDetail: React.FC<{link: Link}> = ({link }) => {
    return <Descriptions
        title="Responsive Descriptions"
        bordered
        column={{xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4}}
        items={[
            {
                label: '网站名称',
                span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
                children: link.name
            }
        ]}
    />
}

export default LinkDetail;