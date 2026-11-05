"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X, Pencil, Trash2, Download, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { ModuleConfig } from "@/lib/modules";
import { Topbar } from "./topbar";

function money(value:any) {
 if(value===null||value===undefined||value==="") return "—";
 const n=Number(value); return Number.isFinite(n) && Math.abs(n)>=0 ? new Intl.NumberFormat("en-AE",{style:"currency",currency:"AED",maximumFractionDigits:0}).format(n) : String(value);
}
export function ModulePage({config}:{config:ModuleConfig}) {
 const [rows,setRows]=useState<any[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[search,setSearch]=useState(""),[status,setStatus]=useState("All statuses");
 const [modal,setModal]=useState(false),[editing,setEditing]=useState<any>(null),[saving,setSaving]=useState(false);
 const [form,setForm]=useState<Record<string,any>>({});
 const db=createClient();
 async function load(){setLoading(true);setError("");const {data,error}=await db.from(config.table).select("*").order("created_at",{ascending:false}).limit(500);if(error)setError(error.message);setRows(data||[]);setLoading(false);}
 useEffect(()=>{load();},[config.table]);
 const filtered=useMemo(()=>rows.filter(r=>{
  const q=search.toLowerCase(); const match=!q||Object.values(r).some(v=>String(v??"").toLowerCase().includes(q));
  const s=status==="All statuses"||String(r.status||"")===status; return match&&s;
 }),[rows,search,status]);
 const statuses=Array.from(new Set(rows.map(r=>r.status).filter(Boolean)));
 function openForm(row?:any){setEditing(row||null);const next:Record<string,any>={};config.fields.forEach(f=>next[f.name]=row?.[f.name]??"");setForm(next);setModal(true);}
 async function save(e:React.FormEvent){e.preventDefault();setSaving(true);setError("");const payload={...form};config.fields.forEach(f=>{if(f.type==="number")payload[f.name]=payload[f.name]===""?null:Number(payload[f.name]);else if(payload[f.name]==="")payload[f.name]=null;});
  const result=editing?await db.from(config.table).update(payload).eq("id",editing.id):await db.from(config.table).insert(payload);
  if(result.error)setError(result.error.message);else{setModal(false);await load();}setSaving(false);
 }
 async function remove(row:any){if(!confirm("Delete this record? This cannot be undone."))return;const {error}=await db.from(config.table).delete().eq("id",row.id);if(error)setError(error.message);else load();}
 function exportCsv(){const cols=config.columns.map(c=>c.key);const csv=[cols.join(","),...filtered.map(r=>cols.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(","))].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=`royal-journey-${config.table}.csv`;a.click();URL.revokeObjectURL(a.href);}
 return <><Topbar title={config.title}/><div className="page-content">
  <div className="module-intro"><div><div className="eyebrow">AGENCY WORKSPACE</div><h2>{config.title}</h2><p>{config.description}</p></div><button className="primary-btn" onClick={()=>openForm()}><Plus size={16}/> Add {config.singular}</button></div>
  <div className="panel data-panel"><div className="toolbar"><div className="search-field"><Search size={16}/><input placeholder={`Search ${config.title.toLowerCase()}…`} value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="toolbar-right"><div className="filter-field"><Filter size={15}/><select value={status} onChange={e=>setStatus(e.target.value)}><option>All statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></div><button className="secondary-btn" onClick={exportCsv}><Download size={15}/> Export</button></div></div>
   {error&&<div className="error-banner">{error}</div>}
   {loading?<div className="empty-state">Loading {config.title.toLowerCase()}…</div>:filtered.length===0?<div className="empty-state"><div className="empty-orb"><Search size={22}/></div><b>{rows.length?"No matching records":"Your workspace is ready"}</b><span>{rows.length?"Try a different search or filter.":`Create your first ${config.singular.toLowerCase()} to get started.`}</span>{!rows.length&&<button className="text-link" onClick={()=>openForm()}>+ Add {config.singular}</button>}</div>:
   <div className="table-wrap"><table><thead><tr>{config.columns.map(c=><th key={c.key}>{c.label}</th>)}<th className="action-col">Actions</th></tr></thead><tbody>{filtered.map(row=><tr key={row.id}>{config.columns.map(c=><td key={c.key}>{c.key==="status"?<span className={`status-pill ${String(row[c.key]||"").toLowerCase().replaceAll(" ","-")}`}>{row[c.key]||"—"}</span>:c.key.endsWith("_aed")||c.key==="value_aed"?money(row[c.key]):row[c.key]||"—"}</td>)}<td><div className="row-actions"><button title="Edit" onClick={()=>openForm(row)}><Pencil size={15}/></button><button title="Delete" onClick={()=>remove(row)}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>}
   <div className="table-foot"><span>Showing {filtered.length} of {rows.length} records</span><span>Data stored securely in your Supabase project</span></div>
  </div><div className="footer-note">ROYAL JOURNEY CRM <span>·</span> {config.table.toUpperCase()} MODULE</div>
 </div>
 {modal&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><div className="modal"><div className="modal-head"><div><div className="eyebrow">{editing?"UPDATE RECORD":"NEW RECORD"}</div><h3>{editing?"Edit":"Add"} {config.singular}</h3></div><button className="icon-button" onClick={()=>setModal(false)}><X size={18}/></button></div>
  <form onSubmit={save}><div className="form-grid">{config.fields.map(f=><label className={f.type==="textarea"?"field full":"field"} key={f.name}><span>{f.label}{f.required&&" *"}</span>{f.options?<select required={f.required} value={form[f.name]??""} onChange={e=>setForm({...form,[f.name]:e.target.value})}><option value="">Select…</option>{f.options.map(o=><option key={o}>{o}</option>)}</select>:f.type==="textarea"?<textarea rows={3} value={form[f.name]??""} onChange={e=>setForm({...form,[f.name]:e.target.value})}/>:<input required={f.required} type={f.type||"text"} value={form[f.name]??""} onChange={e=>setForm({...form,[f.name]:e.target.value})}/>}</label>)}</div>
   {error&&<div className="error-banner">{error}</div>}<div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setModal(false)}>Cancel</button><button className="primary-btn" disabled={saving}>{saving?"Saving…":editing?"Save changes":"Create record"}</button></div>
  </form></div></div>}
 </>}
}
