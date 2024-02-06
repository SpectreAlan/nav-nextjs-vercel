import { getServerSideSitemapLegacy} from 'next-sitemap';
import { GetServerSideProps } from 'next'
import prisma from '@/lib/prisma';
import {ISitemapField} from "next-sitemap/dist/@types/interface";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const now = new Date()
    const month: number = now.getMonth() + 1
    const day: number = now.getDate()
    const lastmod = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    const fields: ISitemapField[] = [
        {loc: `${baseUrl}`, lastmod, changefreq: 'daily'},
        {loc: `${baseUrl}/clipboard`, lastmod, changefreq: 'daily'}
    ];

    const links = await prisma.links.findMany({
        select: {
            id: true,
            updateAt: true
        }
    })

    links.map(link => {
        fields.push({
            loc: `${baseUrl}/link/${link.id}`, lastmod: link.updateAt.split(' ')[0], changefreq: 'monthly'
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
            loc: `${baseUrl}/post/${post.id}`, lastmod: post.updateAt.split(' ')[0], changefreq: 'monthly'
        })
    })

    return getServerSideSitemapLegacy(ctx, fields)
};

export default function SitemapIndex() {}
