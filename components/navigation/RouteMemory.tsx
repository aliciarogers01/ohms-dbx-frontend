"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LAST_ROUTE_KEY = "ohms:last-route";

export default function RouteMemory() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/") return;

    const queryString = searchParams.toString();
    const route = queryString ? `${pathname}?${queryString}` : pathname;

    window.localStorage.setItem(LAST_ROUTE_KEY, route);
  }, [pathname, searchParams]);

  return null;
}