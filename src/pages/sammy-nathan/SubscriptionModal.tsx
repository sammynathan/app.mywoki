import { useState, useEffect } from 'react'
import { X, Check, Shield, CreditCard } from 'lucide-react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

const DODO_MERCHANT_ID = import.meta.env.VITE_DODO_MERCHANT_ID!
const DODO_CLIENT_KEY = import.meta.env.VITE_DODO_CLIENT_KEY!
const MONTHLY_PRICE_USD = 500 // $5 USD in cents

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (isOpen && !(window as any).DodoPayments) {
      const script = document.createElement('script')
      script.src = 'https://app.dodopayments.com/sdk/v1/dodo-payments.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return alert('Email is required')

    setProcessing(true)

    try {
      // @ts-ignore
      const dodo = new window.DodoPayments({
        key: DODO_CLIENT_KEY,
        merchantId: DODO_MERCHANT_ID,
        amount: MONTHLY_PRICE_USD,
        currency: 'USD',
        customer: { email, phone },
        description: 'Dodo Premium Membership – Monthly',
        reference: `DODO_${Date.now()}`,

        onSuccess: async (res: any) => {
          try {
            // Notify backend (backend will verify securely)
            const verifyResponse = await fetch('http://localhost:4000/api/verify-dodo-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transactionId: res.transactionId,
                email,
                plan: 'monthly_usd_5'
              })
            })
            const data = await verifyResponse.json()
            if (data.success) setSuccess(true)
            else alert('Payment verification failed')
          } catch (err) {
            console.error(err)
            alert('Error verifying payment')
          }
        },

        onError: (err: any) => {
          alert(err?.message || 'Payment failed')
          setProcessing(false)
        },

        onCancel: () => setProcessing(false)
      })

      dodo.openCheckout()
    } catch (err) {
      console.error(err)
      alert('Unable to start payment')
      setProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4"><X /></button>

        {success ? (
          <div className="text-center py-10">
            <Check className="mx-auto text-emerald-600 w-12 h-12" />
            <h3 className="text-2xl font-bold mt-4">Payment Successful</h3>
            <p className="text-slate-600 mt-2">Your $5 monthly subscription is now active.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <Shield className="mx-auto mb-3 text-emerald-600" />
              <h3 className="text-3xl font-bold">Premium Access</h3>
              <p className="text-5xl font-bold text-emerald-700 mt-2">
                $5<span className="text-lg text-slate-500">/month</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full border px-4 py-3 rounded-lg" required />
              <input type="tel" placeholder="+254..." value={phone} onChange={e => setPhone(e.target.value)} className="w-full border px-4 py-3 rounded-lg" />
              <button disabled={processing} className="w-full bg-emerald-600 text-white py-4 rounded-xl flex justify-center items-center gap-2">
                {processing ? 'Redirecting…' : 'Pay $5 with Dodo'} <CreditCard />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
