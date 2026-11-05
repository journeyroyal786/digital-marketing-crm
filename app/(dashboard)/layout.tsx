import { Shell } from "@/components/shell";
import { AuthGuard } from "@/components/auth-guard";
export default function DashboardLayout({children}:{children:React.ReactNode}) {
 return <AuthGuard><Shell>{children}</Shell></AuthGuard>;
}
