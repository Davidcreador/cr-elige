export interface ParsedTopic {
  topic: string
  content: string
  subsections: string[]
}

export interface ParsedSection {
  section: string
  topics: ParsedTopic[]
}

export interface ParsedCandidate {
  slug: string
  displayName: string
  party: string
  ideology: string
  priorities: ParsedSection
  economicFiscal: ParsedSection
  socialPrograms: ParsedSection
  infrastructure: ParsedSection
}

export function parseMarkdownSection(
  content: string,
  sectionName: string
): ParsedSection {
  const topics: ParsedTopic[] = []
  const lines = content.split('\n')
  let currentTopic: ParsedTopic | null = null

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('- **') && trimmedLine.includes('**:')) {
      if (currentTopic) {
        topics.push(currentTopic)
      }

      const topicMatch = trimmedLine.match(/^- \*\*(.+?)\*\*:\s*(.*)$/)
      if (topicMatch) {
        currentTopic = {
          topic: topicMatch[1].trim(),
          content: topicMatch[2] || '',
          subsections: []
        }
      }
    } else if (trimmedLine && currentTopic) {
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        const itemContent = trimmedLine.replace(/^[-•]\s*/, '').trim()
        if (itemContent) {
          currentTopic.content += (currentTopic.content ? ' ' : '') + itemContent
          currentTopic.subsections.push(itemContent)
        }
      } else {
        currentTopic.content += (currentTopic.content ? ' ' : '') + trimmedLine
      }
    }
  }

  if (currentTopic) {
    topics.push(currentTopic)
  }

  return {
    section: sectionName,
    topics
  }
}

export function parseCandidate(
  candidate: any
): ParsedCandidate {
  return {
    slug: candidate.slug,
    displayName: candidate.displayName,
    party: candidate.party,
    ideology: candidate.ideology,
    priorities: parseMarkdownSection(candidate.priorities || '', 'Prioridades Principales'),
    economicFiscal: parseMarkdownSection(candidate.economicFiscal || '', 'Planes Económicos y Fiscales'),
    socialPrograms: parseMarkdownSection(candidate.socialPrograms || '', 'Programas Sociales y Reformas'),
    infrastructure: parseMarkdownSection(candidate.infrastructure || '', 'Infraestructura y Medio Ambiente')
  }
}

export function parseAllCandidates(candidates: any[]): ParsedCandidate[] {
  return candidates.map(parseCandidate)
}
