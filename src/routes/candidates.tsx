import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { useI18n } from '../lib/i18n'
import { getAllCandidates, filterCandidates, sortCandidates } from '../lib/candidate-data'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export const Route = createFileRoute('/candidates')({
  component: Candidates,
  loader: () => {
    const candidates = getAllCandidates()
    return { candidates }
  },
})

function Candidates() {
  const { candidates: initialCandidates } = Route.useLoaderData()
  const [search, setSearch] = useState('')
  const [ideologyFilter, setIdeologyFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState('name-asc')
  const t = useI18n()

  const filtered = filterCandidates(initialCandidates, { search, ideology: ideologyFilter === 'all' ? undefined : ideologyFilter })
  const sorted = sortCandidates(filtered, sortBy)

  const ideologyColors: Record<string, string> = {
    Left: 'bg-red-100 text-red-800 hover:bg-red-200',
    'Center-Left': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    Center: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    'Center-Right': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    Right: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  }

  const ideologies = ['all', 'Left', 'Center-Left', 'Center', 'Center-Right', 'Right'] as const

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.nav.candidates}</h1>
          <p className="text-gray-600">{t.home.heroSubtitle}</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t.candidates.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t.candidates.sort} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">{t.candidates.sortOptions['name-asc']}</SelectItem>
                <SelectItem value="name-desc">{t.candidates.sortOptions['name-desc']}</SelectItem>
                <SelectItem value="ideology-asc">{t.candidates.sortOptions['ideology-asc']}</SelectItem>
                <SelectItem value="ideology-desc">{t.candidates.sortOptions['ideology-desc']}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 py-2">{t.candidates.filter}</span>
            {ideologies.map((ideology) => (
              <Button
                key={ideology}
                variant={ideologyFilter === ideology ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIdeologyFilter(ideology)}
              >
                {ideology === 'all' ? t.candidates.filters.all : t.candidates.filters[ideology as keyof typeof t.candidates.filters]}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map((candidate) => (
            <Card key={candidate.slug} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{candidate.displayName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{candidate.party}</p>
                    <Badge className={ideologyColors[candidate.ideology]}>
                      {candidate.ideology === 'Center-Left'
                        ? t.candidates.filters['center-left']
                        : candidate.ideology === 'Center-Right'
                        ? t.candidates.filters['center-right']
                        : t.candidates.filters[candidate.ideology.toLowerCase() as keyof typeof t.candidates.filters] || candidate.ideology}
                    </Badge>
                  </div>
                  <Link to={`/candidate/$slug`} params={{ slug: candidate.slug }}>
                    <Button variant="outline" size="sm" className="w-full">
                      {t.candidates.viewPlan}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No candidates match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
