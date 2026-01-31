import { Button } from './ui/button'
import { Card } from './ui/card'

export function PauseSubscriptionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 text-gray-900">
      <Card className="p-6 max-w-md w-full space-y-6">
        <h2 className="text-xl font-semibold  text-gray-900">
          Take a pause — nothing breaks
        </h2>

        <p className="text-sm text-gray-600">
          Your tools and data stay safe.  
          You can come back anytime without setup or pressure.
        </p>

        <div className="space-y-3">
          <Button className="w-full">
            Pause subscription
          </Button>
          <Button variant="outline" className="w-full">
            Downgrade to Starter
          </Button>
          <Button
            variant="ghost"
            className="w-full text-red-600"
          >
            Cancel completely
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full text-gray-500"
          onClick={onClose}
        >
          Never mind
        </Button>
      </Card>
    </div>
  )
}
