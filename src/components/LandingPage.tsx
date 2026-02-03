import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  Sparkles,
  ArrowRight,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  ChevronDown,
  Compass,
  Leaf,
  Star,
  Shield,
  Layout,
  CreditCard,
  Users,
  Target,
  Wallet,
  FileText,
  Workflow
} from "lucide-react"
import { plans } from "../lib/plans"
import ChatWidget from "./ChatWidget"

const products = [
  {
    id: "idea-validation",
    shortTitle: "Idea Validation",
    fullTitle: "Business Idea Validation Toolkit",
    summary: "Validate demand before you build.",
    outcome: "Get a clear yes or no from real customers.",
    featured: true,
    icon: Sparkles
  },
  {
    id: "business-registration",
    shortTitle: "Business Registration",
    summary: "Register and comply quickly in Kenya and Africa.",
    outcome: "Be official without the paperwork stress.",
    icon: Shield
  },
  {
    id: "landing-page-setup",
    shortTitle: "Landing Page Setup",
    summary: "Launch a clean page and offer in days.",
    outcome: "Collect leads with a focused, simple page.",
    icon: Layout
  },
  {
    id: "payments-setup",
    shortTitle: "Payments Setup",
    summary: "Accept payments fast with Africa-friendly rails.",
    outcome: "Get paid in one day and move forward.",
    icon: CreditCard
  },
  {
    id: "crm-lite",
    shortTitle: "Customer Tracking",
    summary: "Track leads and follow-ups in one place.",
    outcome: "Stop losing customers to messy spreadsheets.",
    icon: Users
  },
  {
    id: "marketing-starter",
    shortTitle: "Marketing Starter",
    summary: "Get your first users with simple execution.",
    outcome: "A calm, practical go-to-market cadence.",
    icon: Target
  },
  {
    id: "cashflow-tracker",
    shortTitle: "Cashflow Tracker",
    summary: "Know your burn and cash position weekly.",
    outcome: "Make smarter decisions with clean numbers.",
    icon: Wallet
  },
  {
    id: "legal-docs",
    shortTitle: "Legal Docs",
    summary: "Start contracts and policies without overwhelm.",
    outcome: "Protect your business from day one.",
    icon: FileText
  },
  {
    id: "team-collab",
    shortTitle: "Team Collaboration",
    summary: "Organize tasks, meetings, and communication.",
    outcome: "Stay aligned as you grow beyond solo.",
    icon: Workflow
  },
  {
    id: "founder-focus",
    shortTitle: "Founder Focus",
    summary: "Build a weekly execution cadence.",
    outcome: "Protect your focus and energy.",
    icon: Compass
  }
]

const toolNamesFromCodebase = [
  "Slack Integration",
  "GitHub Automation",
  "Google Sheets Sync",
  "Email Campaigns",
  "Stripe Payments",
  "Zapier Connector",
  "Jira Integration",
  "Notion API"
]

