"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Building } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { MainNav } from "@/components/main-nav";
import { inventoryService } from "@/lib/data";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.push("/login");
    } else {
      inventoryService.initialize();
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isClient || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Building className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg">AssetWise</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          {/* Optional: Add footer content like user profile */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <SiteHeader />
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
