import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { catalogRoute } from '../../app/router'
import { Button } from '../../components/ui/button'
import type { CatalogCategory, CatalogSort } from '../../domain/catalog/catalog'
import { useCatalog } from './queries'
import { Artwork } from './Artwork'
import { HomeHero, HomeJournal, HomePromos } from './HomeSections'

const categories: { value: CatalogCategory; label: string; count: number }[] = [
  { value: 'art', label: 'Arte digital', count: 33 },
  { value: 'photography', label: 'Fotografia', count: 12 },
  { value: 'music', label: 'Música', count: 65 },
  { value: 'art-3d', label: 'Arte 3D', count: 39 },
  { value: 'collectibles', label: 'Colecionáveis', count: 23 },
  { value: 'generative', label: 'Generativa', count: 17 },
  { value: 'games', label: 'Jogos', count: 19 },
  { value: 'subscriptions', label: 'Assinaturas', count: 13 },
  { value: 'utility', label: 'Utilidade', count: 18 },
]

const networks = [
  { value: 'Ethereum', count: 119 },
  { value: 'Polygon', count: 78 },
  { value: 'Solana', count: 86 },
] as const

const marketTabs: { label: string; sort: CatalogSort }[] = [
  { label: 'Todos os NFTs', sort: 'featured' },
  { label: 'Novos lançamentos', sort: 'newest' },
  { label: 'Em alta', sort: 'price-desc' },
]

