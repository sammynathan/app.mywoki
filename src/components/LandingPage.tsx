import { useEffect, useMemo, useRef, useState } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
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
import { useAuth } from "../auth/AuthContext"
import MyWokiLoader from "./MyWokiLoader"
import MaintenanceBanner from "./MaintenanceBanner"
import StatusBanner from "./StatusBanner"

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


export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const productsMenuRef = useRef<HTMLDivElement | null>(null)
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://mywoki.com"
  const landingUrl = `${siteUrl}/`
  const pricingPlans = [
    { id: "starter", ...plans.starter },
    { id: "core", ...plans.core },
    { id: "growth", ...plans.growth }
  ]
  const jsonLd = useMemo(() => {
    const offers = pricingPlans.map((plan) => ({
      "@type": "Offer",
      "name": `${plan.name} Plan`,
      "price": plan.price,
      "priceCurrency": "USD",
      "url": `${siteUrl}/#pricing`
    }))

    const data = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          "name": "Mywoki",
          "alternateName": "Mywoki Marketplace",
          "url": siteUrl,
          "description": "Mywoki helps founders and teams turn physical and digital product ideas into reality with curated tools, playbooks, and guidance."
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          "name": "Mywoki",
          "alternateName": "Mywoki Marketplace",
          "url": siteUrl
        },
        {
          "@type": "WebPage",
          "@id": `${landingUrl}#webpage`,
          "name": "Mywoki",
          "url": landingUrl,
          "isPartOf": { "@id": `${siteUrl}/#website` },
          "about": { "@id": `${siteUrl}/#organization` }
        },
        {
          "@type": "SoftwareApplication",
          "name": "Mywoki",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "url": siteUrl,
          "offers": offers
        },
        {
          "@type": "ItemList",
          "name": "Mywoki toolkits",
          "itemListElement": products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": product.shortTitle,
            "description": product.summary,
            "url": `${siteUrl}/#product-${product.id}`
          }))
        }
      ]
    }
    return JSON.stringify(data)
  }, [siteUrl, landingUrl, pricingPlans])
  const pageTitle = "MyWoki | Calm, founder-first toolkits to build smarter"
  const pageDescription = "MyWoki helps founders and small teams turn ideas into real products with curated toolkits, playbooks, and clear next steps."
  const canonicalUrl = landingUrl
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

  useEffect(() => {
    if (!isRedirecting || authLoading) return

    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate("/dashboard")
      }, 150)
      return () => clearTimeout(timer)
    }

    setIsRedirecting(false)
    navigate("/login")
  }, [authLoading, isAuthenticated, isRedirecting, navigate])

  const handleStartClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    if (authLoading || isAuthenticated) {
      setIsRedirecting(true)
      return
    }

    navigate("/login")
  }

  return (
    <div id="top" className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <StatusBanner />
      <MaintenanceBanner />
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
          onClick={handleStartClick}
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
          <span className="text-emerald-600">with only the tools that matter</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          mywoki helps individuals and small teams get real value from software --
          without setup, overwhelm, or wasted time.
        </p>
        

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            onClick={handleStartClick}
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
                Tools appear when they are actually useful — for example, validation tools before launch, payments only when you’re ready to sell.
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
      This is not for people who want everything automated or AI-driven.
It’s for founders who want clarity and control.
    </h2>
    <p className="text-gray-600 mb-10">
      This is for people who want to build with intention, using only the tools that truly help them move forward.
    </p>

    <div className="grid sm:grid-cols-2 gap-6 mb-12">
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
    
    {/* Updated section with better styling to match and stand out */}
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-200 to-cyan-100 border border-emerald-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-start justify-center gap-4">
          <div className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-black text-white text-xl font-bold">
            ✓
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-black mb-2">
              From idea to launch — in one place
            </h3>
            <p className="text-emerald-900">
              Whether you're building a <span className="font-semibold">physical product</span> or a <span className="font-semibold">digital product</span>, 
              mywoki helps you find the right tools, connect with your first users, 
              and follow the exact next steps to validate and launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ================= PRODUCTS ================= */}
