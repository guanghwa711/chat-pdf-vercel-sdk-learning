import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email https://www.googleapis.com/auth/gmail.readonly", // Include openid, profile, and email scopes
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      // Add user info to the token
      if (user) {
        token.id = user.id;
      }

      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to the session
      if (token) {
        // @ts-ignore
        session.accessToken = token.accessToken
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };