"use client";

import LoginPage from "./login/page";
import { useEffect, useState } from "react";
import DashboardPage from "./dashboard/page";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);

  return accessToken !== null ? <DashboardPage /> : <LoginPage />;
}
