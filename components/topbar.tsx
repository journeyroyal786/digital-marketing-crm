"use client";
import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";
export function Topbar({title}:{title:string}) {
  const [query,setQuery]=useState("");
  return <header className="topbar"><div className="topbar-left"><div className="mobile-menu"><Menu size={20}/></div><div><div className="eyebrow">ROYAL JOURNEY / WORKSPACE</div><h1>{title}</h1></div></div>
    <div className="top-actions"><div className="global-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search workspace…" onKeyDown={e=>{if(e.key==="Enter" && query.trim()) window.location.href="/leads"}}/></div>
      <button className="icon-button" aria-label="Notifications"><Bell size={18}/><i/></button><div className="avatar">RJ</div></div>
  </header>
}
