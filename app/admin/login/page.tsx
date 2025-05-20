import AdminLoginForm from "@/components/admin/login-form"
import Image from "next/image"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <Image
            src="/logoblack.png"
            alt="Zouggari Transport"
            width={180}
            height={60}
            className="h-16 w-auto object-contain mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your credentials to access the admin panel</p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  )
}
