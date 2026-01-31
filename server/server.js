import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import crypto from "crypto"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json()) // for frontend verification
app.use(express.raw({ type: "application/json" })) // for webhook raw body

const PORT = process.env.PORT || 4000
const DODO_SECRET_KEY = process.env.DODO_SECRET_KEY
const DODO_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET
const EXPECTED_AMOUNT = 500
const EXPECTED_CURRENCY = "USD"

// ------------------------
// POST /api/verify-dodo-payment
// ------------------------
app.post("/api/verify-dodo-payment", async (req, res) => {
  try {
    const { transactionId, email, plan } = req.body
    if (!transactionId) return res.status(400).json({ success: false, message: "Missing transactionId" })

    const response = await fetch(`https://api.dodopayments.com/v1/transactions/${transactionId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${DODO_SECRET_KEY}`, "Content-Type": "application/json" }
    })

    if (!response.ok) throw new Error("Dodo API failed")

    const verification = await response.json()
    const isValid =
      verification.status === "completed" &&
      verification.amount === EXPECTED_AMOUNT &&
      verification.currency === EXPECTED_CURRENCY

    if (!isValid) return res.status(400).json({ success: false, message: "Payment verification failed" })

    // TODO: Save subscription in DB, mark user as premium, prevent transaction reuse
    return res.json({
      success: true,
      message: "Subscription activated",
      plan,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Server error" })
  }
})

// ------------------------
// POST /webhook/dodo
// ------------------------
app.post("/webhook/dodo", (req, res) => {
  try {
    const signature = req.headers["dodo-signature"]
    const expectedSignature = crypto
      .createHmac("sha256", DODO_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex")

    if (signature !== expectedSignature) return res.status(401).json({ message: "Invalid signature" })

    const event = JSON.parse(req.body.toString())

    if (event.type === "payment.completed") {
      const { transactionId, amount, currency, customerEmail } = event.data
      if (amount === EXPECTED_AMOUNT && currency === EXPECTED_CURRENCY) {
        console.log("Subscription activated via webhook for:", customerEmail)
        // TODO: Save subscription in DB
      }
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error("Webhook error:", err)
    res.status(500).json({ error: "Webhook failure" })
  }
})

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
