"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Settings, LogOut, PlusCircle } from "lucide-react"

const menuItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ user:{email: string} } | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/")
      return
    }

    try {
      setUser(JSON.parse(storedUser))
    } catch (e) {
      // Invalid stored data
      localStorage.removeItem("user")
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // Don't render anything until we've checked authentication on the client
  if (!isClient) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-scree≠n">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center">
              <span className="font-bold text-lg">Cambalache Dashboard</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="m-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">Logeado como: {user?.user.email}</div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="w-full flex flex-col h-screen">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger />
            <div className="font-semibold">
              {menuItems.find(item => item.href === pathname)?.label || "Dashboard"}
            </div>
          </header>
          <main className="p-8 w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

