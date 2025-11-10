
"use client";

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Building } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { MainNav } from "@/components/main-nav";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <FirebaseClientProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Building className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg">KeepInventory</span>
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
    </FirebaseClientProvider>
  );
}
