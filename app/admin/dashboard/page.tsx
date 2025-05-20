import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import DashboardLayout from "@/components/admin/dashboard-layout"
import DashboardOverview from "@/components/admin/dashboard-overview"

export default async function AdminDashboardPage() {
  // Check if user is authenticated
  const authenticated = await isAdminAuthenticated()

  // Redirect to login if not authenticated
  if (!authenticated) {
    redirect("/admin/login")
  }

  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}
