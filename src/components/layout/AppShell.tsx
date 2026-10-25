import { Link, useRouterState } from '@tanstack/react-router'
import { Heart, Home, ScanLine, ShoppingCart, UserRound } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useCart } from '../../features/cart/queries'
import { AuthModalContext, type AuthModalMode } from '../../features/account/AuthModalContext'
import { LoginPage } from '../../features/account/LoginPage'
import { RegisterPage } from '../../features/account/RegisterPage'
import { Footer } from './Footer'
import { useSession } from '../../features/account/queries'
import Header from './Header'

const homeSearch = { q: '', category: 'all' as const, sort: 'featured' as const, page: 1 }

export function AppShell({ children }: { children: ReactNode }) {
  const [authMode, setAuthMode] = useState<AuthModalMode | null>(null)
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const cart = useCart()
  const session = useSession()
  const itemCount = cart.data?.items.reduce((total, item) => total + item.quantity, 0) ?? 0
  const isHome = pathname === '/'
  const marketActive = !isHome

  return <AuthModalContext.Provider value={{ openAuth: setAuthMode, closeAuth: () => setAuthMode(null) }}>
    <div className="min-h-screen overflow-x-hidden bg-kurio-canvas text-kurio-ink xl:pb-6">
      <a className="fixed left-4 top-[-60px] z-50 bg-kurio-ink px-4 py-3 text-kurio-canvas focus:top-4" href="#main-content">Pular para o conteúdo</a>

      <Header
        homeSearch={homeSearch}
        isHome={isHome}
        marketActive={marketActive}
        session={session}
        itemCount={itemCount}
        setAuthMode={setAuthMode}
      />
 
      <main id="main-content">
        {children}
      </main>

      {
        isHome ? (
          <nav
            className="fixed inset-x-0 bottom-0 z-40 flex h-[94px] items-center justify-between rounded-t-[22px] bg-kurio-panel px-9 pb-[env(safe-area-inset-bottom)] text-kurio-muted shadow-[0_-8px_28px_rgba(0,0,0,0.18)] sm:hidden"
            aria-label="Navegação móvel"
          >
            <Link to="/" search={homeSearch} aria-label="Início">
              <Home size={19} />
            </Link>

            <Link to="/" search={homeSearch} aria-label="Favoritos">
              <Heart size={19} />
            </Link>
            
            <button
              className="absolute left-1/2 top-[-32px] grid size-16 -translate-x-1/2 place-items-center rounded-full bg-kurio-accent text-kurio-canvas shadow-lg"
              type="button"
              aria-label="Explorar"
            >
              <ScanLine size={25} />
            </button>

            <Link className="relative" to="/cart" aria-label="Carrinho">
              <ShoppingCart size={19} />
            
              <span className="absolute -right-2 -top-2 text-[9px] text-kurio-amber">
                {itemCount}
              </span>
            </Link>
            
            <Link to="/profile" aria-label="Perfil">
              <UserRound size={19} />
            </Link>
          </nav>
        ) : null
      }
      <Footer />
    </div>

    {authMode === 'login' ? <LoginPage /> : authMode === 'register' ? <RegisterPage /> : null}
  </AuthModalContext.Provider>
}
