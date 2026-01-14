import { ParsedTopic } from './comparison-parser'
import { extractQuantitativeData } from './quantitative-parser'

export interface LoadingState {
  isLoading: boolean
  candidatesLoaded: number
  totalCandidates: number
}

export function parseCandidateWithErrorHandling(candidate: any) {
  try {
    const { parseCandidate } = require('./comparison-parser')
    return {
      success: true,
      data: parseCandidate(candidate)
    }
  } catch (error) {
    console.error(`Error parsing candidate ${candidate.slug}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      slug: candidate.slug
    }
  }
}

export function extractTopicsWithErrorHandling(candidates: any[]) {
  try {
    const { extractTopicsFromCandidates } = require('./topic-extractor')
    return {
      success: true,
      data: extractTopicsFromCandidates(candidates)
    }
  } catch (error) {
    console.error('Error extracting topics:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export function generateComparisonSummaryWithErrorHandling(candidates: any[]) {
  try {
    const { generateComparisonSummary } = require('./comparison-utils')
    return {
      success: true,
      data: generateComparisonSummary(candidates)
    }
  } catch (error) {
    console.error('Error generating summary:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export function formatLargeNumber(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export function parseSpanishNumber(text: string): number | null {
  const cleanText = text
    .toLowerCase()
    .replace(/mil/g, '000')
    .replace(/millones?/g, '000000')
    .replace(/billones?/g, '000000000')
    .replace(/[^\d.]/g, '')

  const parsed = parseFloat(cleanText)
  return isNaN(parsed) ? null : parsed
}

export function detectTrend(value: string): 'increase' | 'decrease' | 'neutral' | null {
  const increaseKeywords = ['aumento', 'incremento', 'reducir', 'aumentar', 'expandir', 'ampliar', 'mejorar']
  const decreaseKeywords = ['reducción', 'disminuir', 'bajar', 'eliminar', 'recortar', 'corte']

  const lowerValue = value.toLowerCase()

  for (const keyword of increaseKeywords) {
    if (lowerValue.includes(keyword)) {
      return 'increase'
    }
  }

  for (const keyword of decreaseKeywords) {
    if (lowerValue.includes(keyword)) {
      return 'decrease'
    }
  }

  return 'neutral'
}

export function getTopicIcon(topic: string): string {
  const topicLower = topic.toLowerCase()

  if (topicLower.includes('seguridad')) return '🛡️'
  if (topicLower.includes('impuesto') || topicLower.includes('tribut') || topicLower.includes('fiscal')) return '💰'
  if (topicLower.includes('economía') || topicLower.includes('económic')) return '📊'
  if (topicLower.includes('educación') || topicLower.includes('educativ')) return '📚'
  if (topicLower.includes('salud')) return '🏥'
  if (topicLower.includes('cuidado')) return '👨‍👩‍👧‍👦'
  if (topicLower.includes('vivienda') || topicLower.includes('habitacional')) return '🏠'
  if (topicLower.includes('infraestructura')) return '🏗️'
  if (topicLower.includes('medio ambiente') || topicLower.includes('ambiental')) return '🌿'
  if (topicLower.includes('energía') || topicLower.includes('energétic')) return '⚡'
  if (topicLower.includes('transporte')) return '🚌'
  if (topicLower.includes('trabajo') || topicLower.includes('emple')) return '💼'
  if (topicLower.includes('pobreza') || topicLower.includes('social')) return '🤝'
  if (topicLower.includes('mipyme') || topicLower.includes('empres')) return '🏭'

  return '📋'
}

export function calculateRelevanceScore(topic: ParsedTopic): number {
  let score = 0

  const quantData = extractQuantitativeData(topic.content)
  score += quantData.length * 2

  if (topic.content.length > 100) score += 1
  if (topic.content.length > 200) score += 2

  const keywords = ['nuevo', 'crear', 'fundar', 'programa', 'plan', 'estrategia']
  keywords.forEach(keyword => {
    if (topic.topic.toLowerCase().includes(keyword)) {
      score += 1
    }
  })

  return score
}
