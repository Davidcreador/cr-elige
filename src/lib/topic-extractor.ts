import { ParsedCandidate, ParsedTopic } from './comparison-parser'

export interface ExtractedTopic {
  name: string
  variants: string[]
  count: number
  sections: string[]
  candidates: string[]
}

export function normalizeTopic(topic: string): string {
  return topic
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
}

export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeTopic(str1)
  const s2 = normalizeTopic(str2)

  if (s1 === s2) return 1

  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)

  const intersection = words1.filter(word => words2.includes(word))
  const union = [...new Set([...words1, ...words2])]

  return intersection.length / union.length
}

export function groupSimilarTopics(
  topicNames: string[],
  threshold: number = 0.8
): Map<string, string[]> {
  const groups = new Map<string, string[]>()
  const processed = new Set<string>()

  for (const topic of topicNames) {
    if (processed.has(topic)) continue

    const group = [topic]
    processed.add(topic)

    for (const other of topicNames) {
      if (processed.has(other) || other === topic) continue

      const similarity = calculateSimilarity(topic, other)
      if (similarity >= threshold) {
        group.push(other)
        processed.add(other)
      }
    }

    const representative = group[0]
    groups.set(representative, group)
  }

  return groups
}

export function extractTopicsFromCandidates(
  candidates: ParsedCandidate[]
): ExtractedTopic[] {
  const allTopics = new Map<string, {
    variants: Set<string>
    count: number
    sections: Set<string>
    candidates: Set<string>
    allTopicVariants: Set<string>
  }>()

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
        const normalized = normalizeTopic(topic.topic)

        if (!allTopics.has(normalized)) {
          allTopics.set(normalized, {
            variants: new Set(),
            count: 0,
            sections: new Set(),
            candidates: new Set(),
            allTopicVariants: new Set()
          })
        }

        const data = allTopics.get(normalized)!
        data.variants.add(topic.topic)
        data.allTopicVariants.add(topic.topic)
        data.count++
        data.sections.add(section.section)
        data.candidates.add(candidate.slug)
      })
    })
  })

  const topicArray: ExtractedTopic[] = []
  allTopics.forEach((data, normalized) => {
    topicArray.push({
      name: normalized,
      variants: Array.from(data.variants),
      count: data.count,
      sections: Array.from(data.sections),
      candidates: Array.from(data.candidates)
    })
  })

  return topicArray.sort((a, b) => b.count - a.count)
}

export function filterCandidatesByTopic(
  candidates: ParsedCandidate[],
  topicName: string
): ParsedCandidate[] {
  const normalized = normalizeTopic(topicName)

  return candidates.filter(candidate => {
    const sections: (keyof ParsedCandidate)[] = [
      'priorities',
      'economicFiscal',
      'socialPrograms',
      'infrastructure'
    ]

    return sections.some(sectionKey => {
      const section = candidate[sectionKey] as any
      if (!section || !section.topics) return false

      return section.topics.some((topic: ParsedTopic) =>
        normalizeTopic(topic.topic) === normalized
      )
    })
  })
}
