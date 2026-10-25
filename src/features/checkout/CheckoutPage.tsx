import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import { useCart } from "../cart/queries";
import { Artwork } from "../catalog/Artwork";
import { useSession } from "../account/queries";
import { useCreateOrder } from "./queries";
import { apiErrorMessage } from "../../lib/http/client";
import { formatEth, toWei } from "../../domain/catalog/catalog";
import { useAuthModal } from "../account/AuthModalContext";

const mobileWalletAddress = "0xA91F00000000000000000000000000000000E82C";

export function CheckoutPage() {
  const session = useSession();
  const { openAuth } = useAuthModal();
  const cart = useCart();
  const order = useCreateOrder();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState<"Ethereum" | "Polygon">("Ethereum");
  const [walletProvider, setWalletProvider] = useState("Coinbase Wallet");
  const [paymentDecision, setPaymentDecision] = useState<"approve" | "decline">(
    "approve"
  );
  const [selectedWallet, setSelectedWallet] = useState("Reserva");

  if (session.isPending || cart.isPending)
    return (
      <section
        className="mx-auto mt-8 w-[calc(100%-48px)] xl:w-[1200px]"
        aria-busy="true"
      >
        <div className="h-36 animate-pulse bg-kurio-panel" />
      </section>
    );
  if (session.data?.user == null)
    return (
      <section className="mx-auto mt-16 max-w-xl px-5 text-center">
        <h1 className="font-kurio text-xl font-bold">
          Entre para finalizar sua compra.
        </h1>
        <p className="my-4 text-sm text-kurio-muted">
          Seu carrinho continuará salvo.
        </p>
        <Button onClick={() => openAuth("login")}>Entrar e continuar</Button>
      </section>
    );
  if (cart.isError)
    return (
      <section className="mx-auto mt-16 max-w-xl px-5 text-center" role="alert">
        <h1 className="font-kurio text-xl font-bold">
          Não foi possível carregar o carrinho.
        </h1>
        <p className="my-4 text-sm text-kurio-muted">
          Tente novamente antes de concluir o pedido.
        </p>
        <Button onClick={() => void cart.refetch()}>Tentar novamente</Button>
      </section>
    );
  if (!cart.data?.items.length)
    return (
      <section className="mx-auto mt-16 max-w-xl px-5 text-center">
        <h1 className="font-kurio text-xl font-bold">
          Seu carrinho está vazio.
        </h1>
        <p className="my-4 text-sm text-kurio-muted">
          Encontre uma arte para começar sua coleção.
        </p>
        <Link
          to="/"
          search={{ q: "", category: "all", sort: "featured", page: 1 }}
          className="text-kurio-amber"
        >
          Explorar o mercado →
        </Link>
      </section>
    );

  const submitOrder = (address: string) =>
    order.mutate(
      { walletAddress: address, network, paymentDecision },
      {
        onSuccess: (placed) =>
          void navigate({
            to: "/orders/$orderId",
            params: { orderId: placed.id },
          }),
      }
    );
  const submitDesktop = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitOrder(walletAddress);
  };
  const submitMobile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitOrder(walletAddress || mobileWalletAddress);
  };
  const totalEth = formatEth(toWei(cart.data.subtotalEth) + toWei("0.016"));
  const inputClass =
    "h-[40px] w-full rounded-[3px] border border-kurio-line bg-transparent px-3 font-kurio text-[12px] text-kurio-ink placeholder:text-kurio-muted focus:border-kurio-accent focus:outline-none";
  const selectClass = `${inputClass} appearance-none`;

  return (
    <section className="mx-auto mt-8 w-[calc(100%-48px)] xl:w-[1200px]">
      <nav
        className="mb-7 hidden items-center gap-3 font-kurio text-[13px] sm:flex"
        aria-label="Trilha de navegação"
      >
        <Link
          to="/"
          search={{ q: "", category: "all", sort: "featured", page: 1 }}
        >
          Início
        </Link>
        <span>/</span>
        <Link
          to="/"
          search={{ q: "", category: "all", sort: "featured", page: 1 }}
        >
          Mercado
        </Link>
        <span>/</span>
        <span>Pagamento</span>
      </nav>

      <div className="hidden items-start gap-8 sm:grid xl:grid-cols-[minmax(0,1fr)_405px]">
        <form className="grid min-w-0 gap-4" onSubmit={submitDesktop}>
          <h1 className="font-kurio text-[18px] font-bold">
            Perfil do colecionador
          </h1>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <label className="flex flex-wrap items-center gap-1.5 font-kurio text-[13px]">
              Nome de exibição<span className="text-kurio-accent">*</span>
              <input
                className={inputClass}
                defaultValue={session.data?.user?.name}
              />
            </label>
            <label className="flex flex-wrap items-center gap-1.5 font-kurio text-[13px]">
              Nome de usuário<span className="text-kurio-accent">*</span>
              <input
                className={inputClass}
                defaultValue={session.data?.user?.email.split("@")[0]}
              />
            </label>
            <label className="flex flex-wrap items-center gap-1.5 font-kurio text-[13px]">
              Rede <span className="text-kurio-accent">*</span>
              <select
                className={selectClass}
                value={network}
                onChange={(event) =>
                  setNetwork(event.target.value as "Ethereum" | "Polygon")
                }
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
              </select>
            </label>
            <label className="flex flex-wrap items-center gap-1.5 font-kurio text-[13px]">
              Nome do perfil<span className="text-kurio-accent">*</span>
              <input className={inputClass} />
            </label>
            <label className="flex flex-wrap items-center gap-1.5 font-kurio text-[13px]">
              Endereço da carteira<span className="text-kurio-accent">*</span>
              <input
                className={inputClass}
                id="wallet"
                name="wallet"
                type="text"
                inputMode="text"
                autoComplete="off"
                pattern="0x[a-fA-F0-9]{40}"
                title="Informe um endereço Ethereum válido começando com 0x"
                placeholder="Endereço 0x da carteira"
                value={walletAddress}
                onChange={(event) => setWalletAddress(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 self-end font-kurio text-[13px]">
              <span className="sr-only">ENS ou carteira secundária</span>
              <input
                className={inputClass}
                placeholder="ENS ou carteira secundária (opcional)"
              />
            </label>
            <label className="flex flex-wrap items-center gap-1.5 font-kurio text-[13px]">
              Tipo de carteira<span className="text-kurio-accent">*</span>
              <select
                className={selectClass}
                value={walletProvider}
                onChange={(event) => setWalletProvider(event.target.value)}
              >
                <option>MetaMask</option>
                <option>WalletConnect</option>
                <option>Coinbase Wallet</option>
              </select>
            </label>
            <label className="flex flex-wrap items-center gap-1.5 font-kurio text-[13px]">
              Código de indicação<span className="text-kurio-accent">*</span>
              <input className={inputClass} />
            </label>
            <label className="flex flex-wrap items-center gap-1.5 font-kurio text-[13px]">
              E-mail<span className="text-kurio-accent">*</span>
              <input
                className={inputClass}
                type="email"
                defaultValue={session.data.user.email}
              />
            </label>
            <label className="flex flex-wrap items-center gap-1.5 font-kurio text-[13px]">
              Nome ENS <span className="text-kurio-accent">*</span>
              <select className={selectClass}>
                <option>.eth</option>
                <option>.crypto</option>
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 font-kurio text-[13px]">
            <input className="accent-kurio-accent" type="checkbox" /> Usar outra
            carteira?
          </label>
          <label className="grid max-w-[350px] gap-2 font-kurio text-[13px]">
            Observação do colecionador (opcional)
            <textarea
              className="min-h-[152px] resize-y rounded-[3px] border border-kurio-line bg-transparent p-3 font-kurio text-[12px] focus:border-kurio-accent focus:outline-none"
              rows={5}
            />
          </label>
          <fieldset className="grid gap-2 rounded border border-kurio-line p-3">
            <legend className="px-1 font-kurio text-[11px] text-kurio-muted">
              Resposta do pagamento de demonstração
            </legend>
            <label className="font-kurio text-[11px]">Resultado simulado</label>
            <select
              className={selectClass}
              value={paymentDecision}
              onChange={(event) =>
                setPaymentDecision(event.target.value as "approve" | "decline")
              }
            >
              <option value="approve">Aprovar pagamento</option>
              <option value="decline">Recusar pagamento (teste)</option>
            </select>
            <p className="font-kurio text-[10px] text-kurio-muted">
              Este seletor controla apenas a resposta local simulada.
            </p>
          </fieldset>
          {order.isError ? (
            <p className="font-kurio text-[12px] text-kurio-amber" role="alert">
              {apiErrorMessage(
                order.error,
                "Não foi possível concluir o pedido. O carrinho permanece salvo."
              )}
            </p>
          ) : null}
          <Button className="w-full" type="submit" disabled={order.isPending}>
            {order.isPending ? "Confirmando…" : "Confirmar compra"}
          </Button>
        </form>

        <CheckoutSummary
          cart={cart.data}
          totalEth={totalEth}
          walletProvider={walletProvider}
          setWalletProvider={setWalletProvider}
        />
      </div>

      <form
        className="mx-auto flex min-h-[calc(100dvh-32px)] max-w-[358px] flex-col pb-2 sm:hidden"
        onSubmit={submitMobile}
      >
        <header className="flex h-11 items-center gap-6">
          <Link
            to="/cart"
            className="grid size-[35px] place-items-center rounded-full border border-kurio-line bg-kurio-panel text-kurio-muted"
            aria-label="Voltar ao carrinho"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-kurio text-[17px] font-bold">
            Pagamento com carteira
          </h1>
        </header>
        <div className="mt-4 flex justify-between font-kurio text-[13px] font-bold">
          <h2>Carteira conectada</h2>
          <button
            className="text-kurio-amber"
            type="button"
            onClick={() =>
              setSelectedWallet(
                selectedWallet === "Reserva" ? "Principal" : "Reserva"
              )
            }
          >
            Trocar carteira
          </button>
        </div>
        <div className="mt-3 grid gap-5">
          {[
            {
              name: "Reserva",
              address: "nova.kurio.eth",
              chain: "Rede Polygon",
            },
            {
              name: "Principal",
              address: "0xA91F…E82C",
              chain: "Rede principal Ethereum",
            },
          ].map((wallet) => (
            <button
              className={`flex h-[93px] items-center gap-4 rounded-[14px] px-5 text-left ${
                selectedWallet === wallet.name
                  ? "bg-kurio-panel"
                  : "bg-kurio-panel/80"
              }`}
              type="button"
              key={wallet.name}
              aria-pressed={selectedWallet === wallet.name}
              onClick={() => {
                setSelectedWallet(wallet.name);
                setNetwork(wallet.name === "Reserva" ? "Polygon" : "Ethereum");
              }}
            >
              <span
                className={`grid size-4 place-items-center rounded-full border ${
                  selectedWallet === wallet.name
                    ? "border-kurio-accent"
                    : "border-kurio-line"
                }`}
              >
                {selectedWallet === wallet.name ? (
                  <span className="size-2 rounded-full bg-kurio-accent" />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block font-kurio text-[14px]">
                  {wallet.name}
                </strong>
                <span className="mt-1 block font-kurio text-[13px] leading-5 text-kurio-muted">
                  {wallet.address}
                  <br />
                  {wallet.chain}
                </span>
              </span>
              <span className="text-kurio-muted">⋮</span>
            </button>
          ))}
        </div>
        <h2 className="mt-4 font-kurio text-[14px] font-bold">
          Carteira e rede
        </h2>
        <div className="mt-3 grid gap-4">
          {[
            { name: "WalletConnect", mark: "W" },
            { name: "MetaMask", mark: "M" },
            { name: "Coinbase Wallet", mark: "▣" },
          ].map(({ name, mark }) => (
            <label
              className="flex h-[65px] items-center gap-3 rounded-[14px] bg-kurio-panel px-4 font-kurio text-[13px]"
              key={name}
            >
              <span className="grid size-10 place-items-center rounded-full border border-kurio-line text-kurio-amber">
                {mark}
              </span>
              <input
                className="peer sr-only"
                type="radio"
                name="mobile-wallet"
                checked={walletProvider === name}
                onChange={() => setWalletProvider(name)}
              />
              <span className="flex-1">{name}</span>
              <span className="grid size-4 place-items-center rounded-full border border-kurio-line peer-checked:border-kurio-accent peer-checked:after:size-2 peer-checked:after:rounded-full peer-checked:after:bg-kurio-accent" />
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-4 font-kurio text-[16px] font-bold">
          <span>Total:</span>
          <span className="text-[18px] text-kurio-amber">{totalEth} ETH</span>
        </div>
        {order.isError ? (
          <p
            className="mt-3 font-kurio text-[12px] text-kurio-amber"
            role="alert"
          >
            {apiErrorMessage(
              order.error,
              "Não foi possível concluir o pedido."
            )}
          </p>
        ) : null}
        <Button
          className="mt-auto h-[60px] w-full rounded-full"
          type="submit"
          disabled={order.isPending}
        >
          {order.isPending ? "Confirmando…" : "Confirmar compra"}
        </Button>
      </form>
    </section>
  );
}

function CheckoutSummary({
  cart,
  totalEth,
  walletProvider,
  setWalletProvider,
}: {
  cart: NonNullable<ReturnType<typeof useCart>["data"]>;
  totalEth: string;
  walletProvider: string;
  setWalletProvider: (value: string) => void;
}) {
  return (
    <aside className="min-w-0 font-kurio">
      <h2 className="mb-1 text-[18px] font-bold">Seus NFTs</h2>
      <div className="flex justify-between border-b border-kurio-line pb-2 text-[14px] font-semibold">
        <span>NFTs</span>
        <span>Subtotal</span>
      </div>
      {cart.items.map(({ nft, edition, quantity }) => (
        <div
          className="mt-3 grid grid-cols-[70px_minmax(0,1fr)_auto] items-center gap-2 bg-kurio-panel px-1 py-1"
          key={`${nft.id}-${edition}`}
        >
          <Artwork nft={nft} className="size-[70px] rounded-[5px]" />
          <div className="min-w-0">
            <strong className="block truncate text-[14px]">{nft.name}</strong>
            <span className="block text-[12px] text-kurio-muted">
              Edição {edition} · Token #
              {nft.id === "orbit-01" ? "0042" : nft.id.slice(-4)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[12px] text-kurio-muted">(× {quantity})</span>
            <b className="ml-3 text-[15px] text-kurio-amber">
              {(Number(nft.priceEth) * quantity).toFixed(2)} ETH
            </b>
          </div>
        </div>
      ))}
      <p className="my-3 text-right text-[12px]">
        Tem um código promocional? Aplique aqui
      </p>
      <div className="space-y-3 text-[14px]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{cart.subtotalEth} ETH</span>
        </div>
        <div className="flex justify-between">
          <span>Desconto do lançamento</span>
          <span>(−) 00.00</span>
        </div>
        <div className="flex justify-between">
          <span>Taxa de rede</span>
          <span>0.016 ETH</span>
        </div>
        <p className="-mt-2 text-right text-[11px] text-kurio-amber">
          Taxa estimada
        </p>
        <div className="flex justify-between border-t border-kurio-line pt-2 font-bold">
          <span>Total</span>
          <strong className="text-kurio-amber">{totalEth} ETH</strong>
        </div>
      </div>
      <h3 className="mt-2 text-center text-[15px] font-bold">
        Carteira e rede
      </h3>
      <div className="mt-3 rounded border border-kurio-line bg-kurio-panel-raised px-3 py-2 text-center text-[8px] font-bold text-kurio-amber">
        METAMASK • WALLETCONNECT • COINBASE
      </div>
      <div className="mt-4 grid gap-3">
        {["MetaMask", "Coinbase Wallet"].map((provider) => (
          <label
            className={`flex h-[46px] items-center gap-3 rounded-[4px] border px-3 text-[14px] ${
              walletProvider === provider
                ? "border-kurio-accent"
                : "border-kurio-line"
            }`}
            key={provider}
          >
            <input
              className="accent-kurio-accent"
              type="radio"
              name="wallet-provider"
              checked={walletProvider === provider}
              onChange={() => setWalletProvider(provider)}
            />
            {provider}
          </label>
        ))}
      </div>
    </aside>
  );
}
