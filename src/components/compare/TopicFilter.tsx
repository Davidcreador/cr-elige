import { Button } from "../ui/button";
import { X } from "lucide-react";
import { ExtractedTopic } from "../../lib/topic-extractor";
import { useTranslations } from "../../lib/i18n";

interface TopicFilterProps {
  topics: ExtractedTopic[];
  selectedTopics: string[];
  onTopicToggle: (topic: string) => void;
  onClearTopics: () => void;
  showDifferencesOnly: boolean;
  onDifferencesToggle: (show: boolean) => void;
}

export function TopicFilter({
  topics,
  selectedTopics,
  onTopicToggle,
  onClearTopics,
  showDifferencesOnly,
  onDifferencesToggle,
}: TopicFilterProps) {
  const displayTopics = topics.slice(0, 12);
  const translations = useTranslations();
  const t = translations.compare;

  const safeFilters = {
    topics: t?.filters?.topics || 'Topics:',
    differencesOnly: t?.filters?.differencesOnly || 'Show differences only',
    clearFilters: t?.filters?.clearFilters || 'Clear filters'
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-[var(--muted-foreground)]">
          {safeFilters.topics}
        </span>
        {displayTopics.map((topic) => {
          const isActive = selectedTopics.includes(topic.name);
          return (
            <button
              key={topic.name}
              onClick={() => onTopicToggle(topic.name)}
              className={`topic-tag ${isActive ? 'active' : ''}`}
            >
              {topic.name}
              <span className="badge">{topic.count}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDifferencesOnly}
            onChange={(e) => onDifferencesToggle(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border)] accent-[#00205B]"
          />
          <span className="text-sm font-medium text-[var(--foreground)]">
            {safeFilters.differencesOnly}
          </span>
        </label>

        {selectedTopics.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearTopics}
            className="text-xs h-7"
          >
            <X className="mr-1 h-3 w-3" />
            {safeFilters.clearFilters}
          </Button>
        )}
      </div>
    </div>
  );
}
