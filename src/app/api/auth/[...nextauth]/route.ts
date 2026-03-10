import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          if (!user.email) {
            throw new Error("No email found from Google.");
          }

          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser) {
            dbUser = await User.create({
              name: user.name || "Google User",
              email: user.email,
              role: "student",
              emailVerified: true,
            });
          }

          // Generate our custom ad_session JWT
          const jwtSecret = process.env.JWT_SECRET;
          if (jwtSecret) {
            const token = jwt.sign(
              {
                sub: dbUser._id.toString(),
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role,
                emailVerified: dbUser.emailVerified,
              },
              jwtSecret,
              { expiresIn: COOKIE_MAX_AGE }
            );

            // Set our custom session cookie
            cookies().set("ad_session", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax", // lax for OAuth redirects
              path: "/",
              maxAge: COOKIE_MAX_AGE,
            });
          }
          return true;
        } catch (error) {
          console.error("Google login error:", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/dashboard";
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
