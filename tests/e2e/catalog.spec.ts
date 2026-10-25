import { expect, test } from '@playwright/test'

test('catalog filters update the URL and narrow the artwork list', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /seja dono do futuro/i })).toBeVisible()
  await page.getByRole('button', { name: 'Fotografia' }).click()
  await expect(page).toHaveURL(/category=photography/)
  await expect(page.getByRole('heading', { name: 'Sage Nomad #009' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Fotografia' })).toHaveAttribute('aria-pressed', 'true')
})

test('detail route works directly and an unknown piece has a recovery link', async ({ page }) => {
  await page.goto('/nft/orbit-01')
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await page.goto('/nft/not-a-real-piece')
  await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible()
  await page.getByRole('link', { name: /voltar ao mercado/i }).click()
  await expect(page).toHaveURL(/\/?\?q=/)
})

test('adding an edition persists in the mock cart across refresh and removal updates it', async ({ page }) => {
  await page.goto('/nft/orbit-01')
  await page.getByRole('button', { name: /comprar nft/i }).click()
  await expect(page).toHaveURL(/\/cart/)
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await page.getByRole('button', { name: 'Aumentar quantidade' }).click()
  await expect(page.locator('.summary-total strong')).toHaveText('2.38 ETH')
  await page.reload()
  await expect(page.locator('.summary-total strong')).toHaveText('2.38 ETH')
  await page.getByRole('button', { name: /remover emerald ape/i }).click()
  await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
})

test('desktop sign-in opens as a modal and the mock payment returns a confirmed receipt', async ({ page }) => {
  await page.goto('/nft/orbit-01')
  await page.getByRole('button', { name: 'Comprar NFT' }).click()
  await page.goto('/login?redirect=%2Fcheckout')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByLabel('E-mail').fill('collector@gallery.test')
  await page.locator('#password').fill('Gallery2026!')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/checkout/)
  await page.getByLabel('Endereço da carteira').fill(`0x${'a'.repeat(40)}`)
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page.getByRole('heading', { name: 'Compra realizada!' })).toBeVisible()
  await expect(page.getByText('1.206 ETH')).toBeVisible()
})
