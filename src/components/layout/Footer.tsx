import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'

const benefits = [
  { initial: 'W', title: 'Segurança da carteira', description: 'Proteja sua carteira e colecione arte digital verificada com confiança.' },
  { initial: 'C', title: 'Criadores em destaque', description: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.' },
  { initial: 'D', title: 'Alertas de lançamentos', description: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.' },
]

const footerGroups = [
  { title: 'Meu perfil', links: ['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'] },
  { title: 'Central de ajuda', links: ['Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item'] },
  { title: 'Coleções', links: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'] },
]

function SocialIcon({ name }: { name: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' }) {
  if (name === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v9h4v-9h3.4l.6-4h-4V9c0-.7.3-1 1-1Z" fill="currentColor" /></svg>
  if (name === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.8" r="1.2" fill="currentColor" /></svg>
  if (name === 'twitter') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 5.9c-.7.3-1.5.6-2.3.6a4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.6 1 4 4 0 0 0-6.9 3.7 11.4 11.4 0 0 1-8.3-4.2 4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 3.9 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8.1 8.1 0 0 1 2 18.2a11.5 11.5 0 0 0 17.7-9.7v-.5A8 8 0 0 0 22 5.9Z" fill="currentColor" /></svg>
  if (name === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.5A2.5 2.5 0 1 0 5 3.5a2.5 2.5 0 0 0 0 5ZM3 10h4v11H3zM10 10h3.8v1.5h.1a4.2 4.2 0 0 1 3.7-2c4 0 4.4 2.6 4.4 5.8V21h-4v-5c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V21h-4V10Z" fill="currentColor" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" fill="currentColor" /></svg>
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return <footer className="mx-auto mt-10 hidden w-[calc(100%-40px)] bg-kurio-panel text-kurio-ink sm:mt-24 sm:block sm:w-[calc(100%-48px)] xl:mt-24 xl:h-[610px] xl:w-[1200px]" id="about">
    <div className="grid grid-cols-1 gap-7 p-5 sm:grid-cols-2 xl:h-[250px] xl:grid-cols-[repeat(3,264.667px)_357px] xl:gap-0 xl:px-8 xl:py-8">
      {benefits.map((benefit, index) => <section className={`min-w-0 xl:h-[184px] xl:pr-6 ${index < 3 ? 'xl:border-r xl:border-kurio-accent' : ''} ${index > 0 ? 'xl:pl-4' : ''}`} key={benefit.initial}>
        <span className="grid size-[74px] place-items-center rounded-full bg-kurio-accent font-kurio text-[24px] font-bold text-kurio-canvas" aria-hidden="true">{benefit.initial}</span>
        <h2 className="mt-3 font-kurio text-[15px] font-bold leading-tight xl:text-[16px]">{benefit.title}</h2>
        <p className="mt-2 max-w-[230px] font-kurio text-[11px] leading-[1.65] text-kurio-muted xl:text-[12px]">{benefit.description}</p>
      </section>)}
      <section className="min-w-0 xl:h-[184px] xl:pl-4" id="newsletter">
        <h2 className="font-kurio text-[16px] font-bold leading-[1.05]">Antecipe-se ao próximo<br />lançamento</h2>
        <form className="mt-3 flex h-[37px]" onSubmit={subscribe}>
          <label className="sr-only" htmlFor="footer-email">Seu e-mail</label>
          <input className="min-w-0 flex-1 rounded-l-md bg-kurio-panel-raised px-3 font-kurio text-[11px] text-kurio-ink placeholder:text-kurio-muted" id="footer-email" type="email" placeholder="digite seu e-mail..." value={email} onChange={(event) => { setEmail(event.target.value); setSubscribed(false) }} required />
          <button className="rounded-r-md bg-kurio-accent px-4 font-kurio text-[14px] font-bold text-kurio-canvas" type="submit">{subscribed ? 'Enviado' : 'Enviar'}</button>
        </form>
        <p className="mt-3 font-kurio text-[10px] leading-[1.6] text-kurio-muted xl:text-[11px]">{subscribed ? 'Obrigado por se inscrever.' : 'Receba lançamentos selecionados, histórias de criadores e novidades do mercado.'}</p>
      </section>
    </div>

    <div className="grid grid-cols-2 items-center gap-4 bg-kurio-panel-dark px-5 py-5 font-kurio text-[11px] sm:grid-cols-4 xl:h-[88px] xl:grid-cols-[210.667px_1fr_1fr_228px] xl:gap-[92px] xl:px-8 xl:py-0 xl:text-[12px]">
      <span className="font-bold tracking-[1px]">KURIO</span>
      <p>Feito para colecionadores,<br />criadores e cultura</p>
      <a href="mailto:contato@email.com">contato@email.com</a>
      <a href="tel:+551140028922">+55 11 4002 8922</a>
    </div>

    <div className="relative xl:h-[272px]">
    <div className="grid grid-cols-2 gap-6 px-5 py-6 sm:grid-cols-4 xl:h-[236px] xl:grid-cols-[repeat(3,178.667px)_228px] xl:gap-[124px] xl:px-8 xl:pt-[28px]">
      {footerGroups.map((group) => <section className="flex flex-col items-start gap-[9px]" key={group.title}>
        <h2 className="mb-0.5 font-kurio text-[15px] font-bold">{group.title}</h2>
        {group.links.map((label) => label === 'Meu perfil'
          ? <Link className="font-kurio text-[11px] text-kurio-ink hover:text-kurio-amber" to="/profile" key={label}>{label}</Link>
          : <a className="font-kurio text-[11px] text-kurio-ink" href="#main-content" key={label}>{label}</a>)}
      </section>)}
      <section>
        <h2 className="font-kurio text-[15px] font-bold">Redes sociais</h2>
        <div className="mt-3 flex gap-2 text-kurio-accent" aria-label="Redes sociais">
          <a className="grid size-[30px] place-items-center rounded-[5px] border border-kurio-accent p-1.5" href="https://facebook.com" aria-label="Facebook"><SocialIcon name="facebook" /></a>
          <a className="grid size-[30px] place-items-center rounded-[5px] border border-kurio-accent p-1.5" href="https://instagram.com" aria-label="Instagram"><SocialIcon name="instagram" /></a>
          <a className="grid size-[30px] place-items-center rounded-[5px] border border-kurio-accent p-1.5" href="https://twitter.com" aria-label="Twitter"><SocialIcon name="twitter" /></a>
          <a className="grid size-[30px] place-items-center rounded-[5px] border border-kurio-accent p-1.5" href="https://linkedin.com" aria-label="LinkedIn"><SocialIcon name="linkedin" /></a>
          <a className="grid size-[30px] place-items-center rounded-[5px] border border-kurio-accent p-1.5" href="https://youtube.com" aria-label="YouTube"><SocialIcon name="youtube" /></a>
        </div>
        <h2 className="mt-6 font-kurio text-[15px] font-bold">Carteiras compatíveis</h2>
        <div className="mt-2 flex items-center justify-between rounded-[5px] border border-kurio-line bg-kurio-panel-dark px-2 py-1 font-kurio text-[7px] font-bold text-kurio-amber"><span>METAMASK</span><i>•</i><span>WALLETCONNECT</span><i>•</i><span>COINBASE</span></div>
      </section>
    </div>

    <p className="flex h-[30px] items-center justify-center font-kurio text-[10px] xl:absolute xl:inset-x-0 xl:bottom-0">© 2026 Kurio. Propriedade digital para todos.</p>
    </div>
  </footer>
}