export function CatalogPage() {
  const search = catalogRoute.useSearch()
  const navigate = useNavigate({ from: '/' })
  const [draft, setDraft] = useState(search.q)
  const [minimumPrice, setMinimumPrice] = useState(0.02)
  const [maximumPrice, setMaximumPrice] = useState(12.3)
  const [network, setNetwork] = useState<string>('all')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const catalog = useCatalog(search)
  const visibleItems = (catalog.data?.items ?? []).filter((nft) => {
    const price = Number(nft.priceEth)
    return price >= minimumPrice && price <= maximumPrice && (network === 'all' || (nft.network ?? 'Ethereum') === network)
  })
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void navigate({ search: (previous) => ({ ...previous, q: draft.trim(), page: 1 }) })
  }
  const chooseCategory = (category: CatalogCategory) => {
    void navigate({ search: (previous) => ({ ...previous, category, page: 1 }) })
  }
  const chooseSort = (sort: CatalogSort) => {
    void navigate({ search: (previous) => ({ ...previous, category: 'all', sort, page: 1 }) })
  }
  const updatePage = (page: number) => {
    void navigate({ search: (previous) => ({ ...previous, page: Math.max(1, page) }) })
  }
  const defaultTabActive = search.category === 'all' && search.sort === 'featured'

  return <>
    <form id="catalog-search" className="mx-auto mt-10 flex h-[46px] w-[calc(100%-48px)] items-center gap-2 rounded-lg bg-kurio-panel px-3 md:hidden" role="search" onSubmit={submitSearch}>
      <label className="sr-only" htmlFor="catalog-query">Buscar artes</label><Search size={18} className="shrink-0 text-kurio-muted" />
      <input id="catalog-query" className="min-w-0 flex-1 bg-transparent font-kurio text-[13px] text-kurio-ink outline-none placeholder:text-kurio-muted" type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Explorar coleções" />
      <button type="submit" aria-label="Buscar" className="sr-only">Buscar</button>
      <button type="button" className="grid size-11 place-items-center rounded-lg bg-kurio-accent text-kurio-canvas" aria-label="Abrir filtros" aria-expanded={mobileFiltersOpen} onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}><SlidersHorizontal size={17} /></button>
    </form>
    <HomeHero />

    <section className="mx-auto mt-0 w-[calc(100%-40px)] scroll-mt-5 pb-16 pt-0 sm:mt-8 sm:w-[calc(100%-48px)] md:pb-20 xl:mt-[96px] xl:h-[1373px] xl:w-[1200px] xl:pb-0 xl:pt-0" id="discover" aria-labelledby="catalog-title">
      <h2 id="catalog-title" className="sr-only">Mercado de NFTs</h2>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[25.8333%_minmax(0,1fr)] md:gap-[4%] xl:grid-cols-[310px_842px] xl:gap-[48px]">
        <div className="min-w-0">
        <aside className={`${mobileFiltersOpen ? 'grid' : 'hidden'} min-w-0 content-start gap-4 bg-kurio-panel p-4 sm:grid-cols-2 md:grid md:grid-cols-1 md:gap-4 md:p-[1.5vw] xl:h-[785px] xl:gap-5 xl:p-5`} id="catalog-filters" aria-label="Filtros do mercado">
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="mb-2 font-kurio text-xs font-semibold text-kurio-ink md:mb-2.5 md:text-[12px]">Coleções</h3>
            <div className="grid gap-0.5" role="group" aria-label="Filtrar por categoria">
              {categories.map(({ value, label, count }) => <button key={value} type="button" className={`flex w-full items-center justify-between px-1 py-1 text-left font-kurio text-[10px] transition-colors md:py-[3px] md:text-[10px] ${search.category === value || (search.category === 'all' && value === 'art') ? 'text-kurio-amber' : 'text-kurio-muted hover:text-kurio-amber'}`} aria-pressed={search.category === value} onClick={() => chooseCategory(value)}><span>{label}</span><span>({count})</span></button>)}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-kurio text-xs font-semibold text-kurio-ink md:mb-2.5 md:text-[12px]">Faixa de preço</h3>
            <div className="relative my-3 h-2 rounded-full" style={{ background: `linear-gradient(to right, var(--color-kurio-line-soft) ${minimumPrice / 12.3 * 100}%, var(--color-kurio-accent) ${minimumPrice / 12.3 * 100}%, var(--color-kurio-accent) ${maximumPrice / 12.3 * 100}%, var(--color-kurio-line-soft) ${maximumPrice / 12.3 * 100}%)` }}>
              <input className="absolute inset-0 h-2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-kurio-canvas [&::-webkit-slider-thumb]:bg-kurio-accent [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-kurio-canvas [&::-moz-range-thumb]:bg-kurio-accent [&::-moz-range-thumb]:pointer-events-auto" aria-label="Preço mínimo em ETH" type="range" min="0" max="12.3" step="0.01" value={minimumPrice} onChange={(event) => setMinimumPrice(Math.min(Number(event.target.value), maximumPrice))} />
              <input className="absolute inset-0 h-2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-kurio-canvas [&::-webkit-slider-thumb]:bg-kurio-accent [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-kurio-canvas [&::-moz-range-thumb]:bg-kurio-accent [&::-moz-range-thumb]:pointer-events-auto" aria-label="Preço máximo em ETH" type="range" min="0" max="12.3" step="0.01" value={maximumPrice} onChange={(event) => setMaximumPrice(Math.max(Number(event.target.value), minimumPrice))} />
            </div>
            <p className="mb-2 font-kurio text-[9px] text-kurio-muted md:mb-2.5 md:text-[10px]">Preço: {minimumPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} – {maximumPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ETH</p>
            <button type="button" className="rounded-sm bg-kurio-accent px-2.5 py-1 font-kurio text-[10px] font-bold text-kurio-canvas hover:bg-kurio-amber md:text-[11px]" onClick={() => updatePage(1)}>Aplicar</button>
          </div>

          <div>
            <h3 className="mb-2 font-kurio text-xs font-semibold text-kurio-ink md:mb-2.5 md:text-[12px]">Rede</h3>
            <div className="grid gap-0.5" role="group" aria-label="Filtrar por rede">
              {networks.map(({ value, count }) => <button key={value} type="button" className={`flex w-full items-center justify-between px-1 py-1 text-left font-kurio text-[10px] transition-colors md:py-[3px] ${network === value ? 'text-kurio-amber' : 'text-kurio-muted hover:text-kurio-amber'}`} aria-pressed={network === value} onClick={() => setNetwork(network === value ? 'all' : value)}><span>{value}</span><span>({count})</span></button>)}
            </div>
          </div>
        </aside>
        <Link to="/nft/$nftId" params={{ nftId: 'monolith-02' }} className={`${mobileFiltersOpen ? 'block' : 'hidden'} mt-3 bg-kurio-panel pt-3 text-center md:block xl:mt-6 xl:h-[470px] xl:pt-5`}>
          <strong className="block font-kurio text-xs font-bold text-kurio-amber">NFT EM DESTAQUE</strong>
          <span className="mt-1 block font-kurio text-[11px] font-bold text-kurio-ink">OFERTA LIMITADA</span>
          <img className="mt-2 aspect-square w-full rounded-t-xl object-cover xl:mt-[18px] xl:h-[368px] xl:aspect-auto" src="/assets/nfts/sage-nomad.png" alt="Cosmic Bloom #118 em destaque" loading="lazy" />
        </Link>
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex h-6 items-center justify-between gap-4 border-b border-kurio-line pb-2 xl:mb-[26px] xl:h-6 xl:pb-2">
            <div className="hidden items-center gap-5 md:flex" role="group" aria-label="Navegar pelo catálogo">
              {marketTabs.map(({ label, sort }) => {
                const active = sort === 'featured' ? defaultTabActive : search.sort === sort
                return <button key={sort} type="button" className={`relative whitespace-nowrap pb-1 font-kurio text-[11px] ${active ? 'font-semibold text-kurio-amber after:absolute after:inset-x-0 after:-bottom-[9px] after:h-px after:bg-kurio-accent' : 'text-kurio-ink'}`} aria-pressed={active} onClick={() => chooseSort(sort)}>{label}</button>
              })}
            </div>
            <div className="flex w-full items-center justify-between gap-3 md:hidden">
              <div className="flex min-w-0 items-center gap-4 overflow-x-auto" role="group" aria-label="Navegar pelo catálogo">
              {marketTabs.map(({ label, sort }) => {
                  const active = sort === 'featured' ? defaultTabActive : search.sort === sort
                  return <button key={sort} type="button" className={`whitespace-nowrap pb-1 font-kurio text-[10px] ${active ? 'border-b border-kurio-accent font-semibold text-kurio-amber' : 'text-kurio-ink'}`} aria-pressed={active} onClick={() => chooseSort(sort)}>{label}</button>
                })}
              </div>
              <button type="button" className="shrink-0 font-kurio text-[9px] text-kurio-muted" onClick={() => chooseSort('newest')}>Recentes</button>
            </div>
            <label className="hidden shrink-0 items-center gap-1 whitespace-nowrap font-kurio text-[10px] text-kurio-muted md:flex" htmlFor="sort-select">Ordenar por:
              <select id="sort-select" className="max-w-44 appearance-none bg-transparent text-kurio-ink outline-none" value={search.sort} onChange={(event) => chooseSort(event.target.value as CatalogSort)}><option value="featured">Listados recentemente</option><option value="newest">Novos lançamentos</option><option value="price-asc">Menor preço</option><option value="price-desc">Em alta</option></select><ChevronDown size={12} />
            </label>
          </div>

          {catalog.isPending ? <div className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-[4.75%] md:gap-y-10" aria-label="Carregando artes" aria-busy="true">{Array.from({ length: 9 }, (_, index) => <div className="min-w-0" key={index}><div className="aspect-square animate-pulse bg-kurio-panel" /><div className="mt-3 h-2.5 w-3/5 animate-pulse bg-kurio-panel" /><div className="mt-2 h-2.5 w-1/3 animate-pulse bg-kurio-panel" /></div>)}</div> : null}
          {catalog.isError ? <div className="py-16 text-center font-kurio" role="alert"><h3 className="text-lg font-bold">Não foi possível carregar a coleção.</h3><p className="mt-2 text-xs text-kurio-muted">Tente novamente em instantes.</p><Button onClick={() => void catalog.refetch()}>Tentar novamente</Button></div> : null}
          {!catalog.isPending && !catalog.isError && visibleItems.length === 0 ? <div className="py-16 text-center font-kurio"><h3 className="text-lg font-bold">Nenhum NFT encontrado.</h3><p className="mt-2 text-xs text-kurio-muted">Ajuste a busca ou os filtros para ver mais resultados.</p><Button variant="secondary" onClick={() => { setDraft(''); setNetwork('all'); setMinimumPrice(0.02); setMaximumPrice(12.3); void navigate({ search: { q: '', category: 'all', sort: 'featured', page: 1 } }) }}>Limpar filtros</Button></div> : null}

          {visibleItems.length > 0 ? <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 md:grid-cols-3 md:gap-x-[4.75%] md:gap-y-10 xl:grid-cols-[repeat(3,258px)] xl:gap-x-[34px] xl:gap-y-[72px]">
            {visibleItems.map((nft) => <article className="relative min-w-0 xl:h-[356px]" key={nft.id}>
              <Link to="/nft/$nftId" params={{ nftId: nft.id }} className="relative block aspect-square bg-kurio-panel p-1 xl:h-[300px] xl:aspect-auto xl:p-0" aria-label={`Ver ${nft.name}`}><Artwork nft={nft} className={`aspect-square w-full xl:absolute xl:left-1 xl:w-[250px] ${nft.id === 'orbit-01' ? 'xl:top-[31px] xl:h-[250px]' : nft.id === 'flora-08' ? 'xl:top-[25px] xl:h-[250px]' : nft.id === 'afterglow-3' ? 'xl:top-6 xl:h-[250px]' : nft.id === 'monolith-02' ? 'xl:left-5 xl:top-[6px] xl:h-[286px] xl:w-[224px]' : nft.id === 'golden-beat-207' ? 'xl:top-5 xl:h-[250px]' : nft.id === 'golden-frequency-071' ? 'xl:top-7 xl:h-[250px]' : nft.id === 'golden-signal-160' ? 'xl:top-5 xl:h-[250px]' : 'xl:top-6 xl:h-[250px]'}`} /></Link>
              {nft.id !== 'golden-frequency-071' ? <div className="pt-2 font-kurio xl:absolute xl:left-0 xl:top-[312px] xl:pt-0">
                <h3 className="text-[11px] font-normal leading-tight text-kurio-ink xl:text-[12px]"><Link to="/nft/$nftId" params={{ nftId: nft.id }}>{nft.name}</Link></h3>
                <p className="mt-0.5 flex items-baseline gap-2 text-[11px] font-bold leading-tight text-kurio-amber xl:text-[12px]"><span>{nft.priceEth} ETH</span>{nft.id === 'afterglow-3' ? <del className="font-normal text-kurio-muted">2.29 ETH</del> : null}</p>
              </div> : null}
            </article>)}
          </div> : null}

          {!catalog.isPending && !catalog.isError ? <nav className="mt-8 flex justify-end gap-1.5 xl:mt-[68px] xl:pr-[115px]" aria-label="Paginação do catálogo">
            {[1, 2, 3, 4].map((page) => <button key={page} type="button" className={`grid size-8 place-items-center rounded-sm border border-kurio-line font-kurio text-[11px] xl:size-[35px] ${search.page === page ? 'border-kurio-accent bg-kurio-accent font-bold text-kurio-canvas' : 'text-kurio-ink hover:border-kurio-accent'}`} aria-current={search.page === page ? 'page' : undefined} onClick={() => updatePage(page)}>{page}</button>)}
            <button type="button" className="grid size-8 place-items-center rounded-sm border border-kurio-line text-kurio-ink hover:border-kurio-accent xl:size-[35px]" aria-label="Próxima página" onClick={() => updatePage(search.page + 1)}>›</button>
          </nav> : null}
        </div>
      </div>
    </section>

    <HomePromos />
    <HomeJournal />
  </>
}

