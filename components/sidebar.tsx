"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { navigation } from "@/lib/modules";
import { createClient } from "@/lib/supabase";
import { useState } from "react";

export function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [busy,setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    await createClient().auth.signOut();
    router.push("/login"); router.refresh();
  }
  return <aside className="sidebar">
    <div className="brand"><Image src="/royal-journey-logo.png" alt="Royal Journey" width={190} height={90} priority className="brand-logo" /><div className="brand-caption">AGENCY CONTROL CENTER</div></div>
    <div className="workspace-pill"><span className="online-dot"/> Royal Journey <ChevronDown size={14}/></div>
    <nav className="nav-scroll">{navigation.map(group=><div className="nav-group" key={group.label}>
      <div className="nav-label">{group.label}</div>
      {group.items.map(item=>{const active=path===item.href || (item.href!=="/dashboard" && path.startsWith(item.href)); const Icon=item.icon;
        return <Link key={item.href} href={item.href} className={`nav-link ${active?"active":""}`}><Icon size={17}/><span>{item.title}</span></Link>})}
    </div>)}</nav>
    <div className="sidebar-bottom"><Link href="/settings" className={`nav-link ${path==="/settings"?"active":""}`}><span className="settings-symbol">⚙</span>Settings</Link>
      <button className="nav-link signout" onClick={signOut} disabled={busy}><LogOut size={17}/>{busy?"Signing out…":"Sign out"}</button>
      <div className="sidebar-foot">ROYAL JOURNEY CRM <span>v1.0.0</span></div>
    </div>
  </aside>
}
