import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import { useAuthModal } from './AuthModalContext'
import { useAuthMutations } from './queries'
import { Button } from '../../components/ui/button'
import { apiErrorMessage } from '../../lib/http/client'

export function LoginPage() {
  const { openAuth, closeAuth } = useAuthModal()
  const auth = useAuthMutations()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    auth.signIn.mutate({ email, password }, { onSuccess: closeAuth })
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-0 sm:p-6">
    <section className="relative my-auto w-full min-h-dvh rounded-[32px] bg-kurio-canvas px-7 pb-8 pt-[256px] text-kurio-ink sm:min-h-0 sm:w-[466px] sm:rounded-none sm:border-b-[9px] sm:border-kurio-accent sm:px-[74px] sm:pb-[88px] sm:pt-[38px]" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button type="button" onClick={closeAuth} className="absolute right-5 top-5 hidden text-kurio-accent sm:block" aria-label="Fechar login"><X size={20} /></button>
      <span className="absolute inset-x-0 top-[124px] text-center font-kurio text-[32px] font-bold tracking-[2px] sm:hidden">KURIO</span>
      <div className="mb-[32px] text-center font-kurio text-[19px] font-bold sm:mb-8" id="auth-title"><span className="text-kurio-accent">Entrar</span><span className="mx-2 text-kurio-muted">|</span><button type="button" onClick={() => openAuth('register')} className="text-kurio-ink">Criar conta</button></div>
      <p className="mb-5 hidden text-center font-kurio text-[12px] leading-4 text-kurio-ink sm:mb-8 sm:block">Entre para gerenciar sua carteira, coleção e perfil de criador.</p>
      <form className="flex flex-col gap-2.5" onSubmit={submit}>
        <label className="sr-only" htmlFor="email">E-mail</label><input className="h-[50px] rounded-[6px] border border-kurio-line bg-transparent px-4 font-kurio text-[12px] text-kurio-ink placeholder:text-kurio-muted focus:border-kurio-accent focus:outline-none" id="email" type="email" autoComplete="email" placeholder="contato@email.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <label className="sr-only" htmlFor="password">Senha</label><div className="flex h-[50px] items-center rounded-[6px] border border-kurio-accent px-4 focus-within:ring-1 focus-within:ring-kurio-accent"><input className="min-w-0 flex-1 bg-transparent font-kurio text-[12px] text-kurio-ink placeholder:text-kurio-muted focus:outline-none" id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Senha" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="text-kurio-muted" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye size={17} /> : <EyeOff size={17} />}</button></div>
        <button className="self-end font-kurio text-[12px] text-kurio-amber disabled:cursor-not-allowed" type="button" disabled>Esqueceu a senha?</button>
        {auth.signIn.isError ? <p className="text-[12px] text-kurio-amber" role="alert">{apiErrorMessage(auth.signIn.error, 'Não foi possível entrar. Confira seus dados.')}</p> : null}
        <Button className="mt-8 h-[60px] w-full sm:mt-3" type="submit" disabled={auth.signIn.isPending}>{auth.signIn.isPending ? 'Entrando…' : 'Entrar'}</Button>
      </form>
      <div className="my-7 flex items-center gap-3 font-kurio text-[11px] text-kurio-ink"><span className="h-px flex-1 bg-kurio-line" />Ou continue com<span className="h-px flex-1 bg-kurio-line" /></div>
      <div className="flex flex-col gap-2.5">
        <button className="flex h-[42px] items-center justify-center gap-3 rounded-[5px] border border-kurio-line font-kurio text-[12px] text-kurio-muted disabled:opacity-80" type="button" disabled title="Login social indisponível nesta demonstração"><b className="font-sans text-[20px] text-[#4285f4]">G</b> Continuar com Google</button>
        <button className="flex h-[42px] items-center justify-center gap-3 rounded-[5px] border border-kurio-line font-kurio text-[12px] text-kurio-muted disabled:opacity-80" type="button" disabled title="Login social indisponível nesta demonstração"><b className="font-sans text-[22px] text-[#4267b2]">f</b> Continuar com Facebook</button>
      </div>
      <p className="mt-8 text-center font-kurio text-[13px] text-kurio-muted sm:hidden">Novo na Kurio? <button type="button" onClick={() => openAuth('register')} className="text-kurio-muted">Crie uma conta</button></p>
    </section>
  </div>
}
