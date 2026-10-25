const journalEntries = [
  { image: 'ivory-baron', alt: 'Gorila de terno claro', date: '12 de setembro', reading: 'Leitura de 6 min', title: 'Como funciona a propriedade de NFTs', summary: 'Aprenda a colecionar, negociar e verificar ativos digitais.' },
  { image: 'emerald-ape', alt: 'Macaco com óculos e jaqueta verde', date: '13 de setembro', reading: 'Leitura de 2 min', title: '10 artistas digitais para acompanhar', summary: 'Conheça criadores que moldam a cultura digital.' },
  { image: 'sage-nomad', alt: 'Macaco de chapéu e moletom roxo', date: '15 de setembro', reading: 'Leitura de 3 min', title: 'Raridade, atributos e procedência', summary: 'Entenda raridade, procedência, direitos autorais e utilidade.' },
  { image: 'golden-beat', alt: 'Macaco dourado com fones de ouvido', date: '15 de setembro', reading: 'Leitura de 2 min', title: 'Como proteger sua carteira', summary: 'Proteja sua carteira, seus ativos e sua identidade.' },
]

export function HomeHero() {
  return <section aria-labelledby="home-hero-title" className="relative mx-auto mt-4 grid w-[calc(100%-48px)] grid-cols-[minmax(0,1fr)_38%] items-center gap-3 rounded-2xl bg-kurio-panel sm:mt-[29px] sm:w-[calc(100%-48px)] sm:grid-cols-[minmax(0,1fr)_36vw] sm:gap-5 sm:pl-5 xl:h-[450px] xl:w-[1200px] xl:grid-cols-[600px_450px] xl:gap-[110px] xl:rounded-none xl:bg-transparent xl:pl-10">
    <div className="flex min-w-0 flex-col gap-4 py-4 sm:min-h-[330px] sm:justify-between sm:gap-0 sm:py-0 xl:h-[364px] xl:gap-0">
      <div className="flex flex-col gap-4 xl:gap-8">
        <div className="flex flex-col gap-2 text-kurio-ink">
          <p className="font-kurio text-[10px] tracking-[1px] sm:text-[12px] xl:text-[14px] xl:tracking-[1.4px]">Bem-vindo à Kurio</p>
          <h1 id="home-hero-title" className="font-kurio text-[clamp(17px,3.2vw,43px)] font-bold leading-[1.45] sm:leading-[1.62] xl:text-[43px] xl:leading-[70px]"><span className="sm:hidden">SEJA DONO DA<br />CULTURA DIGITAL</span><span className="hidden sm:inline">SEJA DONO DO FUTURO<br />DA ARTE DIGITAL</span></h1>
        </div>
        <p className="max-w-[557px] font-kurio text-[9px] leading-[1.55] text-kurio-muted sm:text-[12px] sm:leading-6 xl:text-[14px]"><span className="sm:hidden">Descubra NFTs selecionados de criadores do mundo todo.</span><span className="hidden sm:inline">Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.</span></p>
        <a href="#discover" className="inline-flex h-8 w-fit items-center justify-center rounded-[6px] bg-kurio-accent px-5 font-kurio text-[10px] font-bold text-kurio-canvas sm:h-10 sm:w-[140px] sm:text-[12px] xl:text-[16px]">EXPLORAR <span className="ml-1 sm:hidden" aria-hidden="true">→</span></a>
      </div>
      <div className="absolute bottom-[10px] left-1/2 flex w-10 -translate-x-1/2 items-center justify-between sm:static sm:left-auto sm:translate-x-0 sm:self-end" aria-label="Slide 1 de 3">
        <span className="size-[7px] rounded-full bg-kurio-accent" /><span className="size-[7px] rounded-full bg-kurio-accent" /><span className="size-[7px] rounded-full bg-kurio-accent" />
      </div>
    </div>
    <img className="aspect-square w-full rounded-xl object-cover sm:rounded-[20px] xl:size-[450px] xl:rounded-[24px]" src="/assets/nfts/emerald-ape.png" alt="Emerald Ape com óculos e jaqueta verde" fetchPriority="high" />
  </section>
}

