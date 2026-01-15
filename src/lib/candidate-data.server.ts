import {
  type Candidate,
  type CandidateMetadata,
} from './candidate-data.client'
import { getSummaryFile } from '../data/candidate-summaries'

function parseCandidate(markdown: string, metadata: CandidateMetadata): Candidate {
  const lines = markdown.split('\n')

  let inContent = false
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

    if (!inContent) {
      if (line.trim() === '---') {
        inContent = true
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
    ...metadata,
    priorities: content.priorities || '',
    economicFiscal: content.economicFiscal || '',
    socialPrograms: content.socialPrograms || '',
    infrastructure: content.infrastructure || '',
    additionalNotes: content.additionalNotes || '',
    source: metadata.sourcePdf || '',
    pages: '',
    processedDate: '',
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

export async function getAllCandidates(): Promise<Candidate[]> {
  const { candidatesMetadata } = await import('./candidate-data.client')
  const candidates: Candidate[] = []

  for (const [_slug, metadata] of Object.entries(candidatesMetadata) as [string, CandidateMetadata][]) {
    const markdown = getSummaryFile(metadata.summaryFile)
    const candidate = parseCandidate(markdown, metadata)
    candidates.push(candidate)
  }

  return candidates.sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export async function getCandidateBySlug(slug: string): Promise<Candidate | undefined> {
  const { candidatesMetadata } = await import('./candidate-data.client')
  const metadata = (candidatesMetadata as Record<string, CandidateMetadata>)[slug]
  if (!metadata) return undefined

  const markdown = getSummaryFile(metadata.summaryFile)
  return parseCandidate(markdown, metadata)
}
