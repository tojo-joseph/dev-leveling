"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser, logout, type User } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  // useEffect(() => {
  //   const current = getCurrentUser();
  //   if (!current) {
  //     router.replace("/login");
  //     return;
  //   }
  //   setUser(current);
  //   setChecking(false);
  // }, [router]);

  // function handleLogout() {
  //   logout();
  //   router.replace("/login");
  // }

  // if (checking) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-background">
  //       <p className="text-sm text-muted-foreground">Checking session...</p>
  //     </div>
  //   );
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              Signed in as <span className="font-medium">{user?.email}</span>
            </span>
            {/* <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 flex flex-1 flex-col rounded-xl p-6 md:min-h-min">
            <h1 className="text-xl font-semibold tracking-tight">Welcome</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              This dashboard is using the shadcn sidebar-07 layout with dummy
              authentication. Replace this content with your real application
              widgets.
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
