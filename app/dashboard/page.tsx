'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { Database } from '@/app/types/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
type UserProfile = Database['public']['Tables']['users']['Row'];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageHistory, setUsageHistory] = useState<any[]>([]); // 根据需要定义具体类型
  const { data: session, status } = useSession()

  console.log(session?.user?.id)
  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/');
      return;
    }

    async function loadUserProfile() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session?.user?.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 用户信息概览 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {session?.user?.name || profile?.email}</h1>
          <p className="text-gray-600">Manage your account and view usage</p>
        </div>

        {/* 主要统计卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Remaining Credits</CardTitle>
              <CardDescription>Current available processing times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile?.credits || 0}</div>
              <Progress 
                value={(profile?.credits || 0) / 100 * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Current subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {profile?.subscription_status === 'active' ? 'Professional' : 'Free'}
              </div>
              {profile?.subscription_status !== 'active' && (
                <Link href="/pricing">
                  <Button>Upgrade to Pro</Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Usage</CardTitle>
              <CardDescription>Used/Total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {/* 这里可以添加实际的使用统计 */}
                45/100
              </div>
              <Progress value={45} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* 详细信息标签页 */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Processing History</CardTitle>
                <CardDescription>
                  View your recent image processing history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usageHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No processing history yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 这里可以添加实际的使用记录列表 */}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Information</CardTitle>
                <CardDescription>
                  Manage your subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-sm text-gray-500">
                        {profile?.subscription_status === 'active' ? 'Professional' : 'Free'}
                      </p>
                    </div>
                    {profile?.subscription_status !== 'active' && (
                      <Link href="/pricing">
                        <Button>Upgrade Plan</Button>
                      </Link>
                    )}
                  </div>
                  {profile?.subscription_status === 'active' && (
                    <div>
                      <h3 className="font-medium">Next Billing Date</h3>
                      <p className="text-sm text-gray-500">
                        {/* 添加实际的续费日期 */}
                        2024年5月1日
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Account Creation Date</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(profile?.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline">Update Personal Information</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 