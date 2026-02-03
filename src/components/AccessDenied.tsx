import { ShieldAlert } from "lucide-react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"

export default function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-lg w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          You do not have admin access to view the management dashboard. If you believe this is a mistake, contact your administrator.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/tools")}>
            Browse Tools
          </Button>
        </div>
      </div>
    </div>
  )
}
