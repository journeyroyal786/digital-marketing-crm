import { notFound } from "next/navigation";
import { moduleConfig } from "@/lib/modules";
import { ModulePage } from "@/components/module-page";
export default async function Page({params}:{params:Promise<{module:string}>}) {
 const {module}=await params;
 if(module==="settings") return <SettingsPage/>;
 const config=moduleConfig[module];
 if(!config) notFound();
 return <ModulePage config={config}/>;
}
function SettingsPage(){return <div><div className="topbar"><div><div className="eyebrow">ROYAL JOURNEY / WORKSPACE</div><h1>Settings</h1></div></div><div className="page-content"><div className="module-intro"><div><div className="eyebrow">SYSTEM CONFIGURATION</div><h2>CRM Settings</h2><p>Workspace configuration and deployment information.</p></div></div><div className="settings-grid"><section className="panel settings-card"><h3>Company profile</h3><p><b>Royal Journey</b><br/>Digital Marketing Agency<br/>Default currency: AED<br/>Team size: 1–5 employees</p></section><section className="panel settings-card"><h3>Platform connections</h3><p>Supabase provides authentication and database services. Configure project credentials in Vercel environment variables. External ad, WhatsApp and email connections are integration-ready but need provider credentials.</p></section><section className="panel settings-card"><h3>Security</h3><p>Use role-based access, Supabase Row Level Security and secure password management. Never save client platform passwords or API tokens in notes or public fields.</p></section><section className="panel settings-card"><h3>Deployment</h3><p>Push source code to GitHub, import the repository into Vercel, add the two Supabase environment variables and deploy. See README.md for the full checklist.</p></section></div></div></div>}
