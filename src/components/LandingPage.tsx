import { Link } from "react-router-dom"
import {
  Sparkles,
  ArrowRight,
  Twitter,
  Instagram,
  Facebook,
  Linkedin
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= HEADER ================= */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/mywoki-logo.png" alt="mywoki" className="h-12 w-12" />
          <span className="font-semibold text-lg">Mywoki</span>
        </Link>

        <nav className="flex items-center gap-6">
          <a href="/help" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">
            Help
          </a>
          <Link
            to="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          A calmer way to use software
        </span>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Turn ideas into products —
          <br />
          <span className="text-emerald-600">without drowning in tools</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          mywoki helps individuals and small teams get real value from software —
          without setup, overwhelm, or wasted time.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition flex items-center gap-2"
          >
            Start building
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Learn more
          </a>
        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Software was meant to help.
              <br /> Somewhere, it became the work.
            </h2>
            <p className="text-gray-600 mb-6">
              Every new idea comes with decisions you shouldn’t have to make.
              Which tool? Which plan? Which integration?
            </p>
            <p className="text-gray-600">
              Most people don’t need more software.
              They need <strong>clarity</strong>.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Too many tools",
              "Too many dashboards",
              "Paying for things you barely use",
              "Spending more time setting up than building"
            ].map(item => (
              <div
                key={item}
                className="bg-white p-5 rounded-xl border text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
     <section className="relative py-32 overflow-hidden">
  {/* Waxy background */}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-green-400/10 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/10 via-transparent to-amber-200/20" />

    {/* Soft blobs */}
    <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-emerald-300/20 rounded-full blur-3xl" />
    <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] bg-purple-300/20 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] bg-amber-200/20 rounded-full blur-3xl" />
  </div>

  <div className="relative max-w-6xl mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-20">
      How mywoki works
    </h2>

    <div className="grid md:grid-cols-3 gap-10">
      
      {/* Card 1 */}
      <div className="
        group bg-white/80 backdrop-blur
        rounded-2xl p-8 border border-gray-200
        transition-all duration-500
        hover:-translate-y-2 hover:shadow-xl
      ">
        {/* Doodle placeholder */}
        <div className="w-20 h-20 mb-6 rounded-xl bg-purple-100 flex items-center justify-center">
          <img
  src="/doodles/intent.svg"
  alt=""
  className="w-16 h-16"
/>

        </div>


        <span className="text-xs tracking-wider text-gray-400 uppercase">
          Step 01
        </span>

        <h3 className="text-xl font-medium text-gray-900 mt-3 mb-3">
          Start with intent
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Tell us what you’re trying to achieve — launching something,
          working solo, growing a team, or learning at your own pace.
        </p>
      </div>

      {/* Card 2 */}
      <div className="
        group bg-white/80 backdrop-blur
        rounded-2xl p-8 border border-gray-200
        transition-all duration-500 delay-75
        hover:-translate-y-2 hover:shadow-xl
      ">
        {/* Doodle placeholder */}
        <div className="w-20 h-20 mb-6 rounded-xl bg-purple-100 flex items-center justify-center">
          <img
  src="/doodles/intent.svg"
  alt=""
  className="w-16 h-16"
/>

        </div>

        <span className="text-xs tracking-wider text-gray-400 uppercase">
          Step 02
        </span>

        <h3 className="text-xl font-medium text-gray-900 mt-3 mb-3">
          Activate only what matters
        </h3>

        <p className="text-gray-600 leading-relaxed">
          You won’t see everything at once. Tools appear when they’re
          actually useful — not before, not after.
        </p>
      </div>

      {/* Card 3 */}
      <div className="
        group bg-white/80 backdrop-blur
        rounded-2xl p-8 border border-gray-200
        transition-all duration-500 delay-150
        hover:-translate-y-2 hover:shadow-xl
      ">
        {/* Doodle placeholder */}
        <div className="w-20 h-20 mb-6 rounded-xl bg-purple-100 flex items-center justify-center">
          <img
  src="/doodles/intent.svg"
  alt=""
  className="w-16 h-16"
/>

        </div>


        <span className="text-xs tracking-wider text-gray-400 uppercase">
          Step 03
        </span>

        <h3 className="text-xl font-medium text-gray-900 mt-3 mb-3">
          Build with confidence
        </h3>

        <p className="text-gray-600 leading-relaxed">
          No clutter. No setup fatigue. Everything stays calm,
          connected, and flexible as your work evolves.
        </p>
      </div>

    </div>
  </div>
</section>


      {/* ================= WHO IT’S FOR ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Built for people who want progress
          </h2>
          <p className="text-gray-600 mb-10">
            Whether you’re testing an idea, running a small team, or building
            quietly — mywoki gives you structure without pressure.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              "Solo founders",
              "Creators & builders",
              "Early-stage teams",
              "Anyone tired of tool overload"
            ].map(role => (
              <div
                key={role}
                className="bg-white border rounded-xl p-6 font-medium"
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING STORY ================= */}
      <section className="relative py-24 overflow-hidden">
        {/* Wavy background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-green-500/5 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 via-transparent to-gray-200/50"></div>
          
          {/* Wavy pattern */}
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-emerald-100"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-emerald-200"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-emerald-300"
            />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to build without the noise?
          </h2>
          <p className="text-gray-700 mb-10 max-w-2xl mx-auto">
            Join thousands who've found a calmer way to work with software
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-lg hover:from-emerald-700 hover:to-green-600 transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
          >
            Start with clarity
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
            <span>© {new Date().getFullYear()} mywoki</span>
            <div className="flex gap-4">
              <a href="/help" target="_blank" rel="noopener noreferrer">Help</a>
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
              <a href="/terms" target="_blank" rel="noopener noreferrer">Terms</a>
            </div>
          </div>
          <div className="flex justify-center gap-6">
            <a
              href="https://x.com/mywokiB2B"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/mywoki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com/mywoki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/company/mywoki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}


