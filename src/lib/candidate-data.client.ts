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

const ideologyOrder: Record<string, number> = {
  Left: 1,
  'Center-Left': 2,
  Center: 3,
  'Center-Right': 4,
  Right: 5,
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

export type { Candidate, CandidateMetadata }
export { candidatesMetadata }

