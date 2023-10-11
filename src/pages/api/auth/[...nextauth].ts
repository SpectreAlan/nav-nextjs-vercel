import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
};
const authHandler: NextApiHandler = (req, res) => {
    return NextAuth(req, res, authOptions);
}

export default authHandler;
