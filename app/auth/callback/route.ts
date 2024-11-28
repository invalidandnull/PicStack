import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    
    // 1. 创建一个异步的 cookie store
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore,
    }, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      options: {
        db: {
          schema: 'public'
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      }
    })

    // 2. 从 URL hash 中获取 access_token
    const hash = requestUrl.hash
    if (hash && hash.includes('access_token')) {
      // 3. 设置会话
      const { error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        return NextResponse.redirect(new URL('/auth/error', request.url))
      }

      // 4. 获取当前用户
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('User error:', userError)
        return NextResponse.redirect(new URL('/auth/error', request.url))
      }

      // 5. 检查用户是否已存在
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('User check error:', checkError)
        return NextResponse.redirect(new URL('/auth/error', request.url))
      }

      // 6. 如果用户不存在，创建新用户
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            credits: 5,
            subscription_status: 'inactive',
            subscription_id: null
          })

        if (insertError) {
          console.error('User creation error:', insertError)
          return NextResponse.redirect(new URL('/auth/error', request.url))
        }
      }
    }

    // 7. 重定向到仪表板
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }
} 