import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { lazy, Suspense, type ReactNode } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { parseCatalogSearch } from '../domain/catalog/catalog'
import { CatalogPage } from '../features/catalog/CatalogPage'

const NFTPage = lazy(() => import('../features/catalog/NFTPage').then(({ NFTPage }) => ({ default: NFTPage })))
const CartPage = lazy(() => import('../features/cart/CartPage').then(({ CartPage }) => ({ default: CartPage })))
const CheckoutPage = lazy(() => import('../features/checkout/CheckoutPage').then(({ CheckoutPage }) => ({ default: CheckoutPage })))
const OrderPage = lazy(() => import('../features/checkout/OrderPage').then(({ OrderPage }) => ({ default: OrderPage })))
const ProfilePage = lazy(() => import('../features/account/ProfilePages').then(({ ProfilePage }) => ({ default: ProfilePage })))
const WalletsPage = lazy(() => import('../features/account/ProfilePages').then(({ WalletsPage }) => ({ default: WalletsPage })))
const FavoritesPage = lazy(() => import('../features/account/ProfilePages').then(({ FavoritesPage }) => ({ default: FavoritesPage })))

function RouteLoading() {
  return <div className="mx-auto grid min-h-[40vh] w-full place-items-center px-6 font-kurio text-sm text-kurio-muted" role="status" aria-live="polite">Carregando…</div>
}

function Page({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoading />}>{children}</Suspense>
}

const rootRoute = createRootRoute({ component: () => <AppShell><Outlet /></AppShell> })

export const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>) => parseCatalogSearch(search),
  component: () => <Page><CatalogPage /></Page>,
})

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$nftId',
  component: () => <Page><NFTPage /></Page>,
})

const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/cart', component: () => <Page><CartPage /></Page> })
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout', component: () => <Page><CheckoutPage /></Page> })
const orderRoute = createRoute({ getParentRoute: () => rootRoute, path: '/orders/$orderId', component: () => <Page><OrderPage /></Page> })
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile', component: () => <Page><ProfilePage /></Page> })
const walletsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile/wallets', component: () => <Page><WalletsPage /></Page> })
const favoritesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile/favorites', component: () => <Page><FavoritesPage /></Page> })
const routeTree = rootRoute.addChildren([catalogRoute, detailRoute, cartRoute, checkoutRoute, orderRoute, profileRoute, walletsRoute, favoritesRoute])

export const router = createRouter({ routeTree, defaultPreload: 'intent' })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
