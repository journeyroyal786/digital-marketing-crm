import { Sidebar } from "./sidebar";
export function Shell({children}:{children:React.ReactNode}) {
  return <div className="app-shell"><Sidebar/><main className="main-area">{children}</main></div>
}
