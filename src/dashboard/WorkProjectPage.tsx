// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Briefcase, ChevronDown, ChevronUp, Sparkles, Save } from 'lucide-react'
// import { Button } from './ui/button'
// import { Card } from './ui/card'
// import { supabase } from '../lib/supabase'
// import { useAuth } from '../auth/AuthContext'

// export default function WorkProjectPage() {
//   const navigate = useNavigate()
//   const { userId } = useAuth()

//   const [loading, setLoading] = useState(false)
//   const [showAdvanced, setShowAdvanced] = useState(false)

//   const [project, setProject] = useState({
//     projectType: '',
//     industry: '',
//     description: '',
//     goals: '',
//     challenges: '',
//     targetAudience: '',
//     budget: '',
//     timeline: '',
//   })

//   useEffect(() => {
//     if (!userId) return
//     loadProject()
//   }, [userId])

//   const loadProject = async () => {
//     const { data } = await supabase
//       .from('user_projects')
//       .select('project_data')
//       .eq('user_id', userId)
//       .single()

//     if (data?.project_data) {
//       setProject(data.project_data)
//     }
//   }

//   const update = (key: string, value: string) => {
//     setProject(prev => ({ ...prev, [key]: value }))
//   }

//   const save = async () => {
//     if (!userId) return
//     setLoading(true)

//     await supabase.from('user_projects').upsert({
//       user_id: userId,
//       project_data: project,
//       intent: {
//         projectType: project.projectType,
//         industry: project.industry,
//       },
//       updated_at: new Date().toISOString(),
//     })

//     setLoading(false)
//     navigate('/dashboard')
//   }

//   return (
//     <div className="min-h-[calc(100vh-73px)] bg-[#f7f7f5] px-4 py-10">
//       <div className="max-w-3xl mx-auto space-y-8">

//         {/* Header */}
//         <div className="text-center space-y-3">
//           <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center">
//             <Briefcase className="w-7 h-7 text-emerald-600" />
//           </div>
//           <h1 className="text-2xl font-semibold text-gray-900">
//             Define your work
//           </h1>
//           <p className="text-gray-600 max-w-xl mx-auto">
//             A few details help us recommend tools that actually fit how you work.
//           </p>
//         </div>

//         {/* Project Type */}
//         <Card className="p-6">
//           <h2 className="font-medium text-gray-900 mb-4">
//             What are you working on?
//           </h2>

//           <div className="grid sm:grid-cols-2 gap-4">
//             {[
//               { value: 'startup', label: 'Startup', text: 'Building something new' },
//               { value: 'product', label: 'Product', text: 'Improving or shipping a product' },
//             ].map(option => (
//               <button
//                 key={option.value}
//                 onClick={() => update('projectType', option.value)}
//                 className={`p-4 rounded-xl border text-left transition ${
//                   project.projectType === option.value
//                     ? 'border-emerald-400 bg-emerald-50 shadow-sm'
//                     : 'border-gray-200 hover:border-gray-300 bg-white'
//                 }`}
//               >
//                 <p className="font-medium text-gray-900">{option.label}</p>
//                 <p className="text-sm text-gray-600">{option.text}</p>
//               </button>
//             ))}
//           </div>
//         </Card>

//         {/* Core Info */}
//         <Card className="p-6 space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Industry (optional)
//             </label>
//             <select
//               value={project.industry}
//               onChange={(e) => update('industry', e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-gray-200
//               focus:ring-2 focus:ring-emerald-500 focus:border-transparent
//               bg-white text-gray-900 transition"
//             >
//               <option value="">Select industry</option>
//               {['Technology','Education','Finance','Healthcare','E-commerce','Other'].map(i => (
//                 <option key={i} value={i.toLowerCase()}>{i}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Brief description
//             </label>
//             <textarea
//               rows={4}
//               value={project.description}
//               onChange={(e) => update('description', e.target.value)}
//               placeholder="What are you building and for whom?"
//               className="w-full px-4 py-3 rounded-xl border border-gray-200
//               focus:ring-2 focus:ring-emerald-500 focus:border-transparent
//               bg-white text-gray-900 transition resize-none"
//             />
//           </div>
//         </Card>

//         {/* Optional Details */}
//         <Card className="p-6">
//           <button
//             onClick={() => setShowAdvanced(v => !v)}
//             className="flex items-center justify-between w-full"
//           >
//             <div>
//               <h3 className="font-medium text-gray-900">
//                 Optional details
//               </h3>
//               <p className="text-sm text-gray-600">
//                 Only if you want smarter recommendations
//               </p>
//             </div>
//             {showAdvanced ? <ChevronUp /> : <ChevronDown />}
//           </button>

//           {showAdvanced && (
//             <div className="mt-6 grid sm:grid-cols-2 gap-5">
//               <input
//                 placeholder="Target audience"
//                 value={project.targetAudience}
//                 onChange={(e) => update('targetAudience', e.target.value)}
//                 className="input"
//               />
//               <input
//                 placeholder="Main challenge"
//                 value={project.challenges}
//                 onChange={(e) => update('challenges', e.target.value)}
//                 className="input"
//               />
//               <select
//                 value={project.budget}
//                 onChange={(e) => update('budget', e.target.value)}
//                 className="input"
//               >
//                 <option value="">Budget range</option>
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//               <select
//                 value={project.timeline}
//                 onChange={(e) => update('timeline', e.target.value)}
//                 className="input"
//               >
//                 <option value="">Timeline</option>
//                 <option value="short">1–3 months</option>
//                 <option value="medium">3–6 months</option>
//                 <option value="long">6+ months</option>
//               </select>
//             </div>
//           )}
//         </Card>

//         {/* Save */}
//         <div className="flex justify-end">
//           <Button
//             onClick={save}
//             disabled={loading || !project.projectType}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl"
//           >
//             <Save className="w-4 h-4 mr-2" />
//             {loading ? 'Saving…' : 'Save and continue'}
//           </Button>
//         </div>

//         {/* Hint */}
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <Sparkles className="w-4 h-4 text-emerald-500" />
//           We’ll use this to recommend tools — nothing is final.
//         </div>

//       </div>

//       {/* shared input style */}
//       <style>{`
//         .input {
//           width: 100%;
//           padding: 0.75rem 1rem;
//           border-radius: 0.75rem;
//           border: 1px solid #e5e7eb;
//           background: white;
//           transition: all 0.15s;
//         }
//         .input:focus {
//           outline: none;
//           border-color: transparent;
//           box-shadow: 0 0 0 2px rgb(16 185 129);
//         }
//       `}</style>
//     </div>
//   )
// }
