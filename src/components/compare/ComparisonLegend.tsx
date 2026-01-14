import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { ideologyColors } from './ideology-colors'

export function ComparisonLegend() {
  return (
    <Card className="card-elevated">
      <CardContent className="pt-6 pb-6">
        <h3 className="heading-small mb-4">Legend</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Ideology Colors</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className={ideologyColors.Left}>Left</Badge>
              <Badge className={ideologyColors['Center-Left']}>Center-Left</Badge>
              <Badge className={ideologyColors.Center}>Center</Badge>
              <Badge className={ideologyColors['Center-Right']}>Center-Right</Badge>
              <Badge className={ideologyColors.Right}>Right</Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Quantitative Data</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="quant-highlight quant-currency">💰100</span>
                <span className="text-[var(--muted-foreground)]">Currency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="quant-highlight quant-percentage">📊25%</span>
                <span className="text-[var(--muted-foreground)]">Percentage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="quant-highlight quant-count">👥6,500</span>
                <span className="text-[var(--muted-foreground)]">Count</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="quant-highlight quant-timeframe">⏱️100 días</span>
                <span className="text-[var(--muted-foreground)]">Timeframe</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Topic Icons</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>Security</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💰</span>
                <span>Taxes</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📚</span>
                <span>Education</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏥</span>
                <span>Health</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👨‍👩‍👧‍👦</span>
                <span>Care System</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏗️</span>
                <span>Infrastructure</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌿</span>
                <span>Environment</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span>Energy</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
