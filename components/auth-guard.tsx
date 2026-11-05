"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
export function AuthGuard({children}:{children:React.ReactNode}) {
  const router=useRouter(); const [ready,setReady]=useState(false);
  useEffect(()=>{createClient().auth.getSession().then(({data})=>{if(!data.session) router.replace("/login"); else setReady(true);});},[router]);
  if(!ready) return <div className="loading-screen"><div className="loader"/><span>Loading Royal Journey CRM…</span></div>;
  return <>{children}</>;
}
