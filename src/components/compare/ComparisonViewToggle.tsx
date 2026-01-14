import { Button } from "../ui/button";
import { Grid3X3, Table as TableIcon } from "lucide-react";
import { useTranslations } from "../../lib/i18n";

interface ComparisonViewToggleProps {
  mode: "card" | "table";
  onModeChange: (mode: "card" | "table") => void;
}

export function ComparisonViewToggle({
  mode,
  onModeChange,
}: ComparisonViewToggleProps) {
  const translations = useTranslations();
  const t = translations.compare;

  const cardText = t?.viewToggle?.card || "Cards";
  const tableText = t?.viewToggle?.table || "Table";

  return (
    <div className="inline-flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={mode === "card" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("card")}
        className="gap-2"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden sm:inline">{cardText}</span>
      </Button>
      <Button
        variant={mode === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("table")}
        className="gap-2"
      >
        <TableIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{tableText}</span>
      </Button>
    </div>
  );
}