export default function LandingPage() {
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const productsMenuRef = useRef<HTMLDivElement | null>(null)
  const pricingPlans = [
    { id: "starter", ...plans.starter },
    { id: "core", ...plans.core },
    { id: "growth", ...plans.growth }
  ]
  const handleProductSelect = (id: string) => {
    if (typeof document !== "undefined") {
      const target = document.getElementById(`product-${id}`)
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        })
      }
    }
    setIsProductsOpen(false)
  }

  useEffect(() => {
    if (!isProductsOpen) return
    const handleOutsideClick = (event: MouseEvent) => {
      if (!productsMenuRef.current) return
      if (!productsMenuRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isProductsOpen])

  return (
    <div id="top" className="min-h-screen bg-white text-gray-900">
      {/* ================= HEADER ================= */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/mywoki-logo.png" alt="mywoki" className="h-12 w-12" />
          <span className="font-semibold text-lg">Mywoki</span>
        </Link>

        <nav className="flex items-center gap-8 mx-auto">
          <div ref={productsMenuRef} className="relative">
            <button
              type="button"
              className="text-sm font-semibold text-gray-700 hover:text-emerald-700 inline-flex items-center gap-1 transition"
              aria-haspopup="true"
              aria-expanded={isProductsOpen}
              aria-controls="products-menu"
              onClick={() => setIsProductsOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsProductsOpen(false)
              }}
            >
              Products
              <ChevronDown className="w-4 h-4" />
            </button>

            <div
              id="products-menu"
              className={`absolute left-1/2 -translate-x-1/2 mt-3 w-[820px] max-w-[94vw] rounded-2xl border border-emerald-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.35)] ring-2 ring-emerald-100/70 backdrop-blur transition z-50 ${
                isProductsOpen
                  ? "opacity-100 pointer-events-auto translate-y-0"
                  : "opacity-0 pointer-events-none -translate-y-1"
              }`}
            >
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {products.map((product) => {
                    const Icon = product.icon
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleProductSelect(product.id)}
                        className={`rounded-xl border p-3 text-left transition ${
                          product.featured
                            ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                            : "border-gray-200 bg-white hover:bg-emerald-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-600 border border-emerald-100">
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {product.shortTitle}
                              </span>
                              {product.featured && (
                                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {product.summary}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <a href="#pricing" className="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition">
            Pricing
          </a>
          <a href="#about" className="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition">
            About
          </a>
          <a
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition"
          >
            Help
          </a>
        </nav>
        <Link
          to="/login"
          className="text-sm font-semibold px-5 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm hover:shadow"
        >
          Get started
        </Link>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-24 text-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
          <div className="absolute top-12 right-10 h-56 w-56 rounded-full bg-amber-100/50 blur-3xl" />
          <div className="absolute top-32 left-10 h-48 w-48 rounded-full bg-blue-100/40 blur-3xl" />
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          A calmer way to use software
        </span>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
          Turn ideas into products --
          <br />
          <span className="text-emerald-600">without drowning in tools</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          mywoki helps individuals and small teams get real value from software --
          without setup, overwhelm, or wasted time.
        </p>
        <div className="max-w-3xl mx-auto mb-10 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-sm text-emerald-900">
          Building a physical product or a digital product? mywoki helps you find the right tools,
          where to get your first users, and the exact next steps to validate and launch.
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="px-7 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/60"
          >
            Start building
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition font-medium"
          >
            Learn more
          </a>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span className="inline-flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-500" />
            Calm, founder-first toolkits
          </span>
          <span className="inline-flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-500" />
            Kenya-first, Africa-friendly
          </span>
          <span className="inline-flex items-center gap-2">
            <Star className="w-4 h-4 text-emerald-500" />
            Curated for execution
          </span>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white/80 shadow-sm backdrop-blur p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <img src="/doodles/intent.svg" alt="" className="w-12 h-12" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-emerald-700">Illustrated workflow</p>
              <p className="text-sm text-gray-600 mt-1">
                A calm path from idea validation to launch, with only the tools you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-slate-500/10 blur-3xl" />
          <img
            src="/doodles/intent.svg"
            alt=""
            aria-hidden="true"
            className="absolute left-10 top-10 w-20 opacity-20"
          />
          <img
            src="/doodles/intent.svg"
            alt=""
            aria-hidden="true"
            className="absolute right-16 bottom-16 w-16 opacity-15"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-slate-100">
              <span className="block animate-slide-up" style={{ animationDelay: "0.05s" }}>
                Software was meant to help.
              </span>
              <span className="block animate-slide-up" style={{ animationDelay: "0.15s" }}>
                Somewhere, it became the work.
              </span>
            </h2>
            <p className="text-slate-300 mb-6 animate-slide-up" style={{ animationDelay: "0.25s" }}>
              Every new idea comes with decisions you should not have to make.
              Which tool? Which plan? Which integration?
            </p>
            <p className="text-slate-200 animate-slide-up" style={{ animationDelay: "0.35s" }}>
              Most people do not need more software.
              They need <strong className="text-emerald-300">clarity</strong>.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Too many tools",
              "Too many dashboards",
              "Paying for things you barely use",
              "Spending more time setting up than building"
            ].map((item, index) => (
              <div
                key={item}
                className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 text-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
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
                Tell us what you are trying to achieve -- launching something,
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
                You will not see everything at once. Tools appear when they are
                actually useful -- not before, not after.
              </p>
            </div>

            {/* Card 3 */}
            <div className="
              group bg-white/80 backdrop-blur
              rounded-2xl p-8 border border-gray-200
              transition-all duration-500 delay-150
              hover:-translate-y-2 hover:shadow-xl
            ">
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

      {/* ================= WHO IT'S FOR ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Built for people who want progress
          </h2>
          <p className="text-gray-600 mb-10">
            Whether you are testing an idea, running a small team, or building
            quietly -- mywoki gives you structure without pressure.
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
                className="bg-white border border-gray-200 rounded-xl p-6 font-medium shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section id="products" className="py-24 bg-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-3">Products built for traction</h2>
              <p className="text-slate-300 max-w-2xl">
                Each product is designed to remove one high-friction step in the founder journey.
                Start with the featured toolkit, then add what you need as you grow.
              </p>
            </div>

            <details className="relative w-full md:w-80">
              <summary className="list-none cursor-pointer px-5 py-3 border border-emerald-500/30 rounded-full text-sm font-medium text-emerald-100 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition">
                Explore the suite
                <ChevronDown className="w-4 h-4" />
              </summary>
              <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 shadow-xl p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {products.map((product) => {
                    const Icon = product.icon
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleProductSelect(product.id)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-lg text-sm text-slate-200 hover:text-emerald-200 hover:bg-emerald-500/10 transition"
                      >
                        <Icon className="w-4 h-4 text-emerald-300" />
                        {product.shortTitle}
                      </button>
                    )
                  })}
                </div>
              </div>
            </details>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Validate with clarity",
                copy: "Turn uncertainty into a clear next step.",
                icon: <Compass className="w-5 h-5 text-emerald-600" />
              },
              {
                title: "Launch with calm",
                copy: "Move fast without chaos or tool sprawl.",
                icon: <Leaf className="w-5 h-5 text-emerald-600" />
              },
              {
                title: "Grow with focus",
                copy: "Stack what matters, skip the noise.",
                icon: <Star className="w-5 h-5 text-emerald-600" />
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-100 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-300">{item.copy}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => {
              const isFeatured = product.featured
              const Icon = product.icon

              return (
                <div
                  key={product.id}
                  id={`product-${product.id}`}
                  className={`border rounded-2xl p-6 shadow-sm transition hover:shadow-md ${
                    isFeatured
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-900/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-200 border border-emerald-500/20">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100">
                          {product.shortTitle}
                        </h3>
                        <p className="text-sm text-slate-300 mt-1">
                          {product.summary}
                        </p>
                      </div>
                    </div>
                    {isFeatured && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-200">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 border border-slate-800 rounded-2xl p-6 bg-slate-900/70">
            <h3 className="text-lg font-semibold mb-3 text-slate-100">Tools we integrate</h3>
            <div className="flex flex-wrap gap-2">
              {toolNamesFromCodebase.map((tool) => (
                <span
                  key={tool}
                  className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-3">Transparent pricing for every stage</h2>
              <p className="text-gray-600 max-w-2xl">
                Tools are priced by plan. Start with Starter, then scale into Core or Growth when
                you need more activations and support.
              </p>
            </div>

            <details className="relative w-full md:w-80">
              <summary className="list-none cursor-pointer px-5 py-3 border border-emerald-100 rounded-full text-sm font-medium text-emerald-700 flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 transition">
                Jump to a product
                <ChevronDown className="w-4 h-4" />
              </summary>
              <div className="absolute z-10 mt-2 w-full rounded-2xl border border-emerald-100 bg-white shadow-xl p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {products.map((product) => {
                    const Icon = product.icon
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleProductSelect(product.id)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-lg text-sm text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition"
                      >
                        <Icon className="w-4 h-4 text-emerald-600" />
                        {product.shortTitle}
                      </button>
                    )
                  })}
                </div>
              </div>
            </details>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-7 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  plan.recommended ? "border-emerald-500 shadow-emerald-100" : ""
                }`}
              >
                {plan.recommended && (
                  <span className="inline-flex text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 mb-4">
                    Recommended
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.note}</p>
                <div className="text-3xl font-bold mb-2">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                  <span className="text-base font-medium text-gray-500">/month</span>
                </div>
                {plan.yearly && (
                  <p className="text-sm text-gray-500 mb-4">or ${plan.yearly}/year</p>
                )}
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-full font-semibold transition ${
                    plan.recommended
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200/60"
                      : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  Choose {plan.name}
                </Link>
                <a
                  href="/help"
                  className="mt-3 inline-flex items-center justify-center w-full px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Contact sales
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="py-24 bg-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">About Mywoki</h2>
            <p className="text-slate-300 mb-6">
              Mywoki is built for founders who want momentum without chaos. We curate practical,
              Kenya-first and Africa-friendly systems that help you validate ideas, launch fast,
              and run the basics with confidence. Every product is a focused, usable kit --
              not a bloated platform -- so you can move from idea to execution in days, not months.
            </p>
            <p className="text-slate-300 mb-6">
              We also support both physical and digital product ideas with the right tooling,
              from where to find early users to which systems to use as you grow.
            </p>
            <p className="text-slate-300">
              Our goal is simple: give you the right tool at the right time, priced fairly, and
              bundled around outcomes. Start with clarity, then stack tools as your business grows.
            </p>
          </div>

          <div className="border border-slate-800 rounded-2xl p-7 bg-slate-900/70">
            <h3 className="text-lg font-semibold mb-4">What you get with Mywoki</h3>
            <ul className="space-y-3 text-slate-200">
              <li>Practical toolkits tied to real founder milestones</li>
              <li>Templates, checklists, and playbooks that remove guesswork</li>
              <li>Pricing that scales from solo founders to growth teams</li>
              <li>Curated integrations with software you already use</li>
            </ul>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition shadow-sm hover:shadow"
              >
                Start with the featured toolkit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
            Join thousands who have found a calmer way to work with software
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-lg hover:from-emerald-700 hover:to-emerald-600 transition shadow-xl hover:shadow-2xl"
          >
            Start with clarity
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Coming soon</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "AI Automations",
                  "Teams & permissions",
                  "Mobile companion",
                  "Template marketplace",
                  "Multi-workspace management",
                  "Investor updates",
                  "Product roadmap",
                  "Supplier sourcing",
                  "Referral engine"
                ].map((item) => (
                  <span
                    key={item}
                    className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Why mywoki</h3>
              <p className="text-sm text-gray-500">
                A calm path from idea to launch. Clear steps, curated tools, and
                guidance on where to find your first users.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Stay in the loop</h3>
              <p className="text-sm text-gray-500">
                New tools, playbooks, and product updates land in Help and your dashboard.
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
            <span>Copyright {new Date().getFullYear()} mywoki</span>
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

      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <a
          href="#products"
          className="px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-700 text-sm font-medium shadow hover:bg-emerald-50 transition"
        >
          Products
        </a>
        <a
          href="#top"
          className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium shadow-lg hover:bg-gray-800 transition"
        >
          Back to top
        </a>
      </div>
      <ChatWidget />
    </div>
  )
}