export function HomePromos() {
  return <section aria-label="Coleções em destaque" className="mx-auto mt-6 grid w-[calc(100%-40px)] grid-cols-1 gap-4 sm:mt-24 sm:w-[calc(100%-48px)] sm:grid-cols-2 sm:gap-6 xl:mt-24 xl:w-[1200px] xl:grid-cols-[586px_586px] xl:gap-7">
    <PromoCard image="emerald-ape" title={<>Lançamentos gênesis<br />de edição limitada</>} description="Colecione edições escassas diretamente dos criadores antes da revelação pública." />
    <PromoCard image="ivory-baron" title={<>Arte digital selecionada<br />e muito mais</>} description="Explore novos artistas, coleções verificadas e obras digitais que definem a cultura." />
  </section>
}

function PromoCard({ image, title, description }: { image: string; title: React.ReactNode; description: string }) {
  return <article className="relative h-[180px] overflow-hidden rounded-lg bg-kurio-panel sm:h-[220px] xl:h-[250px]">
    <img src={`/assets/nfts/${image}.png`} alt="" className="absolute inset-y-0 left-0 h-full w-1/2 rounded-[18px] object-cover xl:left-[-5px] xl:w-[292px]" loading="lazy" />
    <div className="absolute right-4 top-6 z-[1] w-[48%] text-right sm:right-6 sm:top-9 xl:right-[30px] xl:top-[37px] xl:w-[263px]">
      <h2 className="font-kurio text-[12px] font-bold leading-5 text-kurio-ink sm:text-[16px] xl:text-[18px] xl:leading-6">{title}</h2>
      <p className="mt-2 font-kurio text-[9px] leading-[1.65] text-kurio-muted sm:text-[11px] sm:leading-6 xl:mt-2 xl:text-[14px]">{description}</p>
    </div>
    <a href="#discover" className="absolute bottom-4 right-4 z-[2] inline-flex h-8 items-center justify-center gap-2 rounded-[6px] bg-kurio-accent px-4 font-kurio text-[10px] font-medium text-kurio-canvas sm:bottom-6 sm:right-6 sm:h-10 sm:w-[140px] sm:text-[12px] xl:bottom-[46px] xl:right-[30px] xl:text-[14px]">Explorar <span aria-hidden="true">→</span></a>
  </article>
}

export function HomeJournal() {
  return <section id="journal" aria-labelledby="journal-title" className="mx-auto mt-6 w-[calc(100%-40px)] text-kurio-ink sm:mt-24 sm:w-[calc(100%-48px)] xl:mt-24 xl:h-[476px] xl:w-[1200px]">
    <header className="flex h-auto flex-col items-center gap-2 text-center xl:h-[67px] xl:gap-3">
      <h2 id="journal-title" className="font-kurio text-[20px] font-bold leading-6 sm:text-[24px] xl:text-[28px]">Diário da Cunhagem</h2>
      <p className="font-kurio text-[10px] leading-4 text-kurio-muted sm:text-[12px] xl:text-[14px]">Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.</p>
    </header>
    <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-4 xl:mt-10 xl:grid-cols-[repeat(4,268px)] xl:gap-6">
      {journalEntries.map((entry) => <article className="flex min-w-0 flex-col overflow-hidden rounded-lg bg-kurio-panel xl:h-[369px]" key={entry.title}>
        <img src={`/assets/nfts/${entry.image}.png`} alt={entry.alt} className="aspect-[1.37] w-full object-cover xl:h-[195px] xl:shrink-0" loading="lazy" />
        <div className="flex min-h-[174px] flex-1 flex-col items-start gap-2 px-3 py-3 xl:px-4">
          <p className="font-kurio text-[8px] leading-3 text-kurio-muted sm:text-[10px] xl:text-[12px] xl:leading-4">{entry.date}<span className="mx-2">|</span>{entry.reading}</p>
          <h3 className="font-kurio text-[10px] font-bold leading-[1.35] text-kurio-ink sm:text-[12px] xl:text-[16px]">{entry.title}</h3>
          <p className="font-kurio text-[9px] leading-[1.55] text-kurio-muted sm:text-[10px] xl:text-[12px] xl:leading-4">{entry.summary}</p>
          <a className="mt-auto font-kurio text-[9px] font-bold text-kurio-amber sm:text-[10px] xl:text-[12px]" href="#journal">Ler mais →</a>
        </div>
      </article>)}
    </div>
  </section>
}
