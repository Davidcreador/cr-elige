import { Card, CardContent } from '../ui/card'
import { Loader2 } from 'lucide-react'

export function LoadingComparison() {
  return (
    <Card className="card-elevated">
      <CardContent className="pt-12 pb-12 text-center">
        <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-[#00205B]" />
        <p className="text-[var(--muted-foreground)]">Loading comparison data...</p>
      </CardContent>
    </Card>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <Card className="card-elevated inline-block max-w-md">
        <CardContent className="pt-8 pb-8">
          <p className="text-[var(--muted-foreground)] text-lg">
            {message}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <Card className="card-elevated inline-block max-w-md border-[#EF3340]">
        <CardContent className="pt-8 pb-8">
          <p className="text-[#EF3340] text-lg font-medium">
            {message}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
