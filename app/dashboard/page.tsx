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
import { logout, type User } from "@/lib/auth";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "@/store/slice";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommitActivity } from "@/components/commit-activity";

interface CommitData {
  date: string;
  count: number;
}

export default function DashboardPage() {
  const user_id = useSelector((state: RootState) => state.user.user_id);
  const router = useRouter();
  const dispatch = useDispatch();
  const [commitData, setCommitData] = useState<any[]>([]);
  // const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const handleLogout = async () => {
    try {
      dispatch(clearUser());
      const response = await logout("logout", {});

      if (response) {
        console.log(response);
        router.push("/login");
      } else {
        console.log("Something went wrong while logging out!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    getCommitActivity();
  }, []);

  const getCommitActivity = async () => {
    try {
      const response: any = await fetch(
        "http://localhost:5000/api/get_commit_activity",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.ok && data.commit_activity) {
        // Transform the data into the format expected by react-calendar-heatmap
        const formattedData = Object.entries(data.commit_activity).map(
          ([date, count]) => ({
            date,
            count: count as number,
          })
        );
        console.log("Formatted Data:", formattedData); // Log the final formatted data
        setCommitData(formattedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get_user_data", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response) {
        console.log("userDataResponse", response);
        dispatch(setUser({ user_id: data.user_id, userInfo: data.user_data }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

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
            {userInfo && (
              <span>
                Signed in as{" "}
                <span className="font-medium">{userInfo?.login}</span>
              </span>
            )}
            {userInfo && (
              <Avatar>
                <AvatarImage src={userInfo ? userInfo.avatar_url : ""} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 flex flex-1 flex-col rounded-xl p-6 md:min-h-min">
            <h1 className="text-xl font-semibold tracking-tight">
              Github Commits
            </h1>
            <CommitActivity commitData={commitData} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
