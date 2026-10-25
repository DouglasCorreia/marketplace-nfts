import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Activity, Bell, CircleHelp, Download, Heart, LogOut, UserRound, WalletCards, type LucideIcon } from 'lucide-react'
import { useQueries } from '@tanstack/react-query'
import { Button } from '../../components/ui/button'
import { Artwork } from '../catalog/Artwork'
import { fetchNFT } from '../catalog/api'
import { catalogKeys } from '../catalog/queries'
import { useFavorites } from '../catalog/favorites'
import { useAuthModal } from './AuthModalContext'
import { useAuthMutations, useSession } from './queries'

type AccountSection = 'profile' | 'wallets' | 'favorites'
const homeSearch = { q: '', category: 'all' as const, sort: 'featured' as const, page: 1 }

const sideLinks: { label: string; icon: LucideIcon; section?: AccountSection }[] = [
  { label: 'Dados do perfil', icon: UserRound, section: 'profile' },
  { label: 'Carteiras', icon: WalletCards, section: 'wallets' },
  { label: 'Atividade', icon: Activity },
  { label: 'Lista de interesse', icon: Heart, section: 'favorites' },
  { label: 'Ofertas', icon: Bell },
  { label: 'Arquivos baixados', icon: Download },
  { label: 'Suporte', icon: CircleHelp },
]

function AccountPage({ active, children }: { active: AccountSection; children: ReactNode }) {
  const session = useSession()
  const { openAuth } = useAuthModal()
  const auth = useAuthMutations()

  if (session.isPending) return <section className="mx-auto mt-8 min-h-64 w-[calc(100%-40px)] max-w-[1200px] animate-pulse bg-kurio-panel" aria-busy="true" />
  if (!session.data?.user) return <section className="mx-auto my-20 max-w-xl px-6 text-center"><h1 className="font-kurio text-xl font-bold">Entre para acessar seu perfil.</h1><p className="my-4 font-kurio text-sm text-kurio-muted">Depois de entrar, você poderá gerenciar seus dados e carteiras.</p><Button onClick={() => openAuth('login')}>Entrar</Button></section>

  return <section className="mx-auto mt-6 grid w-[calc(100%-32px)] max-w-[1200px] items-start gap-6 pb-12 sm:mt-8 sm:w-[calc(100%-48px)] sm:grid-cols-[227px_minmax(0,1fr)] sm:gap-8 xl:gap-20">
    <aside className="bg-kurio-panel px-4 py-4 sm:px-0 sm:py-3" aria-label="Menu do perfil">
      <h1 className="mb-3 font-kurio text-[15px] font-bold sm:px-2">Meu perfil</h1>
      <nav className="flex gap-1 overflow-x-auto sm:grid sm:gap-0">
        {sideLinks.map(({ label, icon: Icon, section }) => section ? <Link key={label} to={section === 'profile' ? '/profile' : section === 'wallets' ? '/profile/wallets' : '/profile/favorites'} aria-current={active === section ? 'page' : undefined} className={`flex shrink-0 items-center gap-3 border-l-[3px] px-2 py-2.5 font-kurio text-[12px] sm:py-[9px] ${active === section ? 'border-kurio-accent text-kurio-amber' : 'border-transparent text-kurio-muted hover:text-kurio-amber'}`}><Icon size={15} />{label}</Link> : <span key={label} aria-disabled="true" className="hidden items-center gap-3 border-l-[3px] border-transparent px-2 py-[9px] font-kurio text-[12px] text-kurio-muted sm:flex"><Icon size={15} />{label}</span>)}
      </nav>
      <button type="button" className="mt-2 hidden w-full items-center gap-2 border-t border-kurio-line px-2 py-3 text-left font-kurio text-[12px] text-kurio-amber sm:flex" onClick={() => auth.signOut.mutate()} disabled={auth.signOut.isPending}><LogOut size={15} />Sair</button>
    </aside>
    <div className="min-w-0">{children}</div>
  </section>
}

