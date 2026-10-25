import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import { useAuthModal } from './AuthModalContext'
import { Button } from '../../components/ui/button'
import { useAuthMutations } from './queries'
import { apiErrorMessage } from '../../lib/http/client'

export function RegisterPage() {
  const { openAuth, closeAuth } = useAuthModal()
  const auth = useAuthMutations()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [localError, setLocalError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== confirmation) { setLocalError('As senhas não coincidem.'); return }
    setLocalError('')
    auth.signUp.mutate({ name: name.trim(), email: email.trim(), password }, { onSuccess: closeAuth })
  }
  const fieldClass = 'h-[50px] rounded-[6px] border border-kurio-line bg-transparent px-4 font-kurio text-[12px] text-kurio-ink placeholder:text-kurio-muted focus:border-kurio-accent focus:outline-none'

  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-0 sm:p-6">
    <section className="relative my-auto w-full min-h-dvh rounded-[32px] bg-kurio-canvas px-7 pb-8 pt-[256px] text-kurio-ink sm:min-h-0 sm:w-[466px] sm:rounded-none sm:border-b-[9px] sm:border-kurio-accent sm:px-[74px] sm:pb-[70px] sm:pt-[38px]" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button type="button" onClick={closeAuth} className="absolute right-5 top-5 hidden text-kurio-accent sm:block" aria-label="Fechar cadastro"><X size={20} /></button>
      <span className="absolute inset-x-0 top-[124px] text-center font-kurio text-[32px] font-bold tracking-[2px] sm:hidden">KURIO</span>
      <div className="mb-[32px] text-center font-kurio text-[19px] font-bold sm:mb-5" id="auth-title"><button type="button" onClick={() => openAuth('login')} className="text-kurio-ink">Entrar</button><span className="mx-2 text-kurio-muted">|</span><span className="text-kurio-accent">Criar conta</span></div>
      <p className="mb-5 hidden text-center font-kurio text-[12px] leading-4 text-kurio-ink sm:mb-6 sm:block">Crie seu perfil de colecionador e conecte uma carteira quando quiser.</p>
      <form className="flex flex-col gap-2.5" onSubmit={submit}>
        <label className="sr-only" htmlFor="display-name">Nome de usuário</label><input className={fieldClass} id="display-name" autoComplete="name" minLength={2} placeholder="Nome de usuário" required value={name} onChange={(event) => setName(event.target.value)} />
        <label className="sr-only" htmlFor="register-email">E-mail</label><input className={fieldClass} id="register-email" type="email" autoComplete="email" placeholder="Digite seu e-mail" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <label className="sr-only" htmlFor="register-password">Senha</label><div className={`flex ${fieldClass} items-center`}><input className="min-w-0 flex-1 bg-transparent font-kurio text-[12px] text-kurio-ink placeholder:text-kurio-muted focus:outline-none" id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={10} placeholder="Senha" required value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword(!showPassword)} className="text-kurio-muted">{showPassword ? <Eye size={17} /> : <EyeOff size={17} />}</button></div>
        <label className="sr-only" htmlFor="confirm-password">Confirmar senha</label><input className={fieldClass} id="confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={10} placeholder="Confirmar senha" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        {localError || auth.signUp.isError ? <p className="text-[12px] text-kurio-amber" role="alert">{localError || apiErrorMessage(auth.signUp.error, 'Não foi possível criar sua conta.')}</p> : null}
        <Button className="mt-9 h-[60px] w-full sm:mt-2" type="submit" disabled={auth.signUp.isPending}>{auth.signUp.isPending ? 'Criando perfil…' : 'Criar perfil'}</Button>
      </form>
      <div className="my-6 flex items-center gap-3 font-kurio text-[11px] text-kurio-ink"><span className="h-px flex-1 bg-kurio-line" />Ou continue com<span className="h-px flex-1 bg-kurio-line" /></div>
      <div className="flex flex-col gap-2.5">
        <button className="flex h-[42px] items-center justify-center gap-3 rounded-[5px] border border-kurio-line font-kurio text-[12px] text-kurio-muted disabled:opacity-80" type="button" disabled title="Cadastro social indisponível nesta demonstração"><b className="font-sans text-[20px] text-[#4285f4]">G</b> Continuar com Google</button>
        <button className="flex h-[42px] items-center justify-center gap-3 rounded-[5px] border border-kurio-line font-kurio text-[12px] text-kurio-muted disabled:opacity-80" type="button" disabled title="Cadastro social indisponível nesta demonstração"><b className="font-sans text-[22px] text-[#4267b2]">f</b> Continuar com Facebook</button>
      </div>
      <p className="mt-8 text-center font-kurio text-[13px] text-kurio-muted sm:hidden">Já tem uma conta? <button type="button" onClick={() => openAuth('login')}>Entre</button></p>
    </section>
  </div>
}
