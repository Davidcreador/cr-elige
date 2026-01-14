import { createFileRoute, Link } from '@tanstack/react-router'
import { Users, FileText, X, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useI18n } from '../lib/i18n'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const t = useI18n()

  const stats = [
    {
      icon: <Users className="w-8 h-8 text-gray-600" />,
      value: '20',
      label: t.home.stats.candidates,
    },
    {
      icon: <FileText className="w-8 h-8 text-gray-600" />,
      value: '4',
      label: t.home.stats.policyAreas,
    },
    {
      icon: <X className="w-8 h-8 text-gray-600" />,
      value: '0',
      label: t.home.stats.opinions,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-6 text-center bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.home.heroTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t.home.heroSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="border-gray-200 bg-white">
                <CardContent className="pt-6 pb-6 flex flex-col items-center">
                  <div className="mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="border-gray-200 bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t.home.ctas.viewAll}
                </h3>
                <Link to="/candidates">
                  <Button className="w-full" variant="default">
                    {t.common.viewPlan}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t.home.ctas.compare}
                </h3>
                <Link to="/compare">
                  <Button className="w-full" variant="outline">
                    {t.compare.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.methodology.neutralityCommitment.heading}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.methodology.neutralityCommitment.content}
              </p>
              <Link to="/methodology">
                <Button variant="link" className="px-0">
                  {t.nav.methodology} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
