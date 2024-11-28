import { supabase } from './supabase';

export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.user || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function upsertUserProfile(user: any) {
  if (!user?.id || !user?.email) return;
  
  try {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
        credits: 5,
        subscription_status: 'inactive',
      }, {
        onConflict: 'id',
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error upserting user profile:', error);
  }
}

export async function handleAuthCallback(code: string) {
  if (!code) return null;
  
  try {
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) throw error;
    
    if (session?.user) {
      await upsertUserProfile(session.user);
    }
    
    return session?.user || null;
  } catch (error) {
    console.error('Error handling auth callback:', error);
    return null;
  }
} 