// src/pages/SammyNathanPage.tsx
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  BookOpen,
  
  ArrowRight,
  ExternalLink,
  Sparkles,
  
  ChevronUp,
  Send,
  Quote
} from 'lucide-react'
import { Link } from 'react-router-dom'



function SocialLink({ icon: Icon, href }: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition-transform hover:scale-110"
    >
      <Icon className="w-5 h-5" />
    </a>
  )
}



export default function SammyNathanPage() {
  const [showContact, setShowContact] = useState(false)

  return (
    <>
      <Helmet>
        <title>Sammy Nathan — Product, Systems & Growth Strategy</title>
        <meta
          name="description"
          content="Sammy Nathan helps individuals and teams design calm, effective systems for building products, software, and sustainable growth."
        />
        <meta
          name="keywords"
          content="Sammy Nathan, product strategy, systems thinking, software consultant, growth strategy, digital systems"
        />
        <link rel="canonical" href="https://sammy-nathan.mywoki.com" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sammy Nathan",
            "jobTitle": "Product & Systems Strategist",
            "url": "https://sammy-nathan.mywoki.com",
            "sameAs": [
              "https://medium.com/@sammynathan",
              "https://linkedin.com/in/sammynathan",
              "https://twitter.com/sammynathan",
              "https://instagram.com/sammynathan"
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        {/* HERO */}
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Building calm systems since 2020</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block">I design calm systems</span>
                <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  for meaningful work
                </span>
              </h1>

              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Helping individuals and teams build with clarity using intentional systems,
                focused tools, and sustainable growth practices—without the chaos.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  onClick={() => setShowContact(true)}
                  className="group px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  Start a conversation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/content"
                  className="px-8 py-4 border-2 border-slate-200 rounded-xl font-semibold hover:bg-white transition-all duration-300 hover:shadow-lg hover:border-emerald-200 inline-flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Explore my writing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR
        <div className="bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard
                icon={FileText}
                value={stats.totalContent}
                label="Published Pieces"
                color="emerald"
              />
              <StatCard
                icon={BookOpen}
                value={stats.essays}
                label="Deep Essays"
                color="blue"
              />
              <StatCard
                icon={Target}
                value={stats.guides}
                label="Practical Guides"
                color="amber"
              />
              <StatCard
                icon={Shield}
                value={stats.premiumContent}
                label="Premium Resources"
                color="violet"
              />
            </div>
          </div>
        </div> */}

        {/* HOW I WORK */}
        <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How I think & work</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Building isn't about more software—it's about intentional clarity. 
                My approach helps you simplify decisions and align tools with purpose.
              </p>
            </div>

            {/* <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: 'Product clarity',
                  description: 'Turn ideas into focused, buildable products with clear pathways.',
                  color: 'emerald'
                },
                {
                  icon: Users,
                  title: 'Tool systems',
                  description: 'Choose and configure software intentionally for your team.',
                  color: 'blue'
                },
                {
                  icon: TrendingUp,
                  title: 'Sustainable growth',
                  description: 'Growth that respects your team, focus, and sanity.',
                  color: 'amber'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-${item.color}-100 text-${item.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>*/}
          </div> 
        </section>



        {/* CONTENT TYPES */}
        {/* <section className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Ways to engage
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Essays & thinking",
                  description: "Long-form writing about systems, clarity, and building meaningful work.",
                  count: stats.essays,
                  color: "emerald"
                },
                {
                  icon: BookOpen,
                  title: "Guides & frameworks",
                  description: "Practical frameworks and step-by-step guides you can implement today.",
                  count: stats.guides,
                  color: "blue"
                },
                {
                  icon: Video,
                  title: "Video content",
                  description: "Visual breakdowns and walkthroughs (coming soon).",
                  count: 0,
                  color: "violet"
                }
              ].map((type, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-${type.color}-100 text-${type.color}-600 mb-6`}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                  <p className="text-slate-600 mb-4">{type.description}</p>
                  <div className="text-sm text-slate-500">
                    {type.count} {type.count === 1 ? 'piece' : 'pieces'} available
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* TESTIMONIALS */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What people say</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Working with teams and individuals who value clarity and intentional systems.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "Sammy helped us transform our chaotic product development process into a clear, systematic approach. The frameworks he provided are still guiding our decisions months later.",
                  author: "Sarah Chen",
                  role: "Product Manager",
                  company: "TechFlow Inc."
                },
                {
                  quote: "The systems thinking approach completely changed how we approach growth. Instead of throwing more tools at problems, we now have clarity on what actually matters.",
                  author: "Marcus Rodriguez",
                  role: "Founder",
                  company: "GrowthLabs"
                },
                {
                  quote: "Working with Sammy was like having a calm voice in the middle of product chaos. His frameworks helped us focus on what truly drives value for our users.",
                  author: "Emma Thompson",
                  role: "Head of Product",
                  company: "InnovateCorp"
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow"
                >
                  <Quote className="w-8 h-8 text-emerald-600 mb-4" />
                  <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Let's build something meaningful</span>
            </div>

            <h2 className="text-5xl font-bold">
              Ready for clarity?
            </h2>

            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              If you're building something that matters and want to do it with intention—I'd love to help.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowContact(true)}
                className="px-10 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-slate-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start a conversation
              </button>

              <a
                href="https://cal.com/sammynathan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 border-2 border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Book a call
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Stay updated</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Get notified when I publish new essays, guides, and frameworks for building with intention.
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                No spam, unsubscribe anytime. Your email stays private.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 px-6 bg-slate-900 text-slate-400">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-lg font-semibold text-white mb-2">Sammy Nathan</p>
                <p>Product, Systems & Growth Strategy</p>
              </div>
              
              <div className="flex items-center gap-6">
                <SocialLink icon={BookOpen} href="https://medium.com/@sammynathan" />
                <SocialLink icon={Linkedin} href="https://linkedin.com/in/sammynathan" />
                <SocialLink icon={Twitter} href="https://twitter.com/sammynathan" />
                <SocialLink icon={Instagram} href="https://instagram.com/sammynathan" />
                <a
                  href="mailto:nathans-contact@mywoki.com"
                  className="hover:text-white transition"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
              <p>© {new Date().getFullYear()} Sammy Nathan. All rights reserved.</p>
              <p className="mt-2">Part of the mywoki ecosystem</p>
            </div>
          </div>
        </footer>

        {/* CONTACT MODAL */}
        {showContact && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 animate-fadeIn backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-slideUp">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Get in touch</h3>
                  <p className="text-slate-600">Let's talk about your project</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-semibold text-slate-700 mb-2">Email me directly:</p>
                  <a
                    href="mailto:nathans-contact@mywoki.com"
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-lg"
                  >
                    nathans-contact@mywoki.com
                  </a>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-semibold text-slate-700 mb-2">Or book a call:</p>
                  <a
                    href="https://cal.com/sammynathan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium text-lg inline-flex items-center gap-2"
                  >
                    cal.com/sammynathan
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => setShowContact(false)}
                className="mt-8 w-full py-3 border border-slate-300 rounded-xl font-medium hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* BACK TO TOP BUTTON */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:scale-110 transition-all duration-300 z-40"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>
    </>
  )
}


