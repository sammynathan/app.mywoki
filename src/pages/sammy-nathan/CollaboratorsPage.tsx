import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const FORM_LIMIT = 10
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdagzbzq" // ← replace

export default function CollaboratorsPage() {
  const [count, setCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCount()
  }, [])

  const fetchCount = async () => {
    const { count } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })

    setCount(count || 0)
    setLoading(false)
  }

  const isFull = count >= FORM_LIMIT

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">

        {/* HERO */}
        <section className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white text-3xl font-semibold">
            MW
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            Build Mywoki — Together
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            I’m forming a small, focused group of builders to help shape Mywoki —
            a calm platform for modern work.  
            This is a short, real collaboration with room to learn, ship, and grow.
          </p>
        </section>

        {/* ILLUSTRATIONS */}
        <section className="grid md:grid-cols-3 gap-6">
          {["Design", "Build", "Ship"].map((label, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6 text-center"
            >
              <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4" />
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-600 mt-2">
                Calm collaboration focused on real output.
              </p>
            </div>
          ))}
        </section>

        {/* AVATARS */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Who I’m Looking For
          </h2>

          <div className="flex justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-400 mx-auto"
                  style={{
                    backgroundImage: `radial-gradient(circle at 30% 30%, #fff, #6366f1)`
                  }}
                />
                <p className="mt-2 text-sm text-gray-700">
                  Builder #{i}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DETAILS */}
        <section className="bg-slate-50 rounded-xl p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            What this collaboration is
          </h2>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Short, focused (1 week)</li>
            <li>Hands-on building with AI & modern tools</li>
            <li>Clear direction, calm execution</li>
            <li>Small fulfillment credit provided</li>
            <li>Potential for long-term collaboration</li>
          </ul>
        </section>

        {/* FORM STATUS */}
        {loading ? null : isFull ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
            <h3 className="font-semibold text-emerald-700">
              Applications are currently full
            </h3>
            <p className="text-sm text-emerald-600 mt-2">
              Thanks for the interest — selected applicants will be contacted.
            </p>
          </div>
        ) : submitted ? (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-6 text-center">
            <h3 className="font-semibold text-blue-700">
              Application received
            </h3>
            <p className="text-sm text-blue-600 mt-2">
              I’ll review submissions and reach out soon.
            </p>
          </div>
        ) : (
          /* FORM */
          <section className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Apply to collaborate
            </h2>

            <form
              action={FORMSPREE_ENDPOINT}
              method="POST"
              onSubmit={async () => {
                await supabase.from("applications").insert([
                  { created_at: new Date().toISOString() }
                ])
                setSubmitted(true)
              }}
              className="space-y-4"
            >
              <input type="hidden" name="source" value="mywoki-collaboration" />

              <input
                required
                name="name"
                placeholder="Full name"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                required
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                name="phone"
                placeholder="Phone number"
                className="w-full border rounded-lg px-4 py-2"
              />

              <textarea
                required
                name="skills"
                placeholder="Your skills & tools you use"
                rows={3}
                className="w-full border rounded-lg px-4 py-2"
              />

              <textarea
                name="experience"
                placeholder="Links to work, GitHub, or experience"
                rows={3}
                className="w-full border rounded-lg px-4 py-2"
              />

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800"
              >
                Submit application
              </button>
            </form>
          </section>
        )}

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            FAQs
          </h2>

          <div className="space-y-3 text-gray-700 text-sm">
            <p><strong>Is this remote?</strong> Yes.</p>
            <p><strong>Is this paid?</strong> Yes — fulfillment credit provided.</p>
            <p><strong>Do I need years of experience?</strong> No, clarity & execution matter more.</p>
            <p><strong>Can this lead to more?</strong> Yes, for the right fit.</p>
          </div>
        </section>

      </div>
    </div>
  )
}
