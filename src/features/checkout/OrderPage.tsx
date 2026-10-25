import { Link, useParams } from '@tanstack/react-router'
import { ArrowRight, Check, X } from 'lucide-react'
import { useOrder } from './queries'

const homeSearch = { q: '', category: 'all' as const, sort: 'featured' as const, page: 1 }
const artworkForId = (id: string) => id === 'orbit-01' || id === 'afterglow-3' ? 'emerald-ape' : id === 'flora-08' || id === 'monolith-02' || id === 'tide-14' || id === 'golden-frequency-071' ? 'sage-nomad' : id === 'golden-beat-207' || id === 'golden-signal-160' ? 'golden-beat' : 'ivory-baron'

export function OrderPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' })
  const order = useOrder(orderId)
  if (order.isPending) return <section className="mx-auto mt-12 max-w-xl px-5" aria-busy="true"><div className="h-64 animate-pulse bg-kurio-panel" /></section>
  if (order.isError || !order.data) return <section className="mx-auto mt-16 max-w-xl px-5 text-center" role="alert"><h1 className="font-kurio text-xl font-bold">Pedido não encontrado</h1><p className="my-4 font-kurio text-sm text-kurio-muted">Este pedido não está disponível nesta sessão de demonstração.</p><Link to="/" search={homeSearch} className="font-kurio text-kurio-amber">Voltar ao mercado →</Link></section>

  const confirmed = order.data.status === 'confirmed'
  return <section className="mx-auto mt-12 w-[calc(100%-40px)] max-w-[600px] pb-12 text-center sm:mt-14 sm:w-[calc(100%-48px)] xl:mt-14">
    <div className={`mx-auto grid size-12 place-items-center rounded-full ${confirmed ? 'bg-kurio-accent text-kurio-canvas' : 'bg-kurio-panel text-kurio-ink'}`} aria-hidden="true">{confirmed ? <Check size={26} /> : <X size={26} />}</div>
    <p className="mt-5 font-kurio text-[11px] font-bold uppercase tracking-[1px] text-kurio-amber">{confirmed ? 'Pedido confirmado' : 'Pagamento não concluído'}</p>
    <h1 className="mt-2 font-kurio text-[23px] font-bold sm:text-[27px]">{confirmed ? 'Compra realizada!' : 'Pagamento recusado'}</h1>
    <p className="mt-2 font-kurio text-[12px] leading-5 text-kurio-muted">{confirmed ? 'Seu pedido foi confirmado. Confira os detalhes da compra.' : 'O pagamento foi recusado. Seus NFTs continuam no carrinho.'}</p>
    <div className="my-6 border-y border-kurio-line bg-kurio-panel px-5 py-4 text-left sm:px-6">
      <div className="flex items-center justify-between border-b border-kurio-line pb-3 font-kurio text-[10px] font-bold tracking-[.5px]"><span>RESUMO DO PEDIDO</span><span>{order.data.id}</span></div>
      {order.data.items.map((item) => <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 border-b border-kurio-line py-3" key={`${item.nftId}-${item.edition}`}><img className="size-12 rounded-[4px] object-cover" src={`/assets/nfts/${artworkForId(item.nftId)}.png`} alt="" /><div className="min-w-0"><strong className="block truncate font-kurio text-[12px]">{item.name}</strong><span className="mt-1 block font-kurio text-[10px] text-kurio-muted">{item.collection} · Edição {item.edition} × {item.quantity}</span></div><b className="font-kurio text-[11px] text-kurio-amber">{item.lineTotalEth} ETH</b></div>)}
      <dl className="mt-4 grid gap-2 font-kurio text-[11px]"><div className="flex justify-between"><dt className="text-kurio-muted">Subtotal</dt><dd>{order.data.subtotalEth} ETH</dd></div><div className="flex justify-between"><dt className="text-kurio-muted">Taxa de rede</dt><dd>{order.data.networkFeeEth} ETH</dd></div><div className="flex justify-between border-t border-kurio-line pt-3 text-[13px] font-bold"><dt>Total</dt><dd className="text-kurio-amber">{order.data.totalEth} ETH</dd></div><div className="flex justify-between pt-2"><dt className="text-kurio-muted">Rede</dt><dd>{order.data.network}</dd></div><div className="flex justify-between"><dt className="text-kurio-muted">Carteira</dt><dd>{order.data.walletAddress.slice(0, 8)}…{order.data.walletAddress.slice(-5)}</dd></div>{order.data.receipt ? <div className="flex justify-between"><dt className="text-kurio-muted">Transação</dt><dd><a className="text-kurio-amber" href={order.data.receipt.explorerUrl} target="_blank" rel="noopener noreferrer">{order.data.receipt.transactionHash.slice(0, 12)}… ↗</a></dd></div> : null}</dl>
    </div>
    <Link className="flex h-10 w-full items-center justify-center gap-2 rounded-[5px] bg-kurio-accent font-kurio text-[14px] font-bold text-kurio-canvas" to={confirmed ? '/' : '/cart'} search={confirmed ? homeSearch : undefined}>{confirmed ? 'Voltar ao mercado' : 'Voltar ao carrinho'} <ArrowRight size={16} /></Link>
  </section>
}
