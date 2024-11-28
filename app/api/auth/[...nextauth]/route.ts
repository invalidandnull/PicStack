import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        // 检查用户是否存在
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('User check error:', checkError)
          return false
        }

        // 如果用户不存在，创建新用户
        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: uuidv4(),
              email: user.email,
              created_at: new Date().toISOString(),
              credits: 5,
              subscription_status: 'inactive',
              subscription_id: null,
              google_id: user.id
            })

          if (insertError) {
            console.error('User creation error:', insertError)
            return false
          }
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single()

        if (userData) {
          session.user = {
            ...session.user,
            id: userData.id
          }
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})

export { handler as GET, handler as POST } 