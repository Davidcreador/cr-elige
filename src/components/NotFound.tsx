import { Link } from '@tanstack/react-router'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

export function NotFound() {
  return (
    <div className="min-h-screen bg-white py-12 px-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="border-gray-200">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <Home className="h-16 w-16 mx-auto text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Candidate Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The candidate you're looking for doesn't exist or hasn't been added yet.
            </p>
            <Link to="/candidates">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Candidates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
