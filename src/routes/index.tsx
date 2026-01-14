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
      icon: <Users className="w-8 h-8 text-[#00205B]/70" />,
      value: '20',
      label: t.home.stats.candidates,
    },
    {
      icon: <FileText className="w-8 h-8 text-[#00205B]/70" />,
      value: '4',
      label: t.home.stats.policyAreas,
    },
    {
      icon: <X className="w-8 h-8 text-[#00205B]/70" />,
      value: '0',
      label: t.home.stats.opinions,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-hero">
      <section className="py-20 md:py-28 px-6 text-center relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="mb-12 animate-fade-up">
            <h1 className="display-hero text-gradient-warm mb-8 relative">
              {t.home.heroTitle}
              <span className="absolute -right-2 -top-1 w-1.5 h-1.5 rounded-full bg-[#EF3340]" />
            </h1>
            <p className="lead text-[var(--muted-foreground)] mb-12 max-w-3xl mx-auto">
              {t.home.heroSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-up" style={{ animationDelay: '100ms' }}>
            {stats.map((stat, index) => (
              <Card key={index} className="card-elevated">
                <CardContent className="pt-8 pb-8 flex flex-col items-center">
                  <div className="mb-5">{stat.icon}</div>
                    <div className="font-display text-4xl font-bold text-[var(--foreground)] mb-3 tracking-tight">
                      {stat.value}
                    </div>
                  <div className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
            <Card className="card-elevated">
              <CardContent className="pt-8 pb-8">
                <h3 className="heading-medium mb-6">
                  {t.home.ctas.viewAll}
                </h3>
                <Link to="/candidates">
                  <Button className="w-full" size="lg">
                    {t.common.viewPlan}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="pt-8 pb-8">
                <h3 className="heading-medium mb-6">
                  {t.home.ctas.compare}
                </h3>
                <Link to="/compare">
                  <Button className="w-full" size="lg" variant="outline">
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
        <div className="container mx-auto max-w-4xl">
          <Card className="card-elevated">
            <CardContent className="pt-10 pb-10">
              <h2 className="display-large mb-6">
                {t.methodology.neutralityCommitment.heading}
              </h2>
              <p className="body-relaxed text-[var(--muted-foreground)] mb-8 text-lg">
                {t.methodology.neutralityCommitment.content}
              </p>
              <Link to="/methodology">
                <Button variant="link" className="px-0 text-base font-medium">
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