<section id="products" className="py-28 bg-slate-950 text-slate-100">
  <div className="max-w-6xl mx-auto px-6">

    {/* Section header */}
    <div className="max-w-3xl mb-16">
      <h2 className="text-4xl font-bold mb-4">
        Start with clarity.
      </h2>
      <p className="text-slate-300 text-lg">
        Mywoki is built as a progression. You don’t unlock everything at once.
        You start where every serious founder should.
      </p>
    </div>

    {/* FEATURED PRODUCT */}
    <div
      id="product-idea-validation"
      className="relative rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 to-emerald-900/10 p-10 mb-20 shadow-xl"
    >
      {/* Badge */}
      <div className="absolute -top-4 left-8 px-4 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow">
        Start here
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Copy */}
        <div>
          <h3 className="text-3xl font-semibold mb-4">
            Business Idea Validation Toolkit
          </h3>

          <p className="text-slate-200 mb-6 text-lg leading-relaxed">
            Before you build, spend money, or commit months — get a clear signal.
            This toolkit helps you validate real demand using structured questions,
            evidence, and decision checkpoints.
          </p>

          <ul className="space-y-3 text-slate-300 text-sm mb-8">
            <li>• Identify the real problem you’re solving</li>
            <li>• Test if people are already paying for alternatives</li>
            <li>• Understand who your first customers actually are</li>
            <li>• Decide confidently: proceed, pivot, or stop</li>
          </ul>

          <Link
            to="/login"
            onClick={handleStartClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition shadow"
          >
            Start validation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Visual / placeholder */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-slate-300">
          <p className="text-sm font-medium mb-2 text-emerald-300">
            What you get
          </p>
          <p className="text-sm leading-relaxed">
            A guided flow that turns uncertainty into a clear next step.
            No AI guesses. No vanity metrics. Just structured thinking
            and real-world signals.
          </p>
        </div>
      </div>
    </div>

    {/* SECONDARY TOOLS */}
    <div className="mb-10">
      <h4 className="text-lg font-semibold mb-2">
        Unlock more as you progress
      </h4>
      <p className="text-slate-400 text-sm max-w-xl">
        Once you validate, Mywoki gradually introduces the right tools
        for your next stage — not before.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products
        .filter(p => !p.featured)
        .map(product => {
          const Icon = product.icon
          return (
            <div
              key={product.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-slate-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-4 h-4 text-emerald-400" />
                <h5 className="font-medium text-slate-100 text-sm">
                  {product.shortTitle}
                </h5>
              </div>
              <p className="text-xs text-slate-400">
                Available when it becomes relevant.
              </p>
            </div>
          )
        })}
    </div>
  </div>
</section>

     {/* ================= PRICING ================= */}
<section id="pricing" className="bg-gray-50 py-24">
  <div className="max-w-6xl mx-auto px-6">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
      <div>
        <h2 className="text-3xl font-bold mb-3">
          Transparent pricing for every stage
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Tools are priced by plan. Start with Starter, then scale into Core or Growth
          when you need more activations and support.
        </p>
      </div>

      
    </div>

    {/* Philosophical pricing framing */}
    <div className="max-w-3xl mx-auto mb-16">
      <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <p className="text-xl font-semibold text-gray-900 mb-2">
          You’re not paying for software.
        </p>
        <p className="text-gray-700">
          You’re paying for clarity, timing, and fewer wrong decisions —
          so you can move forward without second-guessing every step.
        </p>
      </div>
    </div>

    {/* Plans */}
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
            <p className="text-sm text-gray-500 mb-4">
              or ${plan.yearly}/year
            </p>
          )}

          <ul className="text-sm text-gray-600 space-y-2 mb-6">
            {plan.features.map((feature) => (
              <li key={feature}>– {feature}</li>
            ))}
          </ul>

          <Link
            to="/login"
            onClick={handleStartClick}
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
                onClick={handleStartClick}
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
            Ready to validate and launch — calmly?
          </h2>
          <p className="text-gray-700 mb-10 max-w-2xl mx-auto">
            Join thousands who have found a calmer way to work with software
          </p>

          <Link
            to="/login"
            onClick={handleStartClick}
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
              <a href="/status" target="_blank" rel="noopener noreferrer">Status</a>
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
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
          <div className="flex flex-col items-center gap-3">
            <MyWokiLoader />
            <p className="text-sm text-gray-700 dark:text-slate-200">
              Taking you to your dashboard...
            </p>
          </div>
        </div>
      )}
      <ChatWidget />
    </div>
  )
}
