import { useNavigate } from "react-router-dom"
import {
  LifeBuoy,
  BookOpen,
  Mail,
  X
} from "lucide-react"

interface HelpModalProps {
  showHelpModal: boolean
  setShowHelpModal: (show: boolean) => void
}

export default function HelpModal({ showHelpModal, setShowHelpModal }: HelpModalProps) {
  const navigate = useNavigate()

  if (!showHelpModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-6">

        {/* Close */}
        <button
          onClick={() => setShowHelpModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Need help?
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            We're here to help you get unstuck.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">

          {/* Help Articles */}
          <button
            onClick={() => {
              setShowHelpModal(false)
              navigate("/help")
            }}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Browse help articles</span>
          </button>

          {/* Chat */}
          <button
            onClick={() => {
              setShowHelpModal(false)
              navigate("/support")
            }}
            className="w-full flex items-center justify-between px-4 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-gray-900"
          >
            <div className="flex items-center gap-3">
              <LifeBuoy className="w-5 h-5 text-gray-700" />
              <span className="font-medium">Chat with support</span>
            </div>
            <span className="text-sm opacity-80">Online</span>
          </button>

          {/* Email */}
          <a
            href="mailto:support@mywoki.com"
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-gray-900"
          >
            <Mail className="w-5 h-5 text-gray-700" />
            <span className="font-medium">Email support</span>
          </a>

        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-center text-gray-500">
          mywoki support is available 24/7
        </p>
      </div>
    </div>
  )
}
