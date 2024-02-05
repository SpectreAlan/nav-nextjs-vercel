import { getServerSideSitemapLegacy} from 'next-sitemap';
import { GetServerSideProps } from 'next'
import prisma from '@/lib/prisma';
import {ISitemapField} from "next-sitemap/dist/@types/interface";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const fields: ISitemapField[] = [
        {loc: `${baseUrl}`, lastmod: new Date().toISOString(), changefreq: 'always'},
        {loc: `${baseUrl}/clipboard`, lastmod: new Date().toISOString(), changefreq: 'always'}
    ];

    const links = await prisma.links.findMany({
        select: {
            id: true,
            updateAt: true
        }
    })

    links.map(link => {
        fields.push({
            loc: `${baseUrl}/link/${link.id}`, lastmod: new Date(link.updateAt).toISOString(), changefreq: 'monthly'
        })
    })

    const posts = await prisma.post.findMany({
        select: {
            id: true,
            updateAt: true
        }
    })

    posts.map(post => {
        fields.push({
            loc: `${baseUrl}/post/${post.id}`, lastmod: new Date(post.updateAt).toISOString(), changefreq: 'monthly'
        })
    })

    return getServerSideSitemapLegacy(ctx, fields)
};

export default function SitemapIndex() {}
