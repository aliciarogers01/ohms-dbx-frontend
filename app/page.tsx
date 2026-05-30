"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LAST_ROUTE_KEY = "ohms:last-route";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const lastRoute = window.localStorage.getItem(LAST_ROUTE_KEY);

    router.replace(lastRoute && lastRoute !== "/" ? lastRoute : "/artists");
  }, [router]);

  return null;
}