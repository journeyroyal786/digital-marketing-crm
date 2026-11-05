"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Users, Target, BriefcaseBusiness, Wallet, Plus, Clock3, CircleAlert, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Topbar } from "./topbar";
const money=(v:number)=>new Intl.NumberFormat("en-AE",{style:"currency",currency:"AED",maximumFractionDigits:0}).format(v||0);
export function Dashboard() {
 const [stats,setStats]=useState({leads:0,clients:0,projects:0,receivables:0,dealValue:0});
 const [leads,setLeads]=useState<any[]>([]); const [tasks,setTasks]=useState<any[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const db=createClient();
  const [l,c,p,i,d,leadRows,taskRows]=await Promise.all([
   db.from("leads").select("id",{count:"exact",head:true}),
   db.from("clients").select("id",{count:"exact",head:true}).eq("status","Active"),
   db.from("projects").select("id",{count:"exact",head:true}).neq("status","Completed"),
   db.from("invoices").select("balance_aed").gt("balance_aed",0),
   db.from("deals").select("value_aed").not("stage","in",'("Won","Lost")'),
   db.from("leads").select("id,company_name,contact_name,source,status,created_at").order("created_at",{ascending:false}).limit(5),
   db.from("tasks").select("id,title,client_name,due_date,priority,status").neq("status","Completed").order("due_date",{ascending:true}).limit(5)
  ]);
  setStats({leads:l.count||0,clients:c.count||0,projects:p.count||0,receivables:(i.data||[]).reduce((s,x)=>s+Number(x.balance_aed||0),0),dealValue:(d.data||[]).reduce((s,x)=>s+Number(x.value_aed||0),0)});
  setLeads(leadRows.data||[]); setTasks(taskRows.data||[]); setLoading(false);
 })()},[]);
 const cards=[{label:"Total leads",value:String(stats.leads),sub:"All captured prospects",icon:Target,color:"gold"},{label:"Active clients",value:String(stats.clients),sub:"Current client accounts",icon:Users,color:"wine"},{label:"Active projects",value:String(stats.projects),sub:"Delivery in progress",icon:BriefcaseBusiness,color:"blue"},{label:"Outstanding",value:money(stats.receivables),sub:"Open invoice balances",icon:Wallet,color:"green"}];
 return <><Topbar title="Executive Dashboard"/><div className="page-content">
  <div className="welcome-row"><div><div className="eyebrow">FRIDAY, 06 NOVEMBER 2026</div><h2>Good morning, Royal Journey <span>✦</span></h2><p>Here’s what’s happening across your agency today.</p></div><Link href="/leads" className="primary-btn"><Plus size={16}/> Add new lead</Link></div>
  <div className="stat-grid">{cards.map((c,i)=>{const Icon=c.icon;return <div className="stat-card" key={c.label}><div className="stat-top"><span>{c.label}</span><div className={`stat-icon ${c.color}`}><Icon size={18}/></div></div><div className="stat-value">{loading?"—":c.value}</div><div className="stat-sub">{c.sub}</div></div>})}</div>
  <div className="insight-banner"><div className="insight-icon"><TrendingUp size={19}/></div><div><b>Sales pipeline snapshot</b><p>Open opportunities currently represent <strong>{money(stats.dealValue)}</strong> in potential revenue.</p></div><Link href="/deals">View pipeline <ArrowUpRight size={15}/></Link></div>
  <div className="dashboard-grid">
   <section className="panel"><div className="panel-head"><div><h3>Recent leads</h3><p>Your latest incoming opportunities</p></div><Link href="/leads" className="text-link">View all <ArrowUpRight size={14}/></Link></div>
    {loading?<div className="empty-state">Loading records…</div>:leads.length===0?<div className="empty-state"><Target size={24}/><b>No leads yet</b><span>New prospects will appear here.</span><Link href="/leads" className="text-link">Create your first lead</Link></div>:<div className="table-wrap"><table><thead><tr><th>Company / Contact</th><th>Source</th><th>Status</th><th>Added</th></tr></thead><tbody>{leads.map(x=><tr key={x.id}><td><b>{x.company_name}</b><small>{x.contact_name||"—"}</small></td><td>{x.source||"—"}</td><td><span className="status-pill">{x.status||"New Lead"}</span></td><td>{new Date(x.created_at).toLocaleDateString("en-AE")}</td></tr>)}</tbody></table></div>}
   </section>
   <section className="panel"><div className="panel-head"><div><h3>Priority tasks</h3><p>Upcoming delivery commitments</p></div><Link href="/tasks" className="text-link">View all <ArrowUpRight size={14}/></Link></div>
    {loading?<div className="empty-state">Loading tasks…</div>:tasks.length===0?<div className="empty-state"><Clock3 size={24}/><b>Clear schedule</b><span>No open tasks found.</span><Link href="/tasks" className="text-link">Create a task</Link></div>:<div className="task-list">{tasks.map(t=><div className="task-row" key={t.id}><div className={`priority-dot ${(t.priority||"").toLowerCase()}`}/><div className="task-info"><b>{t.title}</b><span>{t.client_name||"Internal"} · {t.due_date||"No due date"}</span></div><span className="task-state">{t.status}</span></div>)}</div>}
   </section>
  </div>
  <div className="quick-grid"><Link href="/clients"><Users/><b>Client accounts</b><span>Manage relationships</span></Link><Link href="/projects"><BriefcaseBusiness/><b>Delivery workspace</b><span>Projects and tasks</span></Link><Link href="/invoices"><Wallet/><b>Finance center</b><span>Invoices and collections</span></Link><Link href="/tickets"><CircleAlert/><b>Client support</b><span>Requests and issues</span></Link></div>
  <div className="footer-note">ROYAL JOURNEY CRM <span>·</span> Built for clarity, control and growth.</div>
 </div></>
}
