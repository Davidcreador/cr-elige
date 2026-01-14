import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  type Candidate,
  type CandidateMetadata,
} from './candidate-data.client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function readMarkdownFile(filename: string): Promise<string> {
  const possiblePaths = [
    path.join(process.cwd(), 'src/data/summaries', filename),
    path.join(__dirname, '../../data/summaries', filename),
    path.join(process.cwd(), '.next/server/src/data/summaries', filename),
    path.join(process.cwd(), '.output/server/src/data/summaries', filename),
  ]

  for (const filePath of possiblePaths) {
    try {
      return await readFile(filePath, 'utf-8')
    } catch (error) {
      // Try next path
    }
  }

  throw new Error(`Markdown file not found: ${filename}`, { cause: { paths: possiblePaths } })
}

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
    const markdown = await readMarkdownFile(metadata.summaryFile)
    const candidate = parseCandidate(markdown, metadata)
    candidates.push(candidate)
  }

  return candidates.sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export async function getCandidateBySlug(slug: string): Promise<Candidate | undefined> {
  const { candidatesMetadata } = await import('./candidate-data.client')
  const metadata = (candidatesMetadata as Record<string, CandidateMetadata>)[slug]
  if (!metadata) return undefined

  const markdown = await readMarkdownFile(metadata.summaryFile)
  return parseCandidate(markdown, metadata)
}
