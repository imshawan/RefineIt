import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import axios from "axios";
import { signInUser } from "@refineit/store/authentication"
import { ApiResponse } from "@refineit/types";

const providers = [
    CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" },
            rememberMe: { label: "Remember Me", type: "checkbox" },
        },
        async authorize(credentials, req) {
            // You need to provide your own logic here that takes the credentials
            // submitted and returns either a object representing a user or value
            // that is false/null if the credentials are invalid.
            // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
            // You can also use the `req` object to obtain additional parameters
            // (i.e., the request IP address)
            try {
                const {response} = await signInUser(credentials);
                let {user, token} = response;
                return {...user, token};
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    if (error.code === "ECONNREFUSED") {
                        throw new Error("Network error, connection refused");
                    }

                    let data = error?.response?.data as ApiResponse.BaseResponse;
                    let message = data?.status?.message;
                    
                    if (data.response && data.response.message) {
                        message = data.response.message;
                    }
                    
                    throw new Error(message);
                } else {
                    throw new Error(error.message);
                }
            }
        }
    }),
];

export const authOptions = {
    providers: providers,
    jwt: {
        maxAge: 24 * 60 * 60, // 24 hours in seconds,
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: "/signin"
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user && Object.keys(user).length) {
                let _user = user as ApiResponse.ISignInUser;
                token.id = _user.id;
                token.email = _user.email;
                token.name = _user.fullname;
                token.jwtToken = _user.token;
            }

            return token;
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        }
    }
} satisfies NextAuthOptions;

export default NextAuth(authOptions);