import { createFileRoute } from '@tanstack/react-router'
import { FileText, ExternalLink, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useI18n } from '../lib/i18n'

export const Route = createFileRoute('/methodology')({
  component: Methodology,
})

function Methodology() {
  const t = useI18n()

  const sections = [
    {
      id: 'howWeWork',
      icon: <FileText className="h-6 w-6 text-gray-600" />,
      title: t.methodology.howWeWork.heading,
      content: t.methodology.howWeWork.content,
    },
    {
      id: 'sources',
      icon: <ExternalLink className="h-6 w-6 text-gray-600" />,
      title: t.methodology.sources.heading,
      content: t.methodology.sources.content,
    },
    {
      id: 'neutralityCommitment',
      icon: <FileText className="h-6 w-6 text-gray-600" />,
      title: t.methodology.neutralityCommitment.heading,
      content: t.methodology.neutralityCommitment.content,
    },
    {
      id: 'whatWeDontDo',
      icon: <FileText className="h-6 w-6 text-gray-600" />,
      title: t.methodology.whatWeDontDo.heading,
      content: t.methodology.whatWeDontDo.content,
    },
    {
      id: 'contact',
      icon: <Mail className="h-6 w-6 text-gray-600" />,
      title: t.methodology.contact.heading,
      content: t.methodology.contact.content,
      email: t.methodology.contact.email,
    },
  ]

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.methodology.title}</h1>
          <p className="text-xl text-gray-600">{t.methodology.subtitle}</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <Card key={section.id} className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="flex-shrink-0">{section.icon}</div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                {section.email && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Contact Email:</p>
                    <a
                      href={`mailto:${section.email}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {section.email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.methodology.neutralityCommitment.heading}
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                {t.methodology.neutralityCommitment.content}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
