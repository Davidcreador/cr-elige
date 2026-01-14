import { createFileRoute } from '@tanstack/react-router'
import { Printer, RotateCcw, HelpCircle } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useI18n } from '../lib/i18n'
import type { Candidate } from '../lib/candidate-data.client'
import { getAllCandidates } from '../lib/candidate-data.functions'
import { parseAllCandidates } from '../lib/comparison-parser'
import { extractTopicsFromCandidates, normalizeTopic } from '../lib/topic-extractor'
import {
  compareTopicAcrossCandidates,
  generateComparisonSummary,
  filterByDifferences
} from '../lib/comparison-utils'
import { extractQuantitativeData } from '../lib/quantitative-parser'
import { ComparisonViewToggle } from '../components/compare/ComparisonViewToggle'
import { TopicFilter } from '../components/compare/TopicFilter'
import { ComparisonSummary } from '../components/compare/ComparisonSummary'
import { QuickSummaryCards } from '../components/compare/QuickSummaryCards'
import { ComparisonTable } from '../components/compare/ComparisonTable'
import { ComparisonLegend } from '../components/compare/ComparisonLegend'

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
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false)
  const [activeSection, setActiveSection] = useState<'priorities' | 'economicFiscal' | 'socialPrograms' | 'infrastructure'>('priorities')
  const [showLegend, setShowLegend] = useState(false)

  const candidate1 = candidates.find((c) => c.slug === selected1)
  const candidate2 = candidates.find((c) => c.slug === selected2)
  const candidate3 = candidates.find((c) => c.slug === selected3)
  const selectedCandidates = [candidate1, candidate2, candidate3].filter((c): c is Candidate => c !== undefined)

  const parsedCandidates = useMemo(() => {
    const parsed = parseAllCandidates(selectedCandidates)
    console.log('=== PARSED CANDIDATES ===')
    parsed.forEach((c, idx) => {
      console.log(`Candidate ${idx + 1}:`, c.displayName)
      console.log(`  - priorities topics:`, c.priorities.topics.length)
      console.log(`  - economicFiscal topics:`, c.economicFiscal.topics.length)
      console.log(`  - socialPrograms topics:`, c.socialPrograms.topics.length)
      console.log(`  - infrastructure topics:`, c.infrastructure.topics.length)
    })
    console.log('========================')
    return parsed
  }, [selectedCandidates])

  const extractedTopics = useMemo(() => {
    if (parsedCandidates.length === 0) return []
    const topics = extractTopicsFromCandidates(parsedCandidates)
    console.log('=== EXTRACTED TOPICS ===')
    console.log('Total topics:', topics.length)
    topics.slice(0, 10).forEach((t, idx) => {
      console.log(`${idx + 1}. "${t.name}" (count: ${t.count}, variants: ${Array.isArray(t.variants) ? t.variants.length : '?'})`)
    })
    console.log('========================')
    return topics
  }, [parsedCandidates])

  const filteredTopics = useMemo(() => {
    if (selectedTopics.length === 0) return extractedTopics
    return extractedTopics.filter(topic => selectedTopics.includes(topic.name))
  }, [extractedTopics, selectedTopics])

  const comparisonData = useMemo(() => {
    if (parsedCandidates.length === 0) return []

    console.log('=== COMPARISON DATA DEBUG ===')
    console.log('parsedCandidates:', parsedCandidates.length)
    console.log('filteredTopics:', filteredTopics.length)
    console.log('activeSection:', activeSection)

    const result = filteredTopics.map(topic => {
      const quantDataMap = new Map<string, ReturnType<typeof extractQuantitativeData>>()

      parsedCandidates.forEach(candidate => {
        const section = candidate[activeSection] as any
        if (section?.topics) {
          const topicData = section.topics.find((t: any) => {
            const normalizedCandidateTopic = normalizeTopic(t.topic)
            const matches = normalizedCandidateTopic === topic.name
            if (matches) {
              console.log(`✓ Found match: "${t.topic}" -> "${topic.name}" for ${candidate.displayName}`)
            }
            return matches
          })
          if (topicData) {
            quantDataMap.set(candidate.slug, extractQuantitativeData(topicData.content))
          }
        }
      })

      const comparison = compareTopicAcrossCandidates(parsedCandidates, topic.name, quantDataMap as any)
      console.log(`Topic "${topic.name}" comparison:`, comparison.candidates.size, 'candidates')
      return comparison
    })

    console.log('Result comparisonData length:', result.length)
    console.log('===============================')

    return result
  }, [parsedCandidates, filteredTopics, activeSection])

  const displayComparisons = useMemo(() => {
    if (!showDifferencesOnly) return comparisonData
    return filterByDifferences(comparisonData)
  }, [comparisonData, showDifferencesOnly])

  const summaryData = useMemo(() => {
    if (parsedCandidates.length < 2) return []
    const summary = generateComparisonSummary(parsedCandidates)
    return summary.filter(s => s.items.length > 0)
  }, [parsedCandidates])

  const clearSelection = () => {
    setSelected1('')
    setSelected2('')
    setSelected3('')
    setSelectedTopics([])
    setShowDifferencesOnly(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  const handleClearTopics = () => {
    setSelectedTopics([])
  }

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
              <ComparisonViewToggle
                mode={viewMode}
                onModeChange={setViewMode}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLegend(!showLegend)}
                title="Show legend"
              >
                <HelpCircle className="h-4 w-4" />
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

        {showLegend && (
          <div className="mb-8 animate-fade-up">
            <ComparisonLegend />
          </div>
        )}

        {selectedCandidates.length >= 1 && (
          <div className="space-y-8">
            <ComparisonSummary
              candidates={parsedCandidates}
              summary={summaryData}
            />

            {selectedCandidates.length >= 2 && (
              <TopicFilter
                topics={extractedTopics}
                selectedTopics={selectedTopics}
                onTopicToggle={handleTopicToggle}
                onClearTopics={handleClearTopics}
                showDifferencesOnly={showDifferencesOnly}
                onDifferencesToggle={setShowDifferencesOnly}
              />
            )}

            {viewMode === 'card' ? (
              <QuickSummaryCards
                candidates={parsedCandidates}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            ) : (
              <ComparisonTable
                candidates={parsedCandidates}
                comparisons={displayComparisons}
                activeSection={activeSection}
              />
            )}
          </div>
        )}

        {selectedCandidates.length === 0 && (
          <div className="text-center py-16">
            <Card className="card-elevated inline-block">
              <CardContent className="pt-8 pb-8">
                <p className="text-[var(--muted-foreground)] text-lg">
                  Select candidates to compare their government plans
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
