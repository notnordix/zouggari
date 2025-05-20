import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import DashboardLayout from "@/components/admin/dashboard-layout"
import VehiclesManagement from "@/components/admin/vehicles-management"

export default async function VehiclesPage() {
  // Check if user is authenticated
  const authenticated = await isAdminAuthenticated()

  // Redirect to login if not authenticated
  if (!authenticated) {
    redirect("/admin/login")
  }

  return (
    <DashboardLayout>
      <VehiclesManagement />
    </DashboardLayout>
  )
}
