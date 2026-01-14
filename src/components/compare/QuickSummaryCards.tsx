import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ParsedCandidate, ParsedTopic } from "../../lib/comparison-parser";
import { getSectionTopics } from "../../lib/comparison-utils";
import {
  highlightQuantitativeData,
  extractQuantitativeData,
} from "../../lib/quantitative-parser";
import { ideologyColors } from "./ideology-colors";
import { useTranslations } from "../../lib/i18n";
import { getTopicIcon } from "../../lib/comparison-helpers";

interface QuickSummaryCardsProps {
  candidates: ParsedCandidate[];
  activeSection:
    | "priorities"
    | "economicFiscal"
    | "socialPrograms"
    | "infrastructure";
  onSectionChange: (
    section:
      | "priorities"
      | "economicFiscal"
      | "socialPrograms"
      | "infrastructure",
  ) => void;
}

export function QuickSummaryCards({
  candidates,
  activeSection,
  onSectionChange,
}: QuickSummaryCardsProps) {
  if (candidates.length === 0) return null;

  const sections: Array<
    "priorities" | "economicFiscal" | "socialPrograms" | "infrastructure"
  > = ["priorities", "economicFiscal", "socialPrograms", "infrastructure"];
  const translations = useTranslations();
  const t = translations.compare;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => onSectionChange(section)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeSection === section
                ? "bg-gradient-primary text-white"
                : "bg-muted text-[var(--foreground)] hover:bg-accent"
            }`}
          >
            {getSectionLabel(section)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <SummaryCard
            key={candidate.slug}
            candidate={candidate}
            activeSection={activeSection}
          />
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  candidate,
  activeSection,
}: {
  candidate: ParsedCandidate;
  activeSection: keyof ParsedCandidate;
}) {
  const section = candidate[activeSection] as any;
  const topics = getSectionTopics(candidate, activeSection as any);

  return (
    <Card className="card-elevated h-full">
      <CardContent className="pt-6 pb-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="heading-medium mb-1">{candidate.displayName}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                {candidate.party}
              </p>
            </div>
            <Badge className={ideologyColors[candidate.ideology]}>
              {candidate.ideology}
            </Badge>
          </div>

          <div className="space-y-3">
            {topics.map((topic, index) => (
              <TopicContent key={index} topic={topic} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TopicContent({ topic }: { topic: ParsedTopic }) {
  const quantitativeData = extractQuantitativeData(topic.content);
  const highlightedContent = highlightQuantitativeData(
    topic.content,
    quantitativeData
  );

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-[var(--foreground)] flex items-center gap-2">
        <span>{getTopicIcon(topic.topic)}</span>
        <span>{topic.topic}</span>
      </h4>
      <div
        className="text-sm text-[var(--muted-foreground)] leading-relaxed prose prose-sm"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
    </div>
  );
}

function getSectionLabel(section: keyof ParsedCandidate): string {
  const translations = useTranslations();
  const t = translations.compare;

  if (!t || !t.sections) {
    const fallbackLabels: Record<string, string> = {
      priorities: "Prioridades",
      economicFiscal: "Economía",
      socialPrograms: "Sociales",
      infrastructure: "Infraestructura",
    };
    return fallbackLabels[section] || section;
  }

  return t.sections[section] || "";
}
