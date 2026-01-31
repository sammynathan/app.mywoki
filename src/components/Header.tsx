import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const isHelpPage = location.pathname === '/help'

  return (
    <header className="sticky top-4 z-50">
      {/* Main header container with Linktree-style design */}
      <div className="px-6 lg:px-16">
        <div className="relative max-w-7xl mx-auto">
          {/* Linktree-style top edge with corner cutouts */}
          <div className="absolute -top-4 left-0 right-0 h-4 flex justify-between pointer-events-none">
            {/* Left corner cutout */}
            <div className="w-4 h-4 bg-white rounded-br-full" />
            {/* Right corner cutout */}
            <div className="w-4 h-4 bg-white rounded-bl-full" />
          </div>

          {/* Linktree-style bottom edge with corner cutouts */}
          <div className="absolute -bottom-4 left-0 right-0 h-4 flex justify-between pointer-events-none">
            {/* Left corner cutout */}
            <div className="w-4 h-4 bg-white rounded-tr-full" />
            {/* Right corner cutout */}
            <div className="w-4 h-4 bg-white rounded-tl-full" />
          </div>

          {/* Main header content area */}
          <div className="relative bg-white border-t border-b border-gray-300 rounded-lg overflow-hidden">
            {/* Decorative top border line (like Linktree) */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Header content */}
            <div className="h-16 flex items-center justify-between px-6">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <img
                  src="/mywoki-logo.png"
                  alt="mywoki logo"
                  className="h-12 w-12 object-contain"
                />

                <span className="ml-2 text-lg font-bold text-gray-900">mywoki</span>
              </div>

              {/* Navigation / Auth Buttons - Hide on help page */}
              {!isHelpPage && (
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                    For businesses
                  </button>
                  <div className="border-l border-gray-300 h-6 mx-2" />
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-700 transition-colors">
                    Log in
                  </Link>

                </div>
              )}
            </div>

            {/* Decorative bottom border line (like Linktree) */}
            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
        </div>
      </div>
    </header>
  )
}
