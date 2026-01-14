import candidatesMetadata from '../data/candidates-metadata.json'

interface CandidateMetadata {
  displayName: string
  party: string
  ideology: string
  summaryFile: string
  sourcePdf: string
  slug: string
}

interface Candidate extends CandidateMetadata {
  priorities: string
  economicFiscal: string
  socialPrograms: string
  infrastructure: string
  additionalNotes?: string
  source: string
  pages: string
  processedDate: string
}

interface SummaryData {
  party: string
  candidate: string
  source_pdf: string
  pages: number | string
  processed_date: string
}

const ideologyOrder: Record<string, number> = {
  Left: 1,
  'Center-Left': 2,
  Center: 3,
  'Center-Right': 4,
  Right: 5,
}

// Import all summary files as strings
const summaryModules = import.meta.glob('/public/summaries/*.md', { as: 'raw', eager: true })

export function getAllCandidates(): Candidate[] {
  const candidates: Candidate[] = []

  for (const [_slug, metadata] of Object.entries(candidatesMetadata) as [string, CandidateMetadata][]) {
    const summary = loadCandidateSummary(metadata.summaryFile)
    candidates.push({
      ...metadata,
      ...summary,
    })
  }

  return candidates.sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export function getCandidateBySlug(slug: string): Candidate | undefined {
  const metadata = (candidatesMetadata as Record<string, CandidateMetadata>)[slug]
  if (!metadata) return undefined

  const summary = loadCandidateSummary(metadata.summaryFile)
  return {
    ...metadata,
    ...summary,
  }
}

export function filterCandidates(
  candidates: Candidate[],
  filters: { search?: string; ideology?: string }
): Candidate[] {
  let filtered = [...candidates]

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.displayName.toLowerCase().includes(searchLower) ||
        c.party.toLowerCase().includes(searchLower) ||
        c.ideology.toLowerCase().includes(searchLower)
    )
  }

  if (filters.ideology) {
    filtered = filtered.filter((c) => c.ideology === filters.ideology)
  }

  return filtered
}

export function sortCandidates(candidates: Candidate[], sortBy: string): Candidate[] {
  const sorted = [...candidates]

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.displayName.localeCompare(b.displayName))
    case 'name-desc':
      return sorted.sort((a, b) => b.displayName.localeCompare(a.displayName))
    case 'ideology-asc':
      return sorted.sort((a, b) => (ideologyOrder[a.ideology] || 3) - (ideologyOrder[b.ideology] || 3))
    case 'ideology-desc':
      return sorted.sort((a, b) => (ideologyOrder[b.ideology] || 3) - (ideologyOrder[a.ideology] || 3))
    default:
      return sorted
  }
}

export function loadCandidateSummary(filename: string): Omit<Candidate, keyof CandidateMetadata> {
  try {
    const text = summaryModules[`/public/summaries/${filename}`] as string
    return parseSummaryContent(text)
  } catch (error) {
    console.error(`Error loading summary ${filename}:`, error)
    return {
      priorities: '',
      economicFiscal: '',
      socialPrograms: '',
      infrastructure: '',
      additionalNotes: '',
      source: '',
      pages: '',
      processedDate: '',
    }
  }
}

function parseSummaryContent(markdown: string): Omit<Candidate, keyof CandidateMetadata> {
  const lines = markdown.split('\n')

  const frontmatter: Partial<SummaryData> = {}
  let inFrontmatter = false
  let currentSection = ''
  const content: Record<string, string> = {
    priorities: '',
    economicFiscal: '',
    socialPrograms: '',
    infrastructure: '',
    additionalNotes: '',
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter
      continue
    }

    if (inFrontmatter) {
      const match = line.match(/^(\w+):\s*"?(.+?)"?\s*$/)
      if (match) {
        const key = match[1].toLowerCase()
        const value = match[2].replace(/"/g, '')
        frontmatter[key as keyof SummaryData] = value
      }
      continue
    }

    if (line.startsWith('## ')) {
      currentSection = line.substring(3).trim()
      continue
    }

    if (currentSection) {
      const sectionKey = mapSectionToKey(currentSection)
      if (sectionKey && content[sectionKey] !== undefined) {
        content[sectionKey] += (content[sectionKey] ? '\n' : '') + line
      }
    }
  }

  return {
    priorities: content.priorities || '',
    economicFiscal: content.economicFiscal || '',
    socialPrograms: content.socialPrograms || '',
    infrastructure: content.infrastructure || '',
    additionalNotes: content.additionalNotes || '',
    source: frontmatter.source_pdf || '',
    pages: String(frontmatter.pages || ''),
    processedDate: frontmatter.processed_date || '',
  }
}

function mapSectionToKey(section: string): 'priorities' | 'economicFiscal' | 'socialPrograms' | 'infrastructure' | 'additionalNotes' | null {
  const mapping: Record<string, 'priorities' | 'economicFiscal' | 'socialPrograms' | 'infrastructure' | 'additionalNotes'> = {
    'Prioridades Principales de Política': 'priorities',
    'Planes Económicos y Fiscales': 'economicFiscal',
    'Programas Sociales y Reformas': 'socialPrograms',
    'Infraestructura y Medio Ambiente': 'infrastructure',
    'Notas Adicionales': 'additionalNotes',
  }

  return mapping[section] || null
}

export type { Candidate }
