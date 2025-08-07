import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    rights: string[];
    name: string;
    surname: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    _id: string;
    rights: string[];
    name: string;
    surname: string;
  }
}