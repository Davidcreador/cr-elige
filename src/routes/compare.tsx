import { createFileRoute } from '@tanstack/react-router'
import { Printer, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useI18n } from '../lib/i18n'
import type { Candidate } from '../lib/candidate-data.client'
import { getAllCandidates } from '../lib/candidate-data.functions'
import { MarkdownContent } from '../components/MarkdownContent'

export const Route = createFileRoute('/compare')({
  component: Compare,
  loader: async () => {
    const candidates = await getAllCandidates()
    return { candidates }
  },
})

function Compare() {
  const { candidates } = Route.useLoaderData()
  const t = useI18n()
  const [selected1, setSelected1] = useState<string>('')
  const [selected2, setSelected2] = useState<string>('')
  const [selected3, setSelected3] = useState<string>('')
  const [activeTab, setActiveTab] = useState('priorities')

  const candidate1 = candidates.find((c) => c.slug === selected1)
  const candidate2 = candidates.find((c) => c.slug === selected2)
  const candidate3 = candidates.find((c) => c.slug === selected3)

  const ideologyColors: Record<string, string> = {
    Left: 'bg-gradient-to-br from-[#EF3340] to-[#ff5a63] text-white',
    'Center-Left': 'bg-gradient-to-br from-[#335288] to-[#4a6b9f] text-white',
    Center: 'bg-gradient-to-br from-[#00205B] to-[#1a3a7a] text-white',
    'Center-Right': 'bg-gradient-to-br from-[#335288] to-[#4a6b9f] text-white',
    Right: 'bg-gradient-to-br from-[#00205B] to-[#1a3a7a] text-white',
  }

  const clearSelection = () => {
    setSelected1('')
    setSelected2('')
    setSelected3('')
  }

  const handlePrint = () => {
    window.print()
  }

  const getCandidateContent = (candidate: Candidate | undefined, section: keyof Pick<Candidate, 'priorities' | 'economicFiscal' | 'socialPrograms' | 'infrastructure'>) => {
    if (!candidate) return null

    const content = candidate[section] || ''
    return <MarkdownContent content={content} className="text-sm" />
  }

  const selectedCandidates = [candidate1, candidate2, candidate3].filter((c): c is Candidate => c !== undefined)

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="display-large mb-3">{t.compare.title}</h1>
              <p className="lead text-[var(--muted-foreground)]">{t.home.heroSubtitle}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={clearSelection} disabled={!selected1 && !selected2 && !selected3}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t.compare.clear}
              </Button>
              <Button onClick={handlePrint} disabled={selectedCandidates.length === 0}>
                <Printer className="mr-2 h-4 w-4" />
                {t.compare.print}
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <Card className="card-elevated">
            <CardContent className="pt-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                    {t.compare.select1}
                  </label>
                  <Select value={selected1} onValueChange={setSelected1}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder={t.compare.selectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates
                        .filter((c) => c.slug !== selected2 && c.slug !== selected3)
                        .map((candidate) => (
                          <SelectItem key={candidate.slug} value={candidate.slug}>
                            {candidate.displayName} ({candidate.party})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                    {t.compare.select2}
                  </label>
                  <Select value={selected2} onValueChange={setSelected2}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder={t.compare.selectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates
                        .filter((c) => c.slug !== selected1 && c.slug !== selected3)
                        .map((candidate) => (
                          <SelectItem key={candidate.slug} value={candidate.slug}>
                            {candidate.displayName} ({candidate.party})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                    {t.compare.select3}
                  </label>
                  <Select value={selected3} onValueChange={setSelected3}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder={t.compare.selectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates
                        .filter((c) => c.slug !== selected1 && c.slug !== selected2)
                        .map((candidate) => (
                          <SelectItem key={candidate.slug} value={candidate.slug}>
                            {candidate.displayName} ({candidate.party})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedCandidates.length >= 2 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-12 rounded-lg">
              <TabsTrigger value="priorities">{t.compare.tabs.priorities}</TabsTrigger>
              <TabsTrigger value="economicFiscal">{t.compare.tabs.economicFiscal}</TabsTrigger>
              <TabsTrigger value="socialPrograms">{t.compare.tabs.socialPrograms}</TabsTrigger>
              <TabsTrigger value="infrastructure">{t.compare.tabs.infrastructure}</TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="priorities">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCandidates.map((candidate) => (
                    <Card key={candidate.slug} className="card-elevated">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{candidate.displayName}</span>
                          <Badge className={ideologyColors[candidate.ideology]}>
                            {candidate.ideology}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {getCandidateContent(candidate, 'priorities')}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="economicFiscal">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCandidates.map((candidate) => (
                    <Card key={candidate.slug} className="card-elevated">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{candidate.displayName}</span>
                          <Badge className={ideologyColors[candidate.ideology]}>
                            {candidate.ideology}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {getCandidateContent(candidate, 'economicFiscal')}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="socialPrograms">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCandidates.map((candidate) => (
                    <Card key={candidate.slug} className="card-elevated">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{candidate.displayName}</span>
                          <Badge className={ideologyColors[candidate.ideology]}>
                            {candidate.ideology}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {getCandidateContent(candidate, 'socialPrograms')}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="infrastructure">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCandidates.map((candidate) => (
                    <Card key={candidate.slug} className="card-elevated">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{candidate.displayName}</span>
                          <Badge className={ideologyColors[candidate.ideology]}>
                            {candidate.ideology}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {getCandidateContent(candidate, 'infrastructure')}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        )}

        {selectedCandidates.length < 2 && selectedCandidates.length > 0 && (
          <div className="text-center py-16">
            <Card className="card-elevated inline-block">
              <CardContent className="pt-8 pb-8">
                <p className="text-[var(--muted-foreground)] text-lg">
                  {selectedCandidates.length === 1
                    ? 'Select at least one more candidate to compare'
                    : 'Select at least two candidates to compare'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
