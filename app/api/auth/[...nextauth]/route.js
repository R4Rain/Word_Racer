import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      type: 'credentials',
      async authorize (credentials) {
        try{
          const {email, password} = credentials;
          const response = await fetch('http://localhost:3000/api/auth/signin', {
              method: 'POST',
              body: JSON.stringify({
                email,
                password
              })
          });
          
          const user = await response.json();
          
          if(!response.ok) {
            const { error } = user;
            throw new Error(error);
          } else if(response.ok && user){
            const { data } = user;
            return data;
          } 

          return null;
        } catch(error) {
          throw new Error(error);
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({token, user, trigger, session}) {
      if(trigger === "update") {
        return { ...token, ...session.user};
      }
      return { ...token, ...user};
    },

    async session({session, token}) {
      session.user = token;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }