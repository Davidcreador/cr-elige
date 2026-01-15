import AlvaroRamosSummary from './summaries/LiberacionNacional-AlvaroRamos-summary.md?raw'
import AndresRoblesSummary from './summaries/FrenteAmplio-AndresRobles-summary.md?raw'
import AnaVirginiaCalzadaSummary from './summaries/CentroDemocraticoySocial-AnaVirginiaCalzada-summary.md?raw'
import ClaudiaDoblesSummary from './summaries/CoalicionAgendaCiudadana-ClaudiaDobles-summary.md?raw'
import DavidHernandezSummary from './summaries/DeLaClaseTrabajadora-DavidHernandez-summary.md?raw'
import DouglasCaamanoSummary from './summaries/AlianzaCostaRicaPrimero-DouglasCaamano-summary.md?raw'
import EliecerFeinzaigSummary from './summaries/LiberalProgresista-EliecerFeinzaig-summary.md?raw'
import FernandoZamoraSummary from './summaries/NuevaGeneracion-FernandoZamora-summary.md?raw'
import FabricioAlvaradoSummary from './summaries/NuevaRepublica-FabricioAlvarado-summary.md?raw'
import JuanCarlosHidalgoSummary from './summaries/UnidadSocialCristiana-JuanCarlosHidalgo-summary.md?raw'
import JoseAguilarSummary from './summaries/Avanza-JoseAguilar-summary.md?raw'
import ClaudioAlpizarSummary from './summaries/EsperanzaNacional-ClaudioAlpizar-summary.md?raw'
import MarcoRodriguezSummary from './summaries/EsperanzayLibertad-MarcoRodriguez-summary.md?raw'
import LuisEstebanAmadorSummary from './summaries/IntegracionNacional-LuisEstebanAmador-summary.md?raw'
import LuzMaryAlpizarSummary from './summaries/ProgresoSocialDemocratico-LuzMaryAlpizar-summary.md?raw'
import LauraFernandezSummary from './summaries/PuebloSoberano-LauraFernandez-summary.md?raw'
import NataliaDiazSummary from './summaries/UnidosPodemos-NataliaDiaz-summary.md?raw'
import RonnyCastilloSummary from './summaries/AquiCostaRicaManda-RonnyCastillo-summary.md?raw'
import WalterRubenHernandezSummary from './summaries/JusticiaSocialCostarricense-WalterRubenHernandez-summary.md?raw'
import BorisMolinaSummary from './summaries/UnionCostarricenseDemocratica-BorisMolina-summary.md?raw'

export const candidateSummaries = {
  'LiberacionNacional-AlvaroRamos-summary.md': AlvaroRamosSummary,
  'FrenteAmplio-AndresRobles-summary.md': AndresRoblesSummary,
  'CentroDemocraticoySocial-AnaVirginiaCalzada-summary.md': AnaVirginiaCalzadaSummary,
  'CoalicionAgendaCiudadana-ClaudiaDobles-summary.md': ClaudiaDoblesSummary,
  'DeLaClaseTrabajadora-DavidHernandez-summary.md': DavidHernandezSummary,
  'AlianzaCostaRicaPrimero-DouglasCaamano-summary.md': DouglasCaamanoSummary,
  'LiberalProgresista-EliecerFeinzaig-summary.md': EliecerFeinzaigSummary,
  'NuevaGeneracion-FernandoZamora-summary.md': FernandoZamoraSummary,
  'NuevaRepublica-FabricioAlvarado-summary.md': FabricioAlvaradoSummary,
  'UnidadSocialCristiana-JuanCarlosHidalgo-summary.md': JuanCarlosHidalgoSummary,
  'Avanza-JoseAguilar-summary.md': JoseAguilarSummary,
  'EsperanzaNacional-ClaudioAlpizar-summary.md': ClaudioAlpizarSummary,
  'EsperanzayLibertad-MarcoRodriguez-summary.md': MarcoRodriguezSummary,
  'IntegracionNacional-LuisEstebanAmador-summary.md': LuisEstebanAmadorSummary,
  'ProgresoSocialDemocratico-LuzMaryAlpizar-summary.md': LuzMaryAlpizarSummary,
  'PuebloSoberano-LauraFernandez-summary.md': LauraFernandezSummary,
  'UnidosPodemos-NataliaDiaz-summary.md': NataliaDiazSummary,
  'AquiCostaRicaManda-RonnyCastillo-summary.md': RonnyCastilloSummary,
  'JusticiaSocialCostarricense-WalterRubenHernandez-summary.md': WalterRubenHernandezSummary,
  'UnionCostarricenseDemocratica-BorisMolina-summary.md': BorisMolinaSummary,
} as const

export function getSummaryFile(filename: string): string {
  const summary = candidateSummaries[filename as keyof typeof candidateSummaries]
  if (!summary) {
    throw new Error(`Markdown file not found: ${filename}`)
  }
  return summary
}
