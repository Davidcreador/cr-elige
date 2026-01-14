import { Badge } from '../ui/badge'
import { ideologyColors } from './ideology-colors'
import { ParsedCandidate } from '../../lib/comparison-parser'
import { TopicComparison } from '../../lib/comparison-utils'
import { highlightQuantitativeData, extractQuantitativeData } from '../../lib/quantitative-parser'
import { getTopicIcon } from '../../lib/comparison-helpers'

interface ComparisonTableProps {
  candidates: ParsedCandidate[]
  comparisons: TopicComparison[]
  activeSection: 'priorities' | 'economicFiscal' | 'socialPrograms' | 'infrastructure'
}

export function ComparisonTable({ candidates, comparisons, activeSection }: ComparisonTableProps) {
  if (candidates.length === 0 || comparisons.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="comparison-table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Topic</th>
              {candidates.map((candidate) => (
                <th key={candidate.slug}>
                  <div className="space-y-1">
                    <div className="text-sm">{candidate.displayName}</div>
                    <Badge className={`${ideologyColors[candidate.ideology]} px-2 py-0.5 text-[10px]`}>
                      {candidate.ideology}
                    </Badge>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comp) => (
              <tr key={comp.topic}>
                <td className="font-medium">
                  <span className="mr-2">{getTopicIcon(comp.topic)}</span>
                  {comp.topic}
                </td>
                {candidates.map((candidate) => {
                  const content = comp.candidates.get(candidate.slug) || '—'
                  const hasContent = content !== '—'

                  if (!hasContent) {
                    return (
                      <td key={candidate.slug} className="text-[var(--muted-foreground)]">
                        —
                      </td>
                    )
                  }

                  const quantData = extractQuantitativeData(content)
                  const highlighted = highlightQuantitativeData(content, quantData)

                  return (
                    <td key={candidate.slug} className="text-sm">
                      <div
                        className="prose prose-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden">
        <MobileStackedView candidates={candidates} comparisons={comparisons} />
      </div>
    </div>
  )
}

function MobileStackedView({
  candidates,
  comparisons
}: {
  candidates: ParsedCandidate[]
  comparisons: TopicComparison[]
}) {
  return (
    <div className="space-y-6">
      {comparisons.map((comp) => (
        <div key={comp.topic} className="mobile-stacked-card">
          <div className="mobile-topic-header">
            <span className="text-lg">{comp.topic}</span>
          </div>

          <div className="space-y-3">
            {candidates.map((candidate) => {
              const content = comp.candidates.get(candidate.slug) || '—'
              const hasContent = content !== '—'

              if (!hasContent) {
                return null
              }

              const quantData = extractQuantitativeData(content)
              const highlighted = highlightQuantitativeData(content, quantData)

              return (
                <div key={candidate.slug} className="mobile-candidate-section">
                  <div className="mobile-candidate-name">
                    {candidate.displayName}
                    <Badge className={`ml-2 ${ideologyColors[candidate.ideology]} px-2 py-0.5 text-[10px]`}>
                      {candidate.ideology}
                    </Badge>
                  </div>
                  <div
                    className="text-sm text-[var(--muted-foreground)] prose prose-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
