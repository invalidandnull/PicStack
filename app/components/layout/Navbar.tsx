'use client';

import Link from 'next/link';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signIn, signOut, useSession } from "next-auth/react"

const features = {
  'Image Processing': [
    { title: 'Remove Background', description: 'Remove Background from Image', href: '/remove-bg' },
    { title: 'Change Background', description: 'Change Background of Image', href: '/change-bg' },
    { title: 'Blur Background', description: 'Blur Background of Image', href: '/blur-bg' },
    { title: 'Enhance Image', description: 'Enhance Image Quality', href: '/enhance' },
    { title: 'Restore Image', description: 'Restore Damaged Image', href: '/restore' },
    { title: 'ID Photo', description: 'Generate Standard ID Photo', href: '/id-photo' },
  ],
  'AI Creation': [
    { title: 'Image Generation', description: 'Text to Image', href: '/generate' },
    { title: 'Face Swap', description: 'Smart Face Swap', href: '/face-swap' },
    { title: 'Style Transfer', description: 'Change Image Style', href: '/style-transfer' },
    { title: 'Face Scene', description: 'Face Scene Composition', href: '/face-scene' },
    { title: 'Face Style', description: 'Face Style Transfer', href: '/style-transfer' },
  ],
  'Design Tools': [
    { title: 'Logo Design', description: 'Professional Logo Generation', href: '/logo-design' },
    { title: 'T-shirt Design', description: 'Apparel Graphic Design', href: '/domain-generate' },
    { title: 'Social Media', description: 'Social Media Images', href: '/domain-generate' },
    { title: 'Artwork', description: 'Art Creation Assistant', href: '/domain-generate' },
    { title: 'Poster Design', description: 'Quick Poster Generation', href: '/domain-generate' },
    { title: 'Phone Wallpaper', description: 'Wallpaper Design', href: '/domain-generate' },
  ],
  'Creative Tools': [
    { title: 'Product Display', description: 'Product Display Design', href: '/domain-generate' },
    { title: 'Sticker Design', description: 'Creative Sticker Design', href: '/domain-generate' },
    { title: 'Card Design', description: 'Greeting Cards & Invitations', href: '/domain-generate' },
    { title: 'Seamless Pattern', description: 'Seamless Pattern Design', href: '/domain-generate' },
    { title: 'Emoticon Design', description: 'Emoticon Design', href: '/domain-generate' },
    { title: 'Letter Design', description: 'Creative Letter Design', href: '/domain-generate' },
  ],
  'Other Tools': [
    { title: 'Book Cover', description: 'Book Cover Design', href: '/domain-generate' },
    { title: 'Coloring Page', description: 'Coloring Book Design', href: '/domain-generate' },
    { title: 'Cup Design', description: 'Cup Design', href: '/domain-generate' },
  ],
};

export default function Navbar() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  const handleSignIn = () => {
    signIn('google')
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl">
            picstack
          </Link>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-md">Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-5 gap-3 p-6 w-[1200px]">
                    {Object.entries(features).map(([category, items]) => (
                      <div key={category}>
                        <h3 className="font-medium text-sm text-gray-500 mb-2">{category}</h3>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="block p-2 hover:bg-gray-100 rounded-md"
                            >
                              <div className="text-sm font-medium">{item.title}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className="px-4 py-2">
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth Buttons */}
        <div className="space-x-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user?.image!} />
                  <AvatarFallback>{session.user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={handleSignIn} disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </Button>
              <Button onClick={handleSignIn} disabled={loading}>
                {loading ? "Loading..." : "Sign Up"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 