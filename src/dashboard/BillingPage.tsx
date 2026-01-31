import { useState, useEffect } from 'react'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { plans, type PlanId } from '../lib/plans'
import { supabase } from '../lib/supabase'

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [currentPlan, setCurrentPlan] = useState<PlanId>('starter')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserPlan = async () => {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('plan')
            .eq('id', userId)
            .single();
          
          if (error) throw error;

          if (data && data.plan) {
            setCurrentPlan(data.plan);
          }
        } catch (error) {
          console.error('Error fetching user plan:', error);
        }
      }
      setLoading(false);
    };

    fetchUserPlan();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading billing details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Choose your pace
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
          Upgrade only when it feels right.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center gap-3">
        <Button
          variant={billingCycle === 'monthly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('monthly')}
          className="dark:border-gray-700 dark:text-gray-300 px-6 py-2"
        >
          Monthly
        </Button>
        <Button
          variant={billingCycle === 'yearly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('yearly')}
          className="dark:border-gray-700 dark:text-gray-300 px-6 py-2 relative"
        >
          Yearly
          <Badge className="ml-2 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-2 py-0.5 text-xs">
            Save 16%
          </Badge>
        </Button>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8 relative">
        {(Object.keys(plans) as PlanId[]).map((id) => {
          const plan = plans[id]
          const price =
            billingCycle === 'yearly' && plan.yearly
              ? `$${plan.yearly}/year`
              : `$${plan.price}/month`
          
          const isRecommended = plan.recommended
          const isCurrentPlan = id === currentPlan

          return (
            <div key={id} className="relative">
              {/* Recommended Highlight */}
              {isRecommended && (
                <>
                  {/* Animated gradient border */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  
                  {/* Floating badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-4 py-1.5 rounded-full shadow-lg animate-bounce">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-semibold text-sm">Most Popular</span>
                    </div>
                  </div>
                </>
              )}

              <Card
                className={`relative p-8 space-y-7 transition-all duration-300 hover:scale-[1.02] ${
                  isRecommended 
                    ? 'border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-emerald-950/40 dark:via-gray-900 dark:to-green-950/40 shadow-xl shadow-emerald-100 dark:shadow-emerald-900/20' 
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                } ${isCurrentPlan ? 'ring-2 ring-emerald-300 dark:ring-emerald-700' : ''}`}
              >
                {isRecommended && (
                  <div className="absolute top-4 right-4">
                    <div className="animate-pulse">
                      <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 px-3 py-1">
                        RECOMMENDED
                      </Badge>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className={`text-2xl font-bold ${
                    isRecommended 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {plan.note}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {price}
                  </div>
                  {billingCycle === 'yearly' && plan.yearly && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      ${Math.round(plan.yearly / 12)}/month
                    </p>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li 
                      key={f} 
                      className={`flex items-center gap-3 text-sm ${
                        isRecommended 
                          ? 'text-gray-800 dark:text-gray-200' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Check className={`w-5 h-5 ${
                        isRecommended 
                          ? 'text-emerald-500 dark:text-emerald-400' 
                          : 'text-emerald-600 dark:text-emerald-500'
                      }`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 font-semibold text-base ${
                    isRecommended 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white shadow-md hover:shadow-lg' 
                      : ''
                  }`}
                  variant={isCurrentPlan ? 'outline' : isRecommended ? 'default' : 'default'}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Get Started'}
                  <ArrowRight className={`w-4 h-4 ml-2 ${
                    isRecommended ? 'animate-pulse' : ''
                  }`} />
                </Button>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Cancel copy */}
      <Card className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 text-center border-gray-200 dark:border-gray-800 rounded-2xl">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          You can pause or downgrade anytime.
          <br />
          <span className="font-medium text-gray-900 dark:text-white">
            Nothing breaks. Your tools stay safe.
          </span>
        </p>
      </Card>
    </div>
  )
}