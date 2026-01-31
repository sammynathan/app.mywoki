import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

interface Props {
  activeCount: number
  limit: number
}

export default function UpgradeNudge({ activeCount, limit }: Props) {
  if (activeCount < limit) return null

  return (
    <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-amber-900 dark:text-amber-300">
            You've reached your current limit
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-400 mt-1">
            You're doing good work. Upgrade only if you need more active tools.
          </p>
        </div>
        <Link to="/dashboard/billing">
          <Button 
            size="sm" 
            variant="outline" 
            className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
          >
            View plans
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}