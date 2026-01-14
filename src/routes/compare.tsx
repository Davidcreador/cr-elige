import { createFileRoute } from '@tanstack/react-router'
import { Printer, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useI18n } from '../lib/i18n'
import { getAllCandidates, type Candidate } from '../lib/candidate-data'

export const Route = createFileRoute('/compare')({
  component: Compare,
  loader: () => {
    const candidates = getAllCandidates()
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
    Left: 'bg-red-100 text-red-800',
    'Center-Left': 'bg-orange-100 text-orange-800',
    Center: 'bg-gray-100 text-gray-800',
    'Center-Right': 'bg-blue-100 text-blue-800',
    Right: 'bg-indigo-100 text-indigo-800',
  }

  const clearSelection = () => {
    setSelected1('')
    setSelected2('')
    setSelected3('')
  }

  const handlePrint = () => {
    window.print()
  }

  const getCandidateContent = (candidate: Candidate | undefined, section: 'priorities' | 'economicFiscal' | 'socialPrograms' | 'infrastructure') => {
    if (!candidate) return null

    const contentMap = {
      priorities: candidate.priorities,
      economicFiscal: candidate.economicFiscal,
      socialPrograms: candidate.socialPrograms,
      infrastructure: candidate.infrastructure,
    }

    const content = contentMap[section] || ''

    const items = content
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.replace(/^- \*\*/, '').replace(/\*\*:$/, '').replace(/^- /, '').trim())
      .slice(0, 5)

    if (items.length === 0) {
      return <p className="text-gray-500 italic text-sm">No information available</p>
    }

    return (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-700 leading-relaxed">
            <span className="font-medium text-gray-900">•</span> {item}
          </li>
        ))}
      </ul>
    )
  }

  const selectedCandidates = [candidate1, candidate2, candidate3].filter((c): c is Candidate => c !== undefined)

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.compare.title}</h1>
              <p className="text-gray-600">{t.home.heroSubtitle}</p>
            </div>
            <div className="flex gap-2">
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

        <div className="mb-8">
          <Card className="border-gray-200">
            <CardContent className="pt-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.compare.select1}
                  </label>
                  <Select value={selected1} onValueChange={setSelected1}>
                    <SelectTrigger>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.compare.select2}
                  </label>
                  <Select value={selected2} onValueChange={setSelected2}>
                    <SelectTrigger>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.compare.select3}
                  </label>
                  <Select value={selected3} onValueChange={setSelected3}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.compare.selectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t.compare.select3}</SelectItem>
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="priorities">{t.compare.tabs.priorities}</TabsTrigger>
              <TabsTrigger value="economicFiscal">{t.compare.tabs.economicFiscal}</TabsTrigger>
              <TabsTrigger value="socialPrograms">{t.compare.tabs.socialPrograms}</TabsTrigger>
              <TabsTrigger value="infrastructure">{t.compare.tabs.infrastructure}</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="priorities">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCandidates.map((candidate) => (
                    <Card key={candidate.slug} className="border-gray-200">
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
                    <Card key={candidate.slug} className="border-gray-200">
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
                    <Card key={candidate.slug} className="border-gray-200">
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
                    <Card key={candidate.slug} className="border-gray-200">
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
          <div className="text-center py-12">
            <Card className="border-gray-200 bg-gray-50 inline-block">
              <CardContent className="pt-6 pb-6">
                <p className="text-gray-600">
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
