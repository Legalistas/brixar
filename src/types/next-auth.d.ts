import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
    };

    accessToken?: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
  }

  interface Profile {
    userId: string;
    picture: string;
  }
}
