import MyWokiLoader from "./MyWokiLoader"

export default function MaintenanceScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="text-center px-6">
        <div className="flex justify-center mb-4">
          <MyWokiLoader />
        </div>
        <h1 className="text-2xl font-semibold">Under Maintenance</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md">
          We are updating the platform to improve reliability and performance. Please check back shortly.
        </p>
      </div>
    </div>
  )
}
