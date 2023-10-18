import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '../../../lib/prisma';

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!,
            version: "2.0"
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
    jwt: {
        secret: "nav",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },
        session: async ({ session, token }) => {
            if (session?.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role
            }
            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
};
const authHandler: NextApiHandler = (req, res) => {
    // @ts-ignore
    return NextAuth(req, res, authOptions);
}

export default authHandler;
