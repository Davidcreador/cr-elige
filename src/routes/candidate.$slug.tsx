import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Download, FileText, ExternalLink } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useI18n } from '../lib/i18n'
import { candidatesMetadata } from '../lib/candidate-data.client'
import { getCandidateBySlug, getAllCandidates } from '../lib/candidate-data.functions'
import { MarkdownContent } from '../components/MarkdownContent'

export const Route = createFileRoute('/candidate/$slug')({
  component: CandidateProfile,
  loader: async ({ params }) => {
    // Check if slug exists in metadata first
    if (!(params.slug in candidatesMetadata)) {
      throw new Error('Candidate not found')
    }

    // Then load candidate and all candidates
    const candidate = await getCandidateBySlug({ data: { slug: params.slug } })
    const allCandidates = await getAllCandidates()
    return { candidate, allCandidates }
  },
})

function CandidateProfile() {
  const { candidate, allCandidates } = Route.useLoaderData()
  const navigate = useNavigate()
  const t = useI18n()

  if (!candidate) {
    return (
    <div className="min-h-screen bg-gradient-hero py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="display-medium mb-6">Candidate Not Found</h1>
          <Link to="/candidates">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.candidate.back}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const ideologyColors: Record<string, string> = {
    Left: 'bg-gradient-to-br from-[#EF3340] to-[#ff5a63] text-white',
    'Center-Left': 'bg-gradient-to-br from-[#335288] to-[#4a6b9f] text-white',
    Center: 'bg-gradient-to-br from-[#00205B] to-[#1a3a7a] text-white',
    'Center-Right': 'bg-gradient-to-br from-[#335288] to-[#4a6b9f] text-white',
    Right: 'bg-gradient-to-br from-[#00205B] to-[#1a3a7a] text-white',
  }

  const relatedCandidates = allCandidates
    .filter((c) => c.ideology === candidate.ideology && c.slug !== candidate.slug)
    .slice(0, 3)

  const tabValueToContent = (value: string) => {
    switch (value) {
      case 'priorities':
        return <MarkdownContent content={candidate.priorities} />
      case 'economicFiscal':
        return <MarkdownContent content={candidate.economicFiscal} />
      case 'socialPrograms':
        return <MarkdownContent content={candidate.socialPrograms} />
      case 'infrastructure':
        return <MarkdownContent content={candidate.infrastructure} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10">
          <Button variant="ghost" onClick={() => navigate({ to: '/candidates' })} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.candidate.back}
          </Button>

          <Card className="card-elevated">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="display-large mb-3">{candidate.displayName}</h1>
                  <p className="text-lg text-[var(--muted-foreground)] mb-4 leading-relaxed">{candidate.party}</p>
                  <Badge className={ideologyColors[candidate.ideology]}>
                    {candidate.ideology === 'Center-Left'
                      ? t.candidates.filters['center-left']
                      : candidate.ideology === 'Center-Right'
                      ? t.candidates.filters['center-right']
                      : t.candidates.filters[candidate.ideology.toLowerCase() as keyof typeof t.candidates.filters] || candidate.ideology}
                  </Badge>
                </div>
                <div className="flex flex-col gap-3 md:text-right">
                  {candidate.sourcePdf && (
                    <a
                      href={`/pdf/${candidate.sourcePdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center md:justify-end px-5 py-2.5 bg-gradient-primary hover:opacity-90 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {t.candidate.downloadPdf}
                    </a>
                  )}
                  <div className="text-sm text-[var(--muted-foreground)]">
                    <span className="font-medium text-[var(--foreground)]">{t.candidate.pages}</span> {candidate.pages}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    <span className="font-medium text-[var(--foreground)]">{t.candidate.processedDate}</span> {candidate.processedDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="priorities" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-12 rounded-lg">
            <TabsTrigger value="priorities">{t.candidate.tabs.priorities}</TabsTrigger>
            <TabsTrigger value="economicFiscal">{t.candidate.tabs.economicFiscal}</TabsTrigger>
            <TabsTrigger value="socialPrograms">{t.candidate.tabs.socialPrograms}</TabsTrigger>
            <TabsTrigger value="infrastructure">{t.candidate.tabs.infrastructure}</TabsTrigger>
          </TabsList>

          <TabsContent value="priorities">
            <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#00205B]/70" />
                    {t.candidate.tabs.priorities}
                  </CardTitle>
                </CardHeader>
              <CardContent className="pt-6">
                {tabValueToContent('priorities')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="economicFiscal">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#00205B]/70" />
                  {t.candidate.tabs.economicFiscal}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {tabValueToContent('economicFiscal')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="socialPrograms">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#00205B]/70" />
                  {t.candidate.tabs.socialPrograms}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {tabValueToContent('socialPrograms')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="infrastructure">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#00205B]/70" />
                  {t.candidate.tabs.infrastructure}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {tabValueToContent('infrastructure')}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {candidate.additionalNotes && (
          <Card className="card-elevated mt-8">
            <CardHeader>
              <CardTitle>{t.candidate.additionalNotes}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <MarkdownContent content={candidate.additionalNotes} className="prose-sm" />
            </CardContent>
          </Card>
        )}

        {relatedCandidates.length > 0 && (
          <div className="mt-16">
            <h2 className="heading-large mb-6">{t.candidate.relatedCandidates}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedCandidates.map((c) => (
                <Card key={c.slug} className="card-elevated">
                  <CardContent className="pt-6 pb-6">
                    <Link to={`/candidate/$slug`} params={{ slug: c.slug }}>
                      <h3 className="heading-small mb-2">{c.displayName}</h3>
                      <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">{c.party}</p>
                      <Button variant="ghost" size="sm" className="w-full">
                        {t.candidates.viewPlan}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