export function ProfilePage() {
  const session = useSession()
  const [saved, setSaved] = useState(false)
  const [displayName, setDisplayName] = useState(session.data?.user?.name ?? '')
  const [username, setUsername] = useState(session.data?.user?.email.split('@')[0] ?? '')
  const [email, setEmail] = useState(session.data?.user?.email ?? '')
  const [ens, setEns] = useState('')
  const [walletAlias, setWalletAlias] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  useEffect(() => {
    if (!session.data?.user) return
    setDisplayName(session.data.user.name)
    setUsername(session.data.user.email.split('@')[0])
    setEmail(session.data.user.email)
  }, [session.data?.user])
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaved(true) }
  const field = 'h-[38px] w-full rounded-[3px] border border-kurio-line bg-transparent px-3 font-kurio text-[12px] text-kurio-ink outline-none focus:border-kurio-accent'

  return <AccountPage active="profile">
    <form className="grid gap-x-5 gap-y-5 sm:grid-cols-2" onSubmit={submit} onChange={() => setSaved(false)}>
      <h2 className="sm:col-span-2 font-kurio text-[14px] font-bold">Perfil do colecionador</h2>
      <label className="grid gap-2 font-kurio text-[11px]"><span>Nome de exibição<span className="text-kurio-accent">*</span></span><input className={field} required value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
      <label className="grid gap-2 font-kurio text-[11px]"><span>Nome de usuário<span className="text-kurio-accent">*</span></span><input className={field} required value={username} onChange={(event) => setUsername(event.target.value)} /></label>
      <label className="grid gap-2 font-kurio text-[11px]"><span>E-mail<span className="text-kurio-accent">*</span></span><input className={field} type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label className="grid gap-2 font-kurio text-[11px]"><span>Nome ENS<span className="text-kurio-accent">*</span></span><span className="flex gap-2"><select className={`${field} w-16 px-2`} aria-label="Sufixo ENS"><option>.eth</option></select><input className={field} value={ens} onChange={(event) => setEns(event.target.value)} /></span></label>
      <label className="grid gap-2 font-kurio text-[11px]"><span>Apelido da carteira<span className="text-kurio-accent">*</span></span><input className={field} value={walletAlias} onChange={(event) => setWalletAlias(event.target.value)} /></label>
      <div className="grid content-start gap-2 font-kurio text-[11px]">Avatar<span className="flex items-center gap-4"><span className="grid size-9 place-items-center overflow-hidden rounded-full bg-kurio-panel-raised text-kurio-accent">{avatarUrl ? <img className="size-full object-cover" src={avatarUrl} alt="Avatar do perfil" /> : <UserRound size={18} />}</span><label className="grid h-[30px] cursor-pointer place-items-center rounded-[3px] bg-kurio-accent px-4 font-kurio text-[11px] font-bold text-kurio-canvas">Alterar<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) setAvatarUrl(URL.createObjectURL(file)) }} /></label><button className="text-[10px] text-kurio-ink" type="button" onClick={() => setAvatarUrl('')}>Remover</button></span></div>
      <h3 className="mt-2 font-kurio text-[13px] font-bold sm:col-span-2">Alterar senha</h3>
      <label className="grid gap-2 font-kurio text-[11px] sm:max-w-[306px]">Senha atual<input className={field} type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
      <span className="hidden sm:block" />
      <label className="grid gap-2 font-kurio text-[11px] sm:max-w-[306px]">Nova senha<input className={field} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
      <span className="hidden sm:block" />
      <label className="grid gap-2 font-kurio text-[11px] sm:max-w-[306px]">Confirmar nova senha<input className={field} type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>
      <div className="flex items-center gap-3 sm:col-span-2"><Button className="h-[30px] min-h-0 w-24 text-[11px]" type="submit">Salvar</Button>{saved ? <span className="font-kurio text-[11px] text-kurio-muted" role="status">Alterações salvas nesta sessão.</span> : null}</div>
    </form>
  </AccountPage>
}

