import { ParsedCandidate, ParsedTopic } from './comparison-parser'
import { QuantitativeData } from './quantitative-parser'

export interface TopicComparison {
  topic: string
  candidates: Map<string, string>
  quantitativeData: Map<string, QuantitativeData[]>
  hasDifferences: boolean
}

export interface SummarySection {
  type: 'all-agree' | 'disagree' | 'unique'
  title: string
  items: Array<{
    text: string
    candidates?: string[]
  }>
}

export function findTopicInCandidate(
  candidate: ParsedCandidate,
  topicName: string
): ParsedTopic | null {
  const sections: (keyof ParsedCandidate)[] = [
    'priorities',
    'economicFiscal',
    'socialPrograms',
    'infrastructure'
  ]

  for (const sectionKey of sections) {
    const section = candidate[sectionKey] as any
    if (!section || !section.topics) continue

    const topic = section.topics.find((t: ParsedTopic) => t.topic === topicName)
    if (topic) return topic
  }

  return null
}

export function compareTopicAcrossCandidates(
  candidates: ParsedCandidate[],
  topicName: string,
  quantitativeData: Map<string, QuantitativeData[]>
): TopicComparison {
  const positions = new Map<string, string>()

  candidates.forEach(candidate => {
    const topic = findTopicInCandidate(candidate, topicName)
    positions.set(candidate.slug, topic?.content || '—')
  })

  const positionValues = Array.from(positions.values()).filter(p => p !== '—')
  const hasDifferences = positionValues.length > 1

  return {
    topic: topicName,
    candidates: positions,
    quantitativeData,
    hasDifferences
  }
}

export function generateComparisonSummary(
  candidates: ParsedCandidate[]
): SummarySection[] {
  const summary: SummarySection[] = [
    { type: 'all-agree', title: 'Donde todos los candidatos coinciden', items: [] },
    { type: 'disagree', title: 'Puntos de desacuerdo', items: [] },
    { type: 'unique', title: 'Propuestas únicas', items: [] }
  ]

  const allTopics = new Map<string, Set<string>>()

  candidates.forEach(candidate => {
    const sections: (keyof ParsedCandidate)[] = [
      'priorities',
      'economicFiscal',
      'socialPrograms',
      'infrastructure'
    ]

    sections.forEach(sectionKey => {
      const section = candidate[sectionKey] as any
      if (!section || !section.topics) return

      section.topics.forEach((topic: ParsedTopic) => {
        if (!allTopics.has(topic.topic)) {
          allTopics.set(topic.topic, new Set())
        }
        allTopics.get(topic.topic)!.add(candidate.slug)
      })
    })
  })

  allTopics.forEach((candidateSlugs, topicName) => {
    if (candidateSlugs.size === candidates.length) {
      summary[0].items.push({ text: topicName })
    } else if (candidateSlugs.size > 1) {
      const candidateNames = Array.from(candidateSlugs).map(slug =>
        candidates.find(c => c.slug === slug)?.displayName
      ).filter(Boolean) as string[]

      summary[1].items.push({
        text: topicName,
        candidates: candidateNames
      })
    } else {
      const candidateSlug = Array.from(candidateSlugs)[0]
      const candidateName = candidates.find(c => c.slug === candidateSlug)?.displayName

      summary[2].items.push({
        text: topicName,
        candidates: candidateName ? [candidateName] : []
      })
    }
  })

  return summary.filter(s => s.items.length > 0)
}

export function filterByDifferences(
  comparisons: TopicComparison[]
): TopicComparison[] {
  return comparisons.filter(comp => comp.hasDifferences)
}

export function formatContentForDisplay(content: string, maxLength: number = 200): string {
  if (content.length <= maxLength) return content

  const truncated = content.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  return truncated.substring(0, lastSpace) + '...'
}

export function getTopTopics(
  candidate: ParsedCandidate,
  count: number = 5
): ParsedTopic[] {
  const allTopics: ParsedTopic[] = []

  const sections: (keyof ParsedCandidate)[] = [
    'priorities',
    'economicFiscal',
    'socialPrograms',
    'infrastructure'
  ]

  sections.forEach(sectionKey => {
    const section = candidate[sectionKey] as any
    if (section && section.topics) {
      allTopics.push(...section.topics)
    }
  })

  return allTopics.slice(0, count)
}

export function getSectionTopics(
  candidate: ParsedCandidate,
  sectionKey: 'priorities' | 'economicFiscal' | 'socialPrograms' | 'infrastructure'
): ParsedTopic[] {
  const section = candidate[sectionKey] as any
  return section?.topics || []
}
