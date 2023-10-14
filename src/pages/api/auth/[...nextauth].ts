import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '../../../lib/prisma';

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials ?? {}
                const user = await prisma.user.findUnique({
                    where: {
                        email,
                        password
                    },
                });
                if (!user) {
                    return null
                }
                return user;
            },
        })
    ],
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: 'jwt'
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
};
const authHandler: NextApiHandler = (req, res) => {
    // @ts-ignore
    return NextAuth(req, res, authOptions);
}

export default authHandler;
