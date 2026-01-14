import { Card, CardContent } from "../ui/card";
import { CheckCircle2, AlertTriangle, Star } from "lucide-react";
import { SummarySection } from "../../lib/comparison-utils";
import { ParsedCandidate } from "../../lib/comparison-parser";
import { useTranslations } from "../../lib/i18n";

interface ComparisonSummaryProps {
  candidates: ParsedCandidate[];
  summary: SummarySection[];
}

export function ComparisonSummary({
  candidates,
  summary,
}: ComparisonSummaryProps) {
  if (candidates.length < 2) return null;

  const nonEmptySummary = summary.filter((s) => s.items.length > 0);

  if (nonEmptySummary.length === 0) return null;

  const translations = useTranslations();
  const t = translations.compare;

  const getSectionTitle = (type: SummarySection['type']) => {
    if (!t || !t.summary) {
      const fallbackTitles = {
        'all-agree': 'Where All Candidates Agree',
        'disagree': 'Points of Disagreement',
        'unique': 'Unique Proposals'
      };
      return fallbackTitles[type] || '';
    }

    const titles = {
      'all-agree': t.summary.allAgree,
      'disagree': t.summary.disagree,
      'unique': t.summary.unique
    };
    return titles[type] || '';
  };

  const getSectionIcon = (type: SummarySection['type']) => {
    const icons = {
      'all-agree': <CheckCircle2 className="h-4 w-4 text-[#10B981]" />,
      'disagree': <AlertTriangle className="h-4 w-4 text-[#EF3340]" />,
      'unique': <Star className="h-4 w-4 text-[#F59E0B]" />,
    };
    return icons[type];
  };

  return (
    <Card className="card-elevated">
      <CardContent className="pt-6 pb-6">
        <h2 className="heading-large mb-4 flex items-center gap-2">
          <span>{t?.summary?.title || 'Comparison Summary'}</span>
        </h2>

        <div className="space-y-4">
          {nonEmptySummary.map((section) => (
            <div key={section.type} className="summary-section">
              <h3 className="flex items-center gap-2">
                {getSectionIcon(section.type)}
                {getSectionTitle(section.type)}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, index) => (
                  <div key={index} className="summary-item">
                    {item.text}
                    {item.candidates && item.candidates.length > 0 && (
                      <span className="text-[var(--muted-foreground)] ml-2">
                        ({item.candidates.join(', ')})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
