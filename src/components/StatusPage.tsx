import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { supabase } from "../lib/supabase"
import {
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock
} from "lucide-react"
import useMaintenanceMode from "../hooks/useMaintenanceMode"

type Incident = {
  id: string
  title: string
  description: string | null
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "monitoring" | "resolved"
  created_at: string
  component?: string | null
  updated_at?: string | null
}

type ToolIssue = {
  id: string
  name: string
  issues: string[]
}

const COMPONENTS = [
  { id: "api", name: "API" },
  { id: "dashboard", name: "Dashboard" },
  { id: "storage", name: "Storage" },
  { id: "tools", name: "Tools" },
  { id: "realtime", name: "Realtime" }
]

const DAYS_IN_VIEW = 90
const severityRank: Record<Incident["severity"], number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
}

const dayKey = (date: Date) => date.toISOString().split("T")[0]

const buildDayRange = () => {
  const days: Date[] = []
  const today = new Date()
  for (let i = DAYS_IN_VIEW - 1; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    days.push(date)
  }
  return days
}

export default function StatusPage() {
  const maintenanceMode = useMaintenanceMode()
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null)
  const [toolIssues, setToolIssues] = useState<ToolIssue[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedPoint, setSelectedPoint] = useState<{
    componentId: string
    dateKey: string
    tone: string
  } | null>(null)

  const loadStatus = async () => {
    const { data: active } = await supabase
      .from("incidents")
      .select("id, title, description, severity, status, created_at, updated_at, component")
      .in("status", ["open", "monitoring"])
      .order("created_at", { ascending: false })
      .limit(1)

    const { data } = await supabase
      .from("incidents")
      .select("id, title, description, severity, status, created_at, updated_at, component")
      .order("created_at", { ascending: false })
      .limit(20)

    const { data: tools } = await supabase
      .from("tools")
      .select("id, name, issues")

    const issues = (tools || []).filter((tool) => Array.isArray(tool.issues) && tool.issues.length > 0) as ToolIssue[]

    setActiveIncident(active?.[0] ?? null)
    setIncidents(data || [])
    setToolIssues(issues)
  }

  useEffect(() => {
    loadStatus()

    const channel = supabase
      .channel("status-page-incidents")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incidents"
        },
        () => loadStatus()
      )
      .subscribe()

    const interval = setInterval(() => setLastUpdated(new Date()), 60_000)

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  const overallStatus = maintenanceMode
    ? { label: "Maintenance in progress", tone: "amber" }
    : activeIncident
      ? { label: "Partial outage", tone: "rose" }
      : toolIssues.length > 0
        ? { label: "Degraded performance", tone: "amber" }
        : { label: "All systems operational", tone: "emerald" }

  const statusIcon =
    overallStatus.tone === "emerald"
      ? <CheckCircle className="h-5 w-5 text-emerald-600" />
      : overallStatus.tone === "amber"
        ? <Clock className="h-5 w-5 text-amber-600" />
        : <AlertTriangle className="h-5 w-5 text-rose-600" />

  const dayRange = buildDayRange()
  const buildIncidentMap = (filterFn?: (incident: Incident) => boolean) =>
    incidents.reduce<Record<string, Incident>>((acc, incident) => {
      if (filterFn && !filterFn(incident)) {
        return acc
      }
      const key = dayKey(new Date(incident.created_at))
      const existing = acc[key]
      if (!existing || severityRank[incident.severity] > severityRank[existing.severity]) {
        acc[key] = incident
      }
      return acc
    }, {})

  const incidentByDayAll = buildIncidentMap()

  const buildBars = (incidentMap: Record<string, Incident>) =>
    dayRange.map((date) => {
      const key = dayKey(date)
      const incident = incidentMap[key]
      if (!incident) {
        return { key, tone: "emerald" }
      }
      if (severityRank[incident.severity] >= 3) {
        return { key, tone: "rose" }
      }
      return { key, tone: "amber" }
    })

  const uptimeBars = buildBars(incidentByDayAll)

  if (uptimeBars.length > 0) {
    const lastIndex = uptimeBars.length - 1
    if (maintenanceMode) {
      uptimeBars[lastIndex] = { ...uptimeBars[lastIndex], tone: "amber" }
    } else if (activeIncident) {
      uptimeBars[lastIndex] = { ...uptimeBars[lastIndex], tone: "rose" }
    } else if (toolIssues.length > 0) {
      uptimeBars[lastIndex] = { ...uptimeBars[lastIndex], tone: "amber" }
    }
  }

  const operationalDays = uptimeBars.filter((bar) => bar.tone === "emerald").length
  const uptimePercent = Number(((operationalDays / DAYS_IN_VIEW) * 100).toFixed(2))

  const toneToClass = (tone: string) => {
    if (tone === "rose") return "bg-rose-500"
    if (tone === "amber") return "bg-amber-400"
    return "bg-emerald-400"
  }

  const toneToBadge = (tone: string) => {
    if (tone === "rose") return "bg-rose-50 text-rose-700 border-rose-200"
    if (tone === "amber") return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-emerald-50 text-emerald-700 border-emerald-200"
  }

  const incidentTone = (severity: Incident["severity"]) => {
    if (severity === "critical" || severity === "high") return "rose"
    if (severity === "medium") return "amber"
    return "emerald"
  }

  const toneLabel = (tone: string) => {
    if (tone === "rose") return "Outage"
    if (tone === "amber") return "Degraded"
    return "Operational"
  }

  const formatDateKey = (key: string) =>
    new Date(`${key}T00:00:00`).toLocaleDateString()

  const formatComponentLabel = (component?: string | null) => {
    const key = (component || "platform").toLowerCase()
    switch (key) {
      case "api": return "API"
      case "dashboard": return "Dashboard"
      case "storage": return "Storage"
      case "tools": return "Tools"
      case "realtime": return "Realtime"
      default: return "Platform"
    }
  }

  const incidentMatchesComponent = (incident: Incident, componentId: string) => {
    const component = (incident.component || "platform").toLowerCase()
    if (component === "platform" || component === "all") return true
    return component === componentId
  }

  const componentBars = (componentId: string) => {
    const incidentMap = buildIncidentMap((incident) =>
      incidentMatchesComponent(incident, componentId)
    )
    const bars = buildBars(incidentMap)
    if (bars.length > 0) {
      const lastIndex = bars.length - 1
      if (maintenanceMode) {
        bars[lastIndex].tone = "amber"
      } else if (activeIncident && incidentMatchesComponent(activeIncident, componentId)) {
        bars[lastIndex].tone = "rose"
      } else if (componentId === "tools" && toolIssues.length > 0 && bars[lastIndex].tone !== "rose") {
        bars[lastIndex].tone = "amber"
      }
    }
    return { bars, incidentMap }
  }

  const statusSummary = `${overallStatus.label}. ${uptimePercent}% uptime over the last 90 days.`
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const statusUrl = baseUrl ? `${baseUrl}/status` : "/status"
  const recentIncidentSummary = incidents.length > 0
    ? `Recent incidents: ${incidents.slice(0, 3).map((incident) => incident.title).join(", ")}.`
    : "No recent incidents reported."

  const statusJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "MyWoki Status",
    url: statusUrl,
    description: `MyWoki system status: ${statusSummary} ${recentIncidentSummary}`.trim(),
    dateModified: new Date().toISOString(),
    about: {
      "@type": "Service",
      name: "MyWoki Platform",
      serviceType: "SaaS"
    },
    mentions: incidents.slice(0, 5).map((incident) => ({
      "@type": "Event",
      name: incident.title,
      startDate: incident.created_at,
      eventStatus: incident.status
    }))
  }), [incidents, recentIncidentSummary, statusSummary, statusUrl])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Helmet>
        <title>MyWoki Status | {overallStatus.label}</title>
        <meta
          name="description"
          content={`MyWoki system status. ${statusSummary} ${recentIncidentSummary}`}
        />
        <link rel="canonical" href={statusUrl} />
        <meta property="og:title" content={`MyWoki Status | ${overallStatus.label}`} />
        <meta
          property="og:description"
          content={`MyWoki system status. ${statusSummary} ${recentIncidentSummary}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={statusUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`MyWoki Status | ${overallStatus.label}`} />
        <meta
          name="twitter:description"
          content={`MyWoki system status. ${statusSummary} ${recentIncidentSummary}`}
        />
        <script type="application/ld+json">
          {JSON.stringify(statusJsonLd)}
        </script>
      </Helmet>
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/mywoki-logo.png"
              alt="MyWoki"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <h1 className="text-2xl font-semibold text-slate-900">MyWoki System Status</h1>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${toneToBadge(overallStatus.tone)}`}>
              {overallStatus.label}
            </span>
            <Link
              to="/"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {statusIcon}
            <div>
              <p className="text-sm text-slate-500">Current status</p>
              <p className="text-lg font-semibold text-slate-900">{overallStatus.label}</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-4 w-4" />
              Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          {activeIncident && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/70 p-4">
              <p className="text-sm font-semibold text-rose-700">
                {activeIncident.title}
              </p>
              <p className="text-xs text-rose-600 mt-1">
                Component: {formatComponentLabel(activeIncident.component)}
              </p>
              {activeIncident.description && (
                <p className="text-sm text-rose-700/90 mt-1">
                  {activeIncident.description}
                </p>
              )}
            </div>
          )}
          {!activeIncident && maintenanceMode && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-700">
              We are performing scheduled maintenance. Thanks for your patience.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Analytics</p>
              <p className="text-xs text-slate-500">Uptime over the last 90 days</p>
            </div>
            <span className={`text-sm font-semibold ${overallStatus.tone === "emerald" ? "text-emerald-600" : overallStatus.tone === "amber" ? "text-amber-600" : "text-rose-600"}`}>
              {overallStatus.tone === "emerald" ? "Operational" : overallStatus.label}
            </span>
          </div>
          <div className="grid gap-2">
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${DAYS_IN_VIEW}, minmax(2px, 1fr))`, columnGap: 2 }}
            >
              {uptimeBars.map((bar) => {
                const isSelected = selectedPoint?.componentId === "platform" && selectedPoint.dateKey === bar.key
                const incident = incidentByDayAll[bar.key]
                return (
                  <button
                    key={bar.key}
                    type="button"
                    className="group relative w-full focus:outline-none"
                    onClick={() => setSelectedPoint({ componentId: "platform", dateKey: bar.key, tone: bar.tone })}
                    title={`${formatDateKey(bar.key)} - ${toneLabel(bar.tone)}`}
                  >
                    <span className={`block h-5 w-full rounded-sm ${toneToClass(bar.tone)} transition-all duration-150 group-hover:opacity-80 group-hover:scale-y-110`} />
                    <span
                      className={`pointer-events-none absolute -top-11 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-lg transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    >
                      <span className={`font-semibold ${bar.tone === "emerald" ? "text-emerald-700" : bar.tone === "amber" ? "text-amber-700" : "text-rose-700"}`}>
                        {toneLabel(bar.tone)}
                      </span>
                      <span className="text-slate-500">{formatDateKey(bar.key)}</span>
                      {incident && <span className="text-slate-500">- {incident.title}</span>}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>90 days ago</span>
              <span className="font-semibold text-slate-700">{uptimePercent}% uptime</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">System components</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            {COMPONENTS.map((component) => {
              const { bars, incidentMap } = componentBars(component.id)
              const latestTone = bars[bars.length - 1]?.tone || "emerald"
              const componentLabel = latestTone === "emerald" ? "Operational" : latestTone === "amber" ? "Degraded" : "Partial outage"
              const isSelected = selectedPoint?.componentId === component.id
              const selectedIncident = isSelected && selectedPoint
                ? incidentMap[selectedPoint.dateKey]
                : null

              return (
                <div key={component.id} className="space-y-2 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity
                        className={`h-4 w-4 ${latestTone === "emerald" ? "text-emerald-500" : latestTone === "amber" ? "text-amber-500" : "text-rose-500"}`}
                      />
                      <span className="font-medium text-slate-900">{component.name}</span>
                    </div>
                    <span className="text-sm text-slate-600">{componentLabel}</span>
                  </div>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: `repeat(${DAYS_IN_VIEW}, minmax(2px, 1fr))`, columnGap: 2 }}
                  >
                    {bars.map((bar) => {
                      const isSelected = selectedPoint?.componentId === component.id && selectedPoint.dateKey === bar.key
                      const incident = incidentMap[bar.key]
                      return (
                        <button
                          key={bar.key}
                          type="button"
                          className="group relative w-full focus:outline-none"
                          onClick={() => setSelectedPoint({ componentId: component.id, dateKey: bar.key, tone: bar.tone })}
                          title={`${formatDateKey(bar.key)} - ${toneLabel(bar.tone)}`}
                        >
                          <span className={`block h-4 w-full rounded-sm ${toneToClass(bar.tone)} transition-all duration-150 group-hover:opacity-80 group-hover:scale-y-110`} />
                          <span
                            className={`pointer-events-none absolute -top-10 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-lg transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                          >
                            <span className={`font-semibold ${bar.tone === "emerald" ? "text-emerald-700" : bar.tone === "amber" ? "text-amber-700" : "text-rose-700"}`}>
                              {toneLabel(bar.tone)}
                            </span>
                            <span className="text-slate-500">{formatDateKey(bar.key)}</span>
                            {incident && <span className="text-slate-500">- {incident.title}</span>}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>90 days ago</span>
                    <span>Today</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Status updates</h2>
          {incidents.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
              No incidents reported.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-6 border-l border-slate-200 pl-6">
                {incidents.map((incident) => {
                  const tone = incidentTone(incident.severity)
                  return (
                    <div key={incident.id} className="relative">
                      <span
                        className={`absolute -left-[13px] top-1.5 h-3 w-3 rounded-full ${toneToClass(tone)}`}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-900">{incident.title}</p>
                        <span className={`text-[11px] uppercase tracking-wide rounded-full border px-2 py-0.5 ${toneToBadge(tone)}`}>
                          {incident.severity}
                        </span>
                        <span className="text-[11px] uppercase tracking-wide rounded-full border border-slate-200 px-2 py-0.5 text-slate-600">
                          {incident.status}
                        </span>
                        <span className="text-[11px] uppercase tracking-wide rounded-full border border-slate-200 px-2 py-0.5 text-slate-600">
                          {formatComponentLabel(incident.component)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(incident.created_at).toLocaleString()}
                      </p>
                      {incident.description && (
                        <p className="text-sm text-slate-600 mt-2">
                          {incident.description}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Tool issues</h2>
          {toolIssues.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
              No reported tool issues.
            </div>
          ) : (
            <div className="space-y-3">
              {toolIssues.map((tool) => (
                <div
                  key={tool.id}
                  className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 shadow-sm"
                >
                  <p className="font-medium text-rose-800">{tool.name}</p>
                  <p className="text-sm text-rose-700 mt-1">
                    {tool.issues[0]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
