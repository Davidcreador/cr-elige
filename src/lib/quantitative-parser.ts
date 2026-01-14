export interface QuantitativeData {
  type: 'currency' | 'percentage' | 'count' | 'timeframe' | 'date'
  value: string
  unit?: string
  raw: string
  context: string
  index: number
}

const patterns = {
  currency: [
    /\$\s*([\d,.]+)\s*(?:millones?|billones?|mil)?(?:\s*(?:USD|dólares?|dollars|colones|₡))?/gi,
    /([\d,.]+)\s*(?:millones?|billones?|mil)?(?:\s*(?:USD|dólares?|dollars|colones|₡))/gi
  ],
  percentage: [/(\d+(?:\.\d+)?)\s*%/gi],
  count: [/(\d+(?:\.\d+)?)\s*(?:efectivos?|plazas?|puestos?|personas?|candidatos?|programas?|proyectos?|centros?|escuelas?|hospitales?|empleos?)/gi],
  timeframe: [/(\d+)\s*(?:días|meses|años|semanas|horas)/gi],
  date: [/(?:año|fecha|período|desde|en)\s*(20\d{2})/gi]
}

export function extractQuantitativeData(
  content: string
): QuantitativeData[] {
  const results: QuantitativeData[] = []

  Object.entries(patterns).forEach(([type, regexList]) => {
    regexList.forEach(regex => {
      let match
      while ((match = regex.exec(content)) !== null) {
        const raw = match[0]
        const value = match[1]

        const contextStart = Math.max(0, match.index - 30)
        const contextEnd = Math.min(content.length, match.index + raw.length + 30)
        const context = content.substring(contextStart, contextEnd)

        results.push({
          type: type as QuantitativeData['type'],
          value,
          unit: extractUnit(raw, type as QuantitativeData['type']),
          raw,
          context,
          index: match.index
        })

        regex.lastIndex = match.index + 1
      }
    })
  })

  return results.sort((a, b) => a.index - b.index)
}

function extractUnit(raw: string, type: QuantitativeData['type']): string | undefined {
  if (type === 'currency') {
    if (raw.includes('millones')) return 'millones'
    if (raw.includes('billones')) return 'billones'
    if (raw.includes('mil')) return 'mil'
  }
  if (type === 'count') {
    const unitMatch = raw.match(/(efectivos?|plazas?|puestos?|personas?)/i)
    return unitMatch ? unitMatch[1] : undefined
  }
  if (type === 'timeframe') {
    const unitMatch = raw.match(/(días|meses|años|semanas|horas)/i)
    return unitMatch ? unitMatch[1] : undefined
  }
  return undefined
}

export function highlightQuantitativeData(
  content: string,
  quantitativeData: QuantitativeData[]
): string {
  if (!quantitativeData.length) return content

  let result = content
  const replacements: Array<{ index: number; length: number; replacement: string }> = []

  quantitativeData.forEach(data => {
    const className = getHighlightClass(data.type)
    const icon = getIconForType(data.type)

    const replacement = `<span class="quant-highlight ${className}" title="${data.raw}">${icon}${data.value}</span>`

    replacements.push({
      index: data.index,
      length: data.raw.length,
      replacement
    })
  })

  replacements.sort((a, b) => b.index - a.index)

  replacements.forEach(({ index, length, replacement }) => {
    result = result.substring(0, index) + replacement + result.substring(index + length)
  })

  return result
}

function getHighlightClass(type: QuantitativeData['type']): string {
  const classes = {
    currency: 'quant-currency',
    percentage: 'quant-percentage',
    count: 'quant-count',
    timeframe: 'quant-timeframe',
    date: 'quant-date'
  }
  return classes[type] || 'quant-default'
}

function getIconForType(type: QuantitativeData['type']): string {
  const icons = {
    currency: '💰',
    percentage: '📊',
    count: '👥',
    timeframe: '⏱️',
    date: '📅'
  }
  return icons[type] || ''
}

export function compareQuantitativeValues(
  values1: QuantitativeData[],
  values2: QuantitativeData[],
  type: QuantitativeData['type']
): 'increase' | 'decrease' | 'same' | 'unclear' {
  const v1 = values1.find(v => v.type === type)
  const v2 = values2.find(v => v.type === type)

  if (!v1 || !v2) return 'unclear'

  const num1 = parseFloat(v1.value.replace(/,/g, ''))
  const num2 = parseFloat(v2.value.replace(/,/g, ''))

  if (isNaN(num1) || isNaN(num2)) return 'unclear'

  if (num2 > num1) return 'increase'
  if (num2 < num1) return 'decrease'
  return 'same'
}
