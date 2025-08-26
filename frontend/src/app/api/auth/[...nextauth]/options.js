import CredentialsProvider from 'next-auth/providers/credentials';
import { randomBytes } from 'crypto';

export const options = {
  providers: [CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: {
        label: 'Email:',
        type: 'text',
        placeholder: 'Enter your email'
      },
      password: {
        label: 'Password',
        type: 'password'
      }
    },
    async authorize(credentials, req) {
      try {
        // Call backend API for authentication
        const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await response.json();

        if (data.success && data.data) {
          // Return user data in the format NextAuth expects
          return {
            id: data.data.user._id,
            email: data.data.user.email,
            name: `${data.data.user.firstName} ${data.data.user.lastName}`,
            firstName: data.data.user.firstName,
            lastName: data.data.user.lastName,
            role: data.data.user.role,
            token: data.data.token,
            isEmailVerified: data.data.user.isEmailVerified,
            isActive: data.data.user.isActive,
          };
        } else {
          throw new Error(data.message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        throw new Error('Email or Password is not valid');
      }
    }
  })],
  // Use environment variable or fallback to a secure random string
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here-change-in-production',
  // Add JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here-change-in-production',
  },
  pages: {
    signIn: '/auth/sign-in'
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
      email,
      credentials
    }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isEmailVerified = user.isEmailVerified;
        token.isActive = user.isActive;
        token.backendToken = user.token; // Store the backend JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.isActive = token.isActive;
        session.backendToken = token.backendToken; // Include backend token in session
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    generateSessionToken: () => {
      return randomBytes(32).toString('hex');
    }
  },
  // Add debug for development
  debug: process.env.NODE_ENV === 'development',
};