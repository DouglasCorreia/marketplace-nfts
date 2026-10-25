import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { formatEth, toWei } from '../../domain/catalog/catalog'
import { maxQuantityForEdition } from '../../domain/cart/types'
import { useCart, useCartMutations } from './queries'
import { Artwork } from '../catalog/Artwork'
import { useCatalog } from '../catalog/queries'

const catalogSearch = { q: '', category: 'all' as const, sort: 'featured' as const, page: 1 }
const withFee = (subtotal: string) => formatEth(toWei(subtotal) + toWei('0.016'))

export function CartPage() {
  const cart = useCart()
  const suggestions = useCatalog(catalogSearch)
  const mutations = useCartMutations()
  const [coupon, setCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const busy = mutations.update.isPending || mutations.remove.isPending
  if (cart.isPending) return <section className="mx-auto mt-8 w-[calc(100%-40px)] xl:w-[1200px]" aria-busy="true"><div className="h-20 animate-pulse bg-kurio-panel" /></section>
  if (cart.isError) return <section className="mx-auto mt-16 max-w-xl px-5 text-center" role="alert"><h1 className="font-kurio text-xl font-bold">Não foi possível carregar o carrinho.</h1><p className="my-4 text-sm text-kurio-muted">Seus itens estão salvos. Tente novamente.</p><Button onClick={() => void cart.refetch()}>Tentar novamente</Button></section>

  const items = cart.data.items
  const cartIds = new Set(items.map(({ nft }) => nft.id))
  const related = (suggestions.data?.items ?? []).filter((nft) => !cartIds.has(nft.id)).slice(0, 5)
  const totalEth = withFee(cart.data.subtotalEth)
  const setQuantity = (nftId: string, edition: (typeof items)[number]['edition'], quantity: number) => mutations.update.mutate({ nftId, edition, quantity })

  return <section className="mx-auto mt-8 w-[calc(100%-56px)] pb-[370px] sm:w-[calc(100%-48px)] xl:mt-8 xl:w-[1200px] xl:pb-0">
    <div className="mb-5 flex items-center justify-center gap-4 sm:justify-start xl:mb-5">
      <Link to="/" search={catalogSearch} className="grid size-[35px] shrink-0 place-items-center rounded-full border border-kurio-line bg-kurio-panel text-kurio-muted hover:border-kurio-accent sm:hidden" aria-label="Voltar ao mercado"><ArrowLeft size={18} /></Link>
      <h1 className="font-kurio text-[19px] font-bold sm:text-[22px] xl:hidden">Carrinho de NFTs</h1>
      <nav className="hidden font-kurio text-[14px] text-kurio-muted xl:flex xl:gap-3" aria-label="Trilha de navegação"><Link to="/" search={catalogSearch}>Início</Link><span>/</span><span>Mercado</span><span>/</span><span className="text-kurio-ink">Carrinho</span></nav>
    </div>

    {items.length === 0 ? <div className="py-16 text-center"><h2 className="font-kurio text-lg font-bold">Seu carrinho está vazio.</h2><p className="my-3 text-sm text-kurio-muted">Encontre uma arte para começar sua coleção.</p><Link to="/" search={catalogSearch} className="font-kurio text-sm text-kurio-amber">Continuar explorando →</Link></div> : <>
      <div className="grid items-start gap-6 xl:min-h-[418px] xl:grid-cols-[782px_332px] xl:gap-[86px]">
        <div className="min-w-0">
          <div className="hidden grid-cols-[minmax(0,1fr)_126px_124px_120px_36px] gap-3 border-b border-kurio-line pb-2 font-kurio text-[14px] font-semibold sm:grid"><span>NFTs</span><span>Preço</span><span>Edições</span><span>Total</span><span /></div>
          <div className="grid gap-3 sm:mt-3">
            {items.map(({ nft, edition, quantity }) => <article className="relative grid min-h-[100px] grid-cols-[100px_minmax(0,1fr)_auto] items-center gap-2 rounded-[14px] bg-kurio-panel pr-3 sm:min-h-[70px] sm:grid-cols-[70px_minmax(0,1fr)_126px_124px_120px_36px] sm:gap-4 sm:rounded-none sm:pr-3 xl:gap-4" key={`${nft.id}-${edition}`}>
              <Artwork nft={nft} className="size-[100px] rounded-[14px] sm:size-[70px] sm:rounded-[5px]" />
              <div className="min-w-0 self-start pt-3 sm:self-center sm:pt-0">
                <h2 className="truncate font-kurio text-[12px] font-bold sm:text-[15px]">{nft.name}</h2>
                <p className="mt-1 font-kurio text-[11px] text-kurio-muted sm:text-[12px]">Edição: {edition}</p>
                <p className="hidden font-kurio text-[10px] text-kurio-muted sm:block">ID do token: #{nft.id === 'orbit-01' ? '0042' : nft.id.slice(-4)}</p>
                <strong className="mt-1 block font-kurio text-[16px] font-bold text-kurio-amber sm:hidden">{nft.priceEth} ETH</strong>
              </div>
              <span className="hidden font-kurio text-[13px] font-semibold text-kurio-muted sm:block">{nft.priceEth} ETH</span>
              <div className="flex items-center justify-end gap-2 font-kurio text-[14px] sm:justify-start">
                <button className="grid size-6 place-items-center rounded-full bg-kurio-accent text-kurio-canvas disabled:opacity-40" type="button" aria-label={`Diminuir quantidade de ${nft.name}`} disabled={busy || quantity <= 1} onClick={() => setQuantity(nft.id, edition, quantity - 1)}><Minus size={14} /></button>
                <span className="min-w-4 text-center" aria-live="polite">{quantity}</span>
                <button className="grid size-6 place-items-center rounded-full bg-kurio-accent text-kurio-canvas disabled:opacity-40" type="button" aria-label={`Aumentar quantidade de ${nft.name}`} disabled={busy || quantity >= maxQuantityForEdition(edition, nft.available)} onClick={() => setQuantity(nft.id, edition, quantity + 1)}><Plus size={14} /></button>
              </div>
              <strong className="hidden font-kurio text-[14px] font-bold text-kurio-amber sm:block">{(Number(nft.priceEth) * quantity).toFixed(2)} ETH</strong>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-kurio-muted hover:text-kurio-amber sm:static sm:translate-y-0" type="button" aria-label={`Remover ${nft.name}, edição ${edition}`} disabled={mutations.remove.isPending} onClick={() => mutations.remove.mutate({ nftId: nft.id, edition })}><Trash2 size={17} /></button>
            </article>)}
          </div>
        </div>
        <aside className="hidden xl:block">
          <h2 className="border-b border-kurio-line pb-2 font-kurio text-[18px] font-bold">Resumo da carteira</h2>
          <label className="mt-5 block font-kurio text-[13px] font-bold" htmlFor="promo-code">Código promocional</label>
          <div className="mt-2 flex h-10">
            <input id="promo-code" className="min-w-0 flex-1 rounded-l border border-kurio-accent bg-transparent px-2 font-kurio text-[11px] text-kurio-ink placeholder:text-kurio-muted" type="text" placeholder="Digite o código promocional..." value={coupon} onChange={(event) => { setCoupon(event.target.value); setCouponMessage('') }} />
            <button className="rounded-r bg-kurio-accent px-4 font-kurio text-[13px] font-bold text-kurio-canvas" type="button" onClick={() => setCouponMessage('Cupons promocionais não estão disponíveis nesta demonstração.')}>Aplicar</button>
          </div>
          {couponMessage ? <p className="mt-1 text-[10px] text-kurio-muted" role="status">{couponMessage}</p> : null}
          <div className="mt-4 space-y-3 font-kurio text-[14px]">
            <div className="flex justify-between"><span>Subtotal</span><span>{cart.data.subtotalEth} ETH</span></div>
            <div className="flex justify-between"><span>Desconto do lançamento</span><span>(−) 00.00</span></div>
            <div className="flex justify-between"><span>Taxa de rede</span><span>0.016 ETH</span></div>
            <p className="-mt-2 text-right text-[10px] text-kurio-amber">Taxa estimada</p>
            <div className="flex justify-between border-t border-kurio-line pt-3 font-bold"><span>Total</span><span className="text-kurio-amber">{totalEth} ETH</span></div>
          </div>
          <Link to="/checkout" className="mt-5 flex h-10 w-full items-center justify-center rounded-[4px] bg-kurio-accent font-kurio text-[14px] font-bold text-kurio-canvas">Conectar e finalizar</Link>
          <Link to="/" search={catalogSearch} className="mt-3 block text-center font-kurio text-[13px] text-kurio-amber">Continuar explorando</Link>
        </aside>
      </div>

      <section className="mt-10 hidden sm:block xl:mt-24" aria-labelledby="related-title">
        <h2 id="related-title" className="border-b border-kurio-line pb-2 font-kurio text-[15px] font-bold text-kurio-amber">Colecionadores também viram</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4 xl:mt-8 xl:grid-cols-5 xl:gap-6">
          {related.map((nft) => <Link className="min-w-0" to="/nft/$nftId" params={{ nftId: nft.id }} key={nft.id}><Artwork nft={nft} className="aspect-square rounded-[8px] p-1 sm:rounded-none" /><span className="mt-2 block truncate font-kurio text-[11px]">{nft.name}</span><strong className="mt-1 block font-kurio text-[12px] text-kurio-amber">{nft.priceEth} ETH</strong></Link>)}
        </div>
        <div className="mt-4 hidden justify-center gap-2 text-kurio-accent sm:flex" aria-hidden="true"><span className="size-2 rounded-full border border-kurio-accent" /><span className="size-2 rounded-full bg-kurio-accent" /><span className="size-2 rounded-full border border-kurio-accent" /></div>
      </section>

      <aside className="fixed inset-x-0 bottom-0 z-30 mt-3 h-[342px] rounded-t-[28px] bg-kurio-panel px-7 pb-[max(36px,env(safe-area-inset-bottom))] pt-6 shadow-[0_-8px_28px_rgba(0,0,0,0.2)] sm:hidden">
        <div className="flex h-[50px] overflow-hidden rounded-full border border-kurio-line">
          <input className="min-w-0 flex-1 bg-transparent px-4 font-kurio text-[11px] text-kurio-ink placeholder:text-kurio-muted" aria-label="Código promocional" placeholder="Digite o código promocional..." value={coupon} onChange={(event) => setCoupon(event.target.value)} />
          <button className="rounded-full bg-kurio-accent px-5 font-kurio text-[13px] font-bold text-kurio-canvas" type="button" onClick={() => setCouponMessage('Cupons promocionais não estão disponíveis nesta demonstração.')}>Aplicar</button>
        </div>
        <dl className="mt-3 space-y-2 font-kurio text-[13px]">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{cart.data.subtotalEth} ETH</dd></div>
          <div className="flex justify-between"><dt>Desconto do lançamento</dt><dd>(−) 00.00</dd></div>
          <div className="flex justify-between"><dt>Taxa de rede</dt><dd>0.016 ETH</dd></div>
          <p className="-mt-2 text-right text-[9px] text-kurio-amber">Taxa estimada</p>
          <div className="flex justify-between border-t border-kurio-line pt-2 text-[15px] font-bold"><dt>Total</dt><dd className="text-kurio-amber">{totalEth} ETH</dd></div>
        </dl>
        <Link to="/checkout" className="mt-4 flex h-[58px] items-center justify-center rounded-full bg-kurio-accent font-kurio text-[14px] font-bold text-kurio-canvas">Conectar e finalizar</Link>
      </aside>
    </>}
  </section>
}

