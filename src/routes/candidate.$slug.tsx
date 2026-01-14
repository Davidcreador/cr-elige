import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Download, FileText, ExternalLink } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useI18n } from '../lib/i18n'
import { candidatesMetadata } from '../lib/candidate-data.client'
import { getCandidateBySlug, getAllCandidates } from '../lib/candidate-data.functions'

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
      <div className="min-h-screen bg-white py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h1>
          <Link to="/candidates">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.candidate.back}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const ideologyColors: Record<string, string> = {
    Left: 'bg-red-100 text-red-800',
    'Center-Left': 'bg-orange-100 text-orange-800',
    Center: 'bg-gray-100 text-gray-800',
    'Center-Right': 'bg-blue-100 text-blue-800',
    Right: 'bg-indigo-100 text-indigo-800',
  }

  const relatedCandidates = allCandidates
    .filter((c) => c.ideology === candidate.ideology && c.slug !== candidate.slug)
    .slice(0, 3)

  const formatContent = (content: string) => {
    if (!content) return <p className="text-gray-500 italic">No information available</p>

    const lines = content.split('\n').filter((line) => line.trim())
    const items: string[] = []
    let currentQuote: string[] = []

    for (const line of lines) {
      if (line.trim().startsWith('- **')) {
        if (currentQuote.length > 0) {
          items.push(currentQuote.join(' '))
          currentQuote = []
        }
        const text = line.replace(/^- \*\*/, '').replace(/\*\*:$/, '').trim()
        items.push(text)
      } else if (line.trim().startsWith('-')) {
        const text = line.replace(/^- /, '').trim()
        currentQuote.push(text)
      }
    }

    if (currentQuote.length > 0) {
      items.push(currentQuote.join(' '))
    }

    return (
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700 leading-relaxed">
            <span className="font-medium text-gray-900">•</span> {item}
          </li>
        ))}
      </ul>
    )
  }

  const tabValueToContent = (value: string) => {
    switch (value) {
      case 'priorities':
        return formatContent(candidate.priorities)
      case 'economicFiscal':
        return formatContent(candidate.economicFiscal)
      case 'socialPrograms':
        return formatContent(candidate.socialPrograms)
      case 'infrastructure':
        return formatContent(candidate.infrastructure)
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate({ to: '/candidates' })} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.candidate.back}
          </Button>

          <Card className="border-gray-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{candidate.displayName}</h1>
                  <p className="text-lg text-gray-600 mb-3">{candidate.party}</p>
                  <Badge className={ideologyColors[candidate.ideology]}>
                    {candidate.ideology === 'Center-Left'
                      ? t.candidates.filters['center-left']
                      : candidate.ideology === 'Center-Right'
                      ? t.candidates.filters['center-right']
                      : t.candidates.filters[candidate.ideology.toLowerCase() as keyof typeof t.candidates.filters] || candidate.ideology}
                  </Badge>
                </div>
                <div className="flex flex-col gap-2 md:text-right">
                  {candidate.sourcePdf && (
                    <a
                      href={`/pdf/${candidate.sourcePdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center md:justify-end px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {t.candidate.downloadPdf}
                    </a>
                  )}
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{t.candidate.pages}</span> {candidate.pages}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{t.candidate.processedDate}</span> {candidate.processedDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="priorities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="priorities">{t.candidate.tabs.priorities}</TabsTrigger>
            <TabsTrigger value="economicFiscal">{t.candidate.tabs.economicFiscal}</TabsTrigger>
            <TabsTrigger value="socialPrograms">{t.candidate.tabs.socialPrograms}</TabsTrigger>
            <TabsTrigger value="infrastructure">{t.candidate.tabs.infrastructure}</TabsTrigger>
          </TabsList>

          <TabsContent value="priorities">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t.candidate.tabs.priorities}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {tabValueToContent('priorities')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="economicFiscal">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t.candidate.tabs.economicFiscal}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {tabValueToContent('economicFiscal')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="socialPrograms">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t.candidate.tabs.socialPrograms}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {tabValueToContent('socialPrograms')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="infrastructure">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
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
          <Card className="border-gray-200 mt-6">
            <CardHeader>
              <CardTitle>{t.candidate.additionalNotes}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none text-gray-700">
                {formatContent(candidate.additionalNotes)}
              </div>
            </CardContent>
          </Card>
        )}

        {relatedCandidates.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.candidate.relatedCandidates}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedCandidates.map((c) => (
                <Card key={c.slug} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <Link to={`/candidate/$slug`} params={{ slug: c.slug }}>
                      <h3 className="font-semibold text-gray-900 mb-1">{c.displayName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{c.party}</p>
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
