import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useI18n } from "../lib/i18n";
import { filterCandidates, sortCandidates } from "../lib/candidate-data.client";
import { getAllCandidates } from "../lib/candidate-data.functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export const Route = createFileRoute("/candidates")({
  ssr: true,
  component: Candidates,
  loader: async () => {
    const candidates = await getAllCandidates();
    return { candidates };
  },
});

function Candidates() {
  const { candidates: initialCandidates } = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [ideologyFilter, setIdeologyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const t = useI18n();

  const filtered = filterCandidates(initialCandidates, {
    search,
    ideology: ideologyFilter === "all" ? undefined : ideologyFilter,
  });
  const sorted = useMemo(
    () => sortCandidates(filtered, sortBy),
    [sortBy, filtered],
  );

  const ideologyColors: Record<string, string> = {
    Left: "bg-gradient-to-br from-[#EF3340] to-[#ff5a63] text-white",
    "Center-Left": "bg-gradient-to-br from-[#335288] to-[#4a6b9f] text-white",
    Center: "bg-gradient-to-br from-[#00205B] to-[#1a3a7a] text-white",
    "Center-Right": "bg-gradient-to-br from-[#335288] to-[#4a6b9f] text-white",
    Right: "bg-gradient-to-br from-[#00205B] to-[#1a3a7a] text-white",
  };

  const ideologies = [
    "all",
    "Left",
    "Center-Left",
    "Center",
    "Center-Right",
    "Right",
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="display-large mb-4">
            {t.nav.candidates}
          </h1>
          <p className="lead text-[var(--muted-foreground)]">{t.home.heroSubtitle}</p>
        </div>

        <div className="mb-10 space-y-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
              <Input
                type="text"
                placeholder={t.candidates.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 h-11 rounded-lg"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 h-11 rounded-lg">
                <SelectValue placeholder={t.candidates.sort} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">
                  {t.candidates.sortOptions["name-asc"]}
                </SelectItem>
                <SelectItem value="name-desc">
                  {t.candidates.sortOptions["name-desc"]}
                </SelectItem>
                <SelectItem value="ideology-asc">
                  {t.candidates.sortOptions["ideology-asc"]}
                </SelectItem>
                <SelectItem value="ideology-desc">
                  {t.candidates.sortOptions["ideology-desc"]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="text-sm font-medium text-[var(--muted-foreground)] py-2.5">
              {t.candidates.filter}
            </span>
            {ideologies.map((ideology) => (
              <Button
                key={ideology}
                variant={ideologyFilter === ideology ? "default" : "outline"}
                size="sm"
                onClick={() => setIdeologyFilter(ideology)}
              >
                {ideology === "all"
                  ? t.candidates.filters.all
                  : t.candidates.filters[
                      ideology as keyof typeof t.candidates.filters
                    ]}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map((candidate) => (
            <Card
              key={candidate.slug}
              className="card-elevated"
            >
              <CardContent className="pt-7 pb-7">
                <div className="space-y-5">
                  <div>
                    <h3 className="heading-small mb-2">
                      {candidate.displayName}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                      {candidate.party}
                    </p>
                    <Badge className={ideologyColors[candidate.ideology]}>
                      {candidate.ideology === "Center-Left"
                        ? t.candidates.filters["center-left"]
                        : candidate.ideology === "Center-Right"
                          ? t.candidates.filters["center-right"]
                          : t.candidates.filters[
                              candidate.ideology.toLowerCase() as keyof typeof t.candidates.filters
                            ] || candidate.ideology}
                    </Badge>
                  </div>
                  <Link
                    to={`/candidate/$slug`}
                    params={{ slug: candidate.slug }}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      {t.candidates.viewPlan}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--muted-foreground)] text-lg">No candidates match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
