 "use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
export default function LoginPage(){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);const router=useRouter();
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");const {error}=await createClient().auth.signInWithPassword({email,password});if(error)setError(error.message);else{router.push("/dashboard");router.refresh()}setBusy(false)}
 return <main className="login-screen"><div className="login-brand"><Image src="/royal-journey-logo.png" alt="Royal Journey" width={340} height={160}/><p>YOUR AGENCY. ONE CONTROL CENTER.</p></div><div className="login-box-wrap"><div className="login-box"><div className="eyebrow">ROYAL JOURNEY / SECURE ACCESS</div><h1>Welcome back.</h1><p>Sign in to manage your clients, campaigns, projects and agency operations.</p><form onSubmit={submit}><label className="field"><span>Work email</span><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/></label><label className="field"><span>Password</span><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"/></label>{error&&<div className="error-banner" style={{margin:"12px 0"}}>{error}</div>}<button className="primary-btn" disabled={busy}>{busy?"Signing in…":"Sign in to CRM"}</button></form><div className="login-help">Access is provided by your Royal Journey CRM administrator.</div></div></div></main>
}
