import { Link } from '@tanstack/react-router'
import { LogIn, Search, ShoppingCart, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useSession } from '../../features/account/queries'
import type { CatalogCategory, CatalogSort } from '../../domain/catalog/catalog'

interface HeaderProps {
    homeSearch: {
        q: string
        category: CatalogCategory
        sort: CatalogSort
        page: number
    }
    isHome: boolean
    marketActive: boolean
    session: ReturnType<typeof useSession>
    itemCount: number
    setAuthMode?: (mode: 'login' | 'register' | null) => void
}

export default function Header(
    {
        homeSearch,
        isHome,
        marketActive,
        session,
        itemCount,
        setAuthMode
    }: HeaderProps
) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="mx-auto hidden w-[calc(100%-48px)] border-b border-kurio-line sm:block xl:w-[1200px]">
            <div className="relative flex h-full items-center justify-between">
                <Link to="/" search={homeSearch} className="font-kurio text-[14px] font-bold tracking-[1.4px]" aria-label="Início Kurio">KURIO</Link>
                
                <button className="ml-auto mr-4 hidden size-9 place-items-center" type="button" aria-expanded={menuOpen} aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}><span /></button>
                
                <nav className={`${menuOpen ? 'flex' : 'hidden'} items-stretch gap-7 lg:flex`} aria-label="Navegação principal">
                    <Link to="/" search={homeSearch} className={`relative flex items-center font-kurio text-[16px] py-6 ${isHome ? 'font-bold text-kurio-amber after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-kurio-accent' : 'text-kurio-ink'}`}>Início</Link>
                    
                    <a href="#discover" className={`relative flex items-center font-kurio text-[16px] py-6 ${marketActive ? 'font-bold text-kurio-amber after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-kurio-accent' : 'text-kurio-ink'}`}>Mercado</a>
                    <a href="#about" className="flex items-center font-kurio text-[16px] py-6 text-kurio-ink">Criadores</a>
                    <a href="#journal" className="flex items-center font-kurio text-[16px] py-6 text-kurio-ink">Aprenda</a>
                </nav>

                <div className="flex items-center gap-7">
                    <a href="#discover" className="text-kurio-ink" aria-label="Buscar no mercado"><Search size={20} /></a>

                    <Link to="/cart" className="relative text-kurio-ink" aria-label={`Ver carrinho, ${itemCount} itens`}><ShoppingCart size={21} /><span className="absolute -right-1.5 -top-1.5 grid size-[15px] place-items-center rounded-full bg-kurio-accent font-kurio text-[9px] font-bold text-kurio-canvas">{itemCount}</span></Link>
                    
                    {session.data?.user
                    ? <Link to="/profile" className="grid size-9 place-items-center rounded-full border border-kurio-accent text-kurio-amber transition-colors hover:bg-kurio-accent hover:text-kurio-canvas" aria-label="Acessar meu perfil" title="Meu perfil"><UserRound size={19} aria-hidden="true" /></Link>
                    : session.isPending
                    ? <span className="grid size-9 place-items-center text-kurio-muted" aria-label="Verificando sessão" aria-busy="true"><UserRound size={19} aria-hidden="true" /></span>
                    : <button type="button" onClick={() => setAuthMode && setAuthMode('login')} className="flex h-8 items-center gap-1.5 rounded-[5px] bg-kurio-accent px-3 font-kurio text-[14px] font-semibold cursor-pointer text-kurio-canvas"><LogIn size={16} aria-hidden="true" /> Entrar</button>}
                </div>
            </div>
        </header>
    )
}