export function WalletsPage() {
  const [secondaryVisible, setSecondaryVisible] = useState(false)
  const [sameAsPrimary, setSameAsPrimary] = useState(false)
  const [saved, setSaved] = useState(false)
  const field = 'h-[38px] w-full rounded-[3px] border border-kurio-line bg-transparent px-3 font-kurio text-[11px] text-kurio-muted outline-none focus:border-kurio-accent'
  const walletForm = (secondary = false) => <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); setSaved(true) }} onChange={() => setSaved(false)}>
    <label className="grid gap-2 font-kurio text-[11px]"><span>Nome de exibição<span className="text-kurio-accent">*</span></span><input className={field} required placeholder="" /></label>
    <label className="grid gap-2 font-kurio text-[11px]"><span>Apelido da carteira<span className="text-kurio-accent">*</span></span><input className={field} required placeholder="" /></label>
    <label className="grid gap-2 font-kurio text-[11px]"><span>Rede<span className="text-kurio-accent">*</span></span><select className={field} required defaultValue=""><option value="" disabled>Selecione uma rede</option><option>Ethereum</option><option>Polygon</option><option>Solana</option></select></label>
    <label className="grid gap-2 font-kurio text-[11px]"><span>Nome do perfil<span className="text-kurio-accent">*</span></span><input className={field} required /></label>
    <label className="grid gap-2 font-kurio text-[11px]"><span>Endereço da carteira<span className="text-kurio-accent">*</span></span><input className={field} required placeholder="Endereço 0x da carteira" /></label>
    <input className={`${field} self-end`} aria-label="ENS ou carteira secundária (opcional)" placeholder="ENS ou carteira secundária (opcional)" />
    <label className="grid gap-2 font-kurio text-[11px]"><span>Tipo de carteira<span className="text-kurio-accent">*</span></span><select className={field} required defaultValue=""><option value="" disabled>Selecione uma carteira</option><option>MetaMask</option><option>WalletConnect</option><option>Coinbase Wallet</option></select></label>
    <label className="grid gap-2 font-kurio text-[11px]"><span>Código de indicação<span className="text-kurio-accent">*</span></span><input className={field} required /></label>
    <label className="grid gap-2 font-kurio text-[11px]"><span>E-mail<span className="text-kurio-accent">*</span></span><input className={field} type="email" required /></label>
    <label className="grid gap-2 font-kurio text-[11px]"><span>Nome ENS<span className="text-kurio-accent">*</span></span><span className="flex gap-2"><select className={`${field} w-16 px-2`}><option>.eth</option></select><input className={field} /></span></label>
    <div className="flex items-center gap-3 sm:col-span-2"><Button className="h-[30px] min-h-0 px-3 text-[10px]" type="submit">Salvar carteira</Button>{saved ? <span className="font-kurio text-[10px] text-kurio-muted" role="status">Carteira salva nesta sessão.</span> : null}</div>
    {secondary ? <span className="sr-only">Formulário de carteira secundária</span> : null}
  </form>
  return <AccountPage active="wallets">
    <div className="grid gap-7">
      <section>
        <header className="mb-5 flex items-start justify-between gap-3"><div><h2 className="font-kurio text-[14px] font-bold">Carteira principal</h2><p className="mt-1 max-w-[600px] font-kurio text-[10px] leading-4 text-kurio-muted">Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.</p></div><button type="button" className="font-kurio text-[11px] text-kurio-amber" onClick={() => setSecondaryVisible(true)}>Adicionar</button></header>
        {walletForm()}
      </section>
      <section className="border-t border-kurio-line pt-5">
        <header className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-kurio text-[13px] font-bold">Carteira secundária</h3><p className="mt-1 font-kurio text-[10px] text-kurio-muted">{secondaryVisible ? 'Cadastre uma carteira secundária para sua conta.' : 'Você ainda não adicionou uma carteira secundária.'}</p></div><div className="flex items-center gap-3"><label className="flex items-center gap-2 font-kurio text-[10px] text-kurio-muted"><input type="radio" name="same-wallet" className="accent-kurio-accent" checked={sameAsPrimary} onChange={() => setSameAsPrimary(true)} />Igual à carteira principal</label><button type="button" className="font-kurio text-[11px] text-kurio-amber" onClick={() => { setSecondaryVisible(!secondaryVisible); setSameAsPrimary(false) }}>{secondaryVisible ? 'Cancelar' : 'Adicionar'}</button></div></header>
        {secondaryVisible && !sameAsPrimary ? <div className="mt-5">{walletForm(true)}</div> : null}
      </section>
    </div>
  </AccountPage>
}

export function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavorites()
  const favoriteQueries = useQueries({ queries: favoriteIds.map((id) => ({ queryKey: catalogKeys.detail(id), queryFn: ({ signal }: { signal: AbortSignal }) => fetchNFT(id, signal), retry: false })) })
  const items = favoriteQueries.flatMap((query) => query.data ? [query.data] : [])
  const loading = favoriteQueries.some((query) => query.isPending)
  const failed = !loading && favoriteIds.length > 0 && items.length === 0

  return <AccountPage active="favorites">
    <section aria-labelledby="favorites-title">
      <header className="mb-5 border-b border-kurio-line pb-3">
        <h2 id="favorites-title" className="font-kurio text-[14px] font-bold">Lista de interesse</h2>
        <p className="mt-1 font-kurio text-[11px] text-kurio-muted">NFTs que você favoritou.</p>
      </header>

      {favoriteIds.length === 0 ? <div className="py-12 text-center">
        <Heart className="mx-auto text-kurio-amber" size={28} />
        <h3 className="mt-3 font-kurio text-[14px] font-bold">Sua lista está vazia</h3>
        <p className="mt-2 font-kurio text-[11px] text-kurio-muted">Favorite NFTs no mercado para encontrá-los aqui.</p>
        <Link to="/" search={homeSearch} className="mt-4 inline-block font-kurio text-[11px] font-bold text-kurio-amber">Explorar mercado →</Link>
      </div> : loading ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4" aria-label="Carregando favoritos" aria-busy="true">
        {favoriteIds.map((id) => <div className="aspect-square animate-pulse bg-kurio-panel" key={id} />)}
      </div> : failed ? <p className="py-10 text-center font-kurio text-[12px] text-kurio-muted" role="alert">Não foi possível carregar seus NFTs favoritos.</p> : <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {items.map((nft) => <article className="min-w-0" key={nft.id}>
          <div className="relative">
            <Link to="/nft/$nftId" params={{ nftId: nft.id }} aria-label={`Ver ${nft.name}`}>
              <Artwork nft={nft} className="aspect-square rounded-lg bg-kurio-panel p-1" />
            </Link>
            <button type="button" className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-kurio-panel/90 text-kurio-amber" aria-label={`Remover ${nft.name} dos favoritos`} onClick={() => toggleFavorite(nft.id)}>
              <Heart size={17} fill="currentColor" />
            </button>
          </div>
          <h3 className="mt-2 truncate font-kurio text-[11px] sm:text-[12px]"><Link to="/nft/$nftId" params={{ nftId: nft.id }}>{nft.name}</Link></h3>
          <p className="mt-0.5 font-kurio text-[11px] font-bold text-kurio-amber">{nft.priceEth} ETH</p>
        </article>)}
      </div>}
    </section>
  </AccountPage>
}
