import { createElement as h, createContext, useContext, useState, ReactNode } from 'react'

export type Locale = 'es' | 'en'

const translations = {
  es: {
    nav: {
      home: 'Inicio',
      candidates: 'Candidatos',
      compare: 'Comparar',
      methodology: 'Metodología',
    },
    home: {
      heroTitle: 'Entiende a los candidatos en 10 minutos',
      heroSubtitle: 'Información neutral basada en los planes de gobierno oficiales',
      stats: {
        candidates: '20 Candidatos',
        policyAreas: '4 Áreas de Política',
        opinions: '0 Opiniones',
      },
      ctas: {
        viewAll: 'Ver Todos los Candidatos',
        compare: 'Comparar Candidatos',
      },
    },
    candidates: {
      searchPlaceholder: 'Buscar candidato...',
      filter: 'Filtrar por ideología:',
      filters: {
        all: 'Todos',
        left: 'Izquierda',
        'center-left': 'Centro-Izquierda',
        center: 'Centro',
        'center-right': 'Centro-Derecha',
        right: 'Derecha',
      },
      sort: 'Ordenar por:',
      sortOptions: {
        'name-asc': 'Nombre A-Z',
        'name-desc': 'Nombre Z-A',
        'ideology-asc': 'Ideología (Izq-Der)',
        'ideology-desc': 'Ideología (Der-Izq)',
      },
      viewPlan: 'Ver Plan',
    },
    candidate: {
      back: 'Volver',
      downloadPdf: 'Descargar PDF',
      source: 'Fuente:',
      pages: 'Páginas:',
      processedDate: 'Fecha de procesamiento:',
      tabs: {
        priorities: 'Prioridades Principales',
        economicFiscal: 'Planes Económicos y Fiscales',
        socialPrograms: 'Programas Sociales y Reformas',
        infrastructure: 'Infraestructura y Medio Ambiente',
      },
      additionalNotes: 'Notas Adicionales',
      relatedCandidates: 'Candidatos con ideología similar',
    },
    compare: {
      title: 'Comparar Candidatos',
      select1: 'Candidato 1',
      select2: 'Candidato 2',
      select3: 'Candidato 3 (opcional)',
      selectPlaceholder: 'Seleccionar candidato...',
      print: 'Imprimir',
      clear: 'Limpiar selección',
      tabs: {
        priorities: 'Prioridades',
        economicFiscal: 'Economía',
        socialPrograms: 'Sociales',
        infrastructure: 'Infraestructura',
      },
    },
    methodology: {
      title: 'Metodología',
      subtitle: 'Nuestro compromiso con la transparencia y la neutralidad',
      sections: {
        howWeWork: 'Cómo Trabajamos',
        sources: 'Fuentes',
        neutralityCommitment: 'Compromiso de Neutralidad',
        whatWeDontDo: 'Lo Que No Hacemos',
        contact: 'Contacto',
      },
      howWeWork: {
        heading: 'Cómo Trabajamos',
        content:
          'Extraemos información de los planes de gobierno oficiales de cada partido político. Utilizamos inteligencia artificial para el análisis inicial, seguido de una revisión humana exhaustiva para garantizar la precisión. No emitimos opiniones; presentamos los hechos tal como están documentados en las fuentes originales.',
      },
      sources: {
        heading: 'Fuentes',
        content: 'Nuestras fuentes incluyen: planes de gobierno oficiales en formato PDF, sitios web de los partidos políticos, documentos del Tribunal Supremo de Elecciones (TSE), y otros registros públicos oficiales. Todos los documentos están disponibles para consulta y descarga.',
      },
      neutralityCommitment: {
        heading: 'Compromiso de Neutralidad',
        content:
          'No realizamos rankings, calificaciones ni evaluaciones de ningún tipo. Presentamos la misma estructura para todos los candidatos. Utilizamos citas directas de los documentos originales sin interpretación o parafraseo. Mantenemos independencia editorial total de cualquier partido político o afiliación.',
      },
      whatWeDontDo: {
        heading: 'Lo Que No Hacemos',
        content:
          'No hacemos respaldos políticos ni recomendaciones de voto. No publicamos artículos de opinión ni análisis editorial. No ofrecemos encuestas predictivas ni proyecciones electorales. No comentamos las propuestas de los candidatos ni proporcionamos valoraciones subjetivas.',
      },
      contact: {
        heading: 'Contacto',
        content:
          'Para reportar errores, proporcionar retroalimentación o hacer preguntas, contáctenos por correo electrónico. Este proyecto es de código abierto y transparente. Estamos comprometidos con la mejora continua basada en el aporte de la comunidad.',
        email: 'contacto@cr-elige.org',
      },
    },
    common: {
      viewPlan: 'Ver Plan',
      back: 'Volver',
      print: 'Imprimir',
    },
  },
  en: {
    nav: {
      home: 'Home',
      candidates: 'Candidates',
      compare: 'Compare',
      methodology: 'Methodology',
    },
    home: {
      heroTitle: 'Understand Candidates in 10 Minutes',
      heroSubtitle: 'Neutral information based on official government plans',
      stats: {
        candidates: '20 Candidates',
        policyAreas: '4 Policy Areas',
        opinions: '0 Opinions',
      },
      ctas: {
        viewAll: 'View All Candidates',
        compare: 'Compare Candidates',
      },
    },
    candidates: {
      searchPlaceholder: 'Search candidate...',
      filter: 'Filter by ideology:',
      filters: {
        all: 'All',
        left: 'Left',
        'center-left': 'Center-Left',
        center: 'Center',
        'center-right': 'Center-Right',
        right: 'Right',
      },
      sort: 'Sort by:',
      sortOptions: {
        'name-asc': 'Name A-Z',
        'name-desc': 'Name Z-A',
        'ideology-asc': 'Ideology (L-R)',
        'ideology-desc': 'Ideology (R-L)',
      },
      viewPlan: 'View Plan',
    },
    candidate: {
      back: 'Back',
      downloadPdf: 'Download PDF',
      source: 'Source:',
      pages: 'Pages:',
      processedDate: 'Processed Date:',
      tabs: {
        priorities: 'Main Priorities',
        economicFiscal: 'Economic & Fiscal Plans',
        socialPrograms: 'Social Programs & Reforms',
        infrastructure: 'Infrastructure & Environment',
      },
      additionalNotes: 'Additional Notes',
      relatedCandidates: 'Similar Ideology Candidates',
    },
    compare: {
      title: 'Compare Candidates',
      select1: 'Candidate 1',
      select2: 'Candidate 2',
      select3: 'Candidate 3 (optional)',
      selectPlaceholder: 'Select candidate...',
      print: 'Print',
      clear: 'Clear Selection',
      tabs: {
        priorities: 'Priorities',
        economicFiscal: 'Economy',
        socialPrograms: 'Social',
        infrastructure: 'Infrastructure',
      },
    },
    methodology: {
      title: 'Methodology',
      subtitle: 'Our commitment to transparency and neutrality',
      sections: {
        howWeWork: 'How We Work',
        sources: 'Sources',
        neutralityCommitment: 'Neutrality Commitment',
        whatWeDontDo: "What We Don't Do",
        contact: 'Contact',
      },
      howWeWork: {
        heading: 'How We Work',
        content:
          'We extract information from official government plans of each political party. We use artificial intelligence for initial analysis, followed by thorough human review to ensure accuracy. We do not express opinions; we present facts as documented in original sources.',
      },
      sources: {
        heading: 'Sources',
        content:
          'Our sources include: official government plans in PDF format, political party websites, Tribunal Supremo de Elecciones (TSE) documents, and other official public records. All documents are available for consultation and download.',
      },
      neutralityCommitment: {
        heading: 'Neutrality Commitment',
        content:
          'We do not create rankings, scores, or evaluations of any kind. We present the same structure for all candidates. We use direct quotes from original documents without interpretation or paraphrasing. We maintain complete editorial independence from any political party or affiliation.',
      },
      whatWeDontDo: {
        heading: 'What We Don\'t Do',
        content:
          'We do not make political endorsements or voting recommendations. We do not publish opinion pieces or editorial analysis. We do not offer predictive polling or electoral projections. We do not comment on candidates\' proposals or provide subjective assessments.',
      },
      contact: {
        heading: 'Contact',
        content:
          'To report errors, provide feedback, or ask questions, contact us via email. This project is open source and transparent. We are committed to continuous improvement based on community input.',
        email: 'contact@cr-elige.org',
      },
    },
    common: {
      viewPlan: 'View Plan',
      back: 'Back',
      print: 'Print',
    },
  },
}

type Translations = typeof translations.es

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es')

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale],
  }

  return h(I18nContext.Provider, { value }, children)
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context.t
}

export function useLocale() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within an I18nProvider')
  }
  return {
    locale: context.locale,
    setLocale: context.setLocale,
  }
}

export function useTranslations() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useTranslations must be used within an I18nProvider')
  }
  return context
}
