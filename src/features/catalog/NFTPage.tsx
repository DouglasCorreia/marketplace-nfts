import { useEffect, useState } from "react";
import { Heart, ShoppingCart, ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import {
  defaultEditionSelection,
  editionOptions,
  maxQuantityForEdition,
  type EditionSelection,
} from "../../domain/cart/types";
import { useCartMutations } from "../cart/queries";
import { useFavorites } from "./favorites";
import { Artwork } from "./Artwork";
import { useCatalog, useNFT } from "./queries";
import { useSession } from "../account/queries";

const homeSearch = {
  q: "",
  category: "all" as const,
  sort: "featured" as const,
  page: 1,
};

export function NFTPage() {
  const { nftId } = useParams({ from: "/nft/$nftId" });
  const nft = useNFT(nftId);
  const cart = useCartMutations();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedEdition, setSelectedEdition] = useState<EditionSelection | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const { favoriteIds, toggleFavorite } = useFavorites();
  const favorite = favoriteIds.includes(nftId);
  const session = useSession()
  
  useEffect(() => {
    setSelectedEdition(null);
    setQuantity(1);
  }, [nftId]);
  
  const related = useCatalog(homeSearch);
  
  if (nft.isPending)
    return (
      <section
        className="mx-auto mt-8 grid w-[calc(100%-48px)] grid-cols-2 gap-10 xl:w-[1200px]"
        aria-busy="true"
      >
        <div className="aspect-square animate-pulse bg-kurio-panel" />
        <div className="h-40 animate-pulse bg-kurio-panel" />
      </section>
    );

  if (nft.isError || !nft.data)
    return (
      <section className="mx-auto mt-16 max-w-xl px-5 text-center" role="alert">
        <h1 className="font-kurio text-2xl font-bold">NFT não encontrado</h1>
        <p className="my-4 text-sm text-kurio-muted">
          Esta arte pode ter sido removida do mercado.
        </p>
        <Link to="/" search={homeSearch} className="text-kurio-amber">
          Voltar ao mercado →
        </Link>
      </section>
    );

  const item = nft.data;
  const activeEdition =
    selectedEdition ?? defaultEditionSelection(item.edition);
  const editionAvailability = maxQuantityForEdition(
    activeEdition,
    item.available
  );
  const addToCart = () =>
    cart.add.mutate(
      { nftId: item.id, edition: activeEdition, quantity },
      { onSuccess: () => void navigate({ to: "/cart" }) }
    );
  const tokenId = item.id === "orbit-01" ? "0042" : item.id.slice(-4);
  const quantityControl = (
    <div
      className="flex items-center gap-2 font-kurio text-[16px] sm:gap-3"
      aria-label="Quantidade"
    >
      <button
        className="grid size-[28px] place-items-center rounded-full bg-kurio-accent text-kurio-canvas disabled:opacity-40 sm:size-10 sm:rounded-[14px] cursor-pointer"
        type="button"
        aria-label="Diminuir quantidade"
        disabled={quantity <= 1}
        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
      >
        −
      </button>
      <span aria-live="polite">{quantity}</span>
      <button
        className="grid size-[28px] place-items-center rounded-full bg-kurio-accent text-kurio-canvas disabled:opacity-40 sm:size-10 sm:rounded-[14px] cursor-pointer"
        type="button"
        aria-label="Aumentar quantidade"
        disabled={quantity >= editionAvailability}
        onClick={() =>
          setQuantity((value) => Math.min(editionAvailability, value + 1))
        }
      >
        +
      </button>
    </div>
  );

  return (
    <section className="mx-auto mt-6 w-[calc(100%-56px)] pb-40 sm:mt-8 sm:w-[calc(100%-48px)] xl:mt-8 xl:w-[1200px] xl:pb-0">
      <div className="mb-2 flex h-[35px] items-center justify-between sm:mb-5">
        <Link
          to="/"
          search={homeSearch}
          className="grid size-[35px] place-items-center rounded-full border border-kurio-line bg-kurio-panel text-kurio-muted hover:text-kurio-amber sm:hidden"
          aria-label="Voltar ao mercado"
        >
          <ArrowLeft size={18} />
        </Link>
        <nav
          className="hidden items-center gap-3 font-kurio text-[13px] sm:flex"
          aria-label="Trilha de navegação"
        >
          <Link to="/" search={homeSearch}>
            Início
          </Link>
          <span>/</span>
          <Link to="/" search={homeSearch}>
            Mercado
          </Link>
        </nav>
        <button
          className="grid size-[35px] place-items-center rounded-full border border-kurio-line text-kurio-amber sm:hidden disabled:cursor-not-allowed disabled:opacity-40 disabled:text-gray-400"
          type="button"
          aria-label={
            favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          aria-pressed={favorite}
          disabled={!session.data?.user}
          onClick={() => toggleFavorite(nftId)}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="grid items-start gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[510px_minmax(0,1fr)] xl:gap-[24px]">
        <div className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)] gap-6 max-sm:block">
          <div
            className="hidden grid-rows-4 gap-3 sm:grid"
            aria-label="Miniaturas do NFT"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <button
                type="button"
                className="overflow-hidden rounded-[8px] border border-kurio-line"
                key={index}
                aria-label={`Visualização ${index + 1}`}
              >
                <Artwork nft={item} />
              </button>
            ))}
          </div>
          <Artwork
            nft={item}
            loading="eager"
            fetchPriority="high"
            className="aspect-square w-full rounded-[16px] p-2 sm:rounded-[12px] xl:size-[392px] xl:justify-self-end xl:p-3"
          />
        </div>
        <div className="-mx-7 -mt-16 rounded-t-[20px] bg-kurio-panel px-6 pt-10 sm:mx-0 sm:mt-0 sm:rounded-none sm:bg-transparent sm:px-0 sm:pt-0">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-kurio text-[18px] font-bold sm:text-[24px] xl:text-[24px]">
              {item.name}
            </h1>
            <span className="shrink-0 rounded-full border border-kurio-accent px-2 py-1 font-kurio text-[11px] text-kurio-ink">
              <span className="text-kurio-amber">★</span> 4.8{" "}
              <span className="text-kurio-muted">(19)</span>
            </span>
          </div>
          <p className="mt-2 hidden font-kurio text-[18px] font-bold text-kurio-amber sm:block">
            {item.priceEth} ETH
          </p>
          <p className="mt-4 font-kurio text-[14px] font-bold">
            Sobre este NFT:
          </p>
          <p className="mt-2 font-kurio text-[12px] leading-[1.7] text-kurio-muted sm:text-[13px]">
            Um colecionável digital finalizado à mão da coleção Kurio Editions,
            verificado na {item.network ?? "Ethereum"}, com arte desbloqueável e
            acesso para colecionadores.
          </p>
          <div className="mt-3">
            <h2 className="font-kurio text-[14px] font-bold">Edição:</h2>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="group"
              aria-label="Selecionar edição"
            >
              {editionOptions.map((edition) => (
                <button
                  className={`cursor-pointer rounded-full border px-2 py-1 font-kurio text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kurio-amber ${
                    activeEdition === edition
                      ? "border-kurio-amber text-kurio-amber"
                      : "border-kurio-line text-kurio-muted hover:border-kurio-amber hover:text-kurio-amber"
                  }`}
                  type="button"
                  key={edition}
                  aria-pressed={activeEdition === edition}
                  onClick={() => {
                    setSelectedEdition(edition);
                    setQuantity((current) =>
                      Math.min(
                        current,
                        maxQuantityForEdition(edition, item.available)
                      )
                    );
                  }}
                >
                  {edition}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 hidden items-center gap-6 sm:flex">
            {quantityControl}
            <div className="ml-auto flex items-center gap-2">
              <Button
                className="min-w-[130px] cursor-pointer"
                disabled={cart.add.isPending || item.available < 1}
                onClick={addToCart}
              >
                {cart.add.isPending ? "Adicionando…" : "COMPRAR"}
              </Button>
              <button
                className="flex h-10 items-center gap-2 rounded-[5px] border border-kurio-accent px-3 font-kurio text-[12px] font-bold text-kurio-amber cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:text-gray-400"
                type="button"
                aria-pressed={favorite}
                onClick={() => toggleFavorite(nftId)}
                disabled={!session.data?.user}
              >
                <Heart size={17} fill={favorite ? "currentColor" : "none"} />{" "}
                Favoritar
              </button>
            </div>
          </div>
          <dl className="mt-4 space-y-2 font-kurio text-[13px] text-kurio-muted">
            <div className="flex gap-2">
              <dt>ID do token:</dt>
              <dd>#{tokenId}</dd>
            </div>
            <div className="flex gap-2">
              <dt>Coleção:</dt>
              <dd>{item.collection}</dd>
            </div>
            <div className="flex gap-2">
              <dt>Atributos:</dt>
              <dd>Óculos, Esmeralda, Raro</dd>
            </div>
          </dl>
          <div className="mt-3 hidden items-center gap-2 font-kurio text-[12px] sm:flex">
            <span className="font-bold text-kurio-ink">
              Compartilhar este NFT:
            </span>

            <a href="#share" aria-label="Compartilhar no LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#FFFFFF"><g fill="#FFFFFF" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></g></svg>
            </a>
            
            <a
              href="mailto:?subject=NFT%20Kurio"
              aria-label="Compartilhar por e-mail"
            >
              <Mail size={15} />
            </a>
            
            <a href="#share" aria-label="Compartilhar no Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF" stroke="currentColor"><path fill="#FFFFFF" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6c2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4c-.9-4.2 4-6.6 7-3.8c1.1 0 3-1.2 3-1.2"/></svg>
            </a>
          </div>
          {cart.add.isError ? (
            <p className="mt-3 text-[12px] text-kurio-amber" role="alert">
              Não foi possível adicionar ao carrinho.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-14 hidden sm:block xl:mt-[78px]">
        <div
          className="flex gap-8 border-b border-kurio-line font-kurio text-[13px] sm:text-[14px]"
          role="tablist"
          aria-label="Informações do NFT"
        >
          <button
            className={`border-b-2 px-0 pb-2 ${
              activeTab === "details"
                ? "border-kurio-accent font-bold text-kurio-amber"
                : "border-transparent text-kurio-ink"
            }`}
            type="button"
            role="tab"
            aria-selected={activeTab === "details"}
            onClick={() => setActiveTab("details")}
          >
            Detalhes do NFT
          </button>
          <button
            className={`border-b-2 px-0 pb-2 ${
              activeTab === "reviews"
                ? "border-kurio-accent font-bold text-kurio-amber"
                : "border-transparent text-kurio-ink"
            }`}
            type="button"
            role="tab"
            aria-selected={activeTab === "reviews"}
            onClick={() => setActiveTab("reviews")}
          >
            Avaliações de colecionadores (19)
          </button>
        </div>
        {activeTab === "details" ? (
          <div className="space-y-4 pt-3 font-kurio text-[11px] leading-[1.7] text-kurio-muted sm:text-[12px]">
            <p>
              {item.name} é uma obra digital 1/50 finalizada à mão da coleção
              Kurio Editions. Cada atributo fica armazenado nos metadados do
              token e verificado na Ethereum. A obra explora identidade,
              movimento e luz em um mundo digital sem fronteiras.
            </p>
            <p>
              A propriedade inclui arte em alta resolução, lançamentos
              exclusivos para colecionadores e um registro permanente de
              procedência registrada na rede. Nova Sato recebe 5% de direitos
              autorais nas vendas secundárias, apoiando novos trabalhos e
              lançamentos da comunidade.
            </p>
            <p>
              <strong className="text-kurio-ink">Rede:</strong>
              <br />
              Cunhado na {item.network ?? "Ethereum"} com procedência imutável e
              metadados armazenados no IPFS.
            </p>
            <p>
              <strong className="text-kurio-ink">Contrato:</strong>
              <br />
              Direitos autorais do criador: 5% nas vendas secundárias, pagos
              automaticamente pelos mercados compatíveis.
            </p>
            <p>
              <strong className="text-kurio-ink">Direitos autorais:</strong>
              <br />
              0x7A42…19E8 · Contrato inteligente ERC-721 verificado.
            </p>
          </div>
        ) : (
          <div className="pt-4 font-kurio text-[12px] text-kurio-muted">
            ★ ★ ★ ★ ★ &nbsp; 4,8 de 5 em 19 avaliações de colecionadores.
          </div>
        )}
      </div>

      <section
        className="mt-12 hidden sm:block xl:mt-[74px]"
        aria-labelledby="related-nfts-title"
      >
        <h2
          id="related-nfts-title"
          className="border-b border-kurio-line pb-2 font-kurio text-[15px] font-bold text-kurio-amber"
        >
          Mais desta coleção
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4 xl:mt-8 xl:gap-6">
          {(related.data?.items ?? [])
            .filter((candidate) => candidate.id !== item.id)
            .slice(0, 5)
            .map((candidate) => (
              <Link
                className="min-w-0"
                to="/nft/$nftId"
                params={{ nftId: candidate.id }}
                key={candidate.id}
              >
                <Artwork
                  nft={candidate}
                  className="aspect-square rounded-lg bg-kurio-panel p-1 sm:rounded-none"
                />
                <span className="mt-2 block truncate font-kurio text-[10px]">
                  {candidate.name}
                </span>
                <strong className="block font-kurio text-[11px] text-kurio-amber">
                  {candidate.priceEth} ETH
                </strong>
              </Link>
            ))}
        </div>
        <div
          className="mt-4 hidden justify-center gap-2 text-kurio-accent sm:flex"
          aria-hidden="true"
        >
          <span className="size-2 rounded-full border border-kurio-accent" />
          <span className="size-2 rounded-full bg-kurio-accent" />
          <span className="size-2 rounded-full border border-kurio-accent" />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-kurio-panel px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_28px_rgba(0,0,0,0.2)] sm:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-kurio text-[12px] text-kurio-muted">
              Qtd.
            </span>
            {quantityControl}
          </div>
          <strong className="font-kurio text-[17px] font-bold text-kurio-amber">
            {item.priceEth} ETH
          </strong>
        </div>
        <div className="mt-4 flex gap-3">
          <Button
            className="h-[58px] flex-1 rounded-full"
            disabled={cart.add.isPending || item.available < 1}
            onClick={addToCart}
          >
            Comprar NFT · {activeEdition}
          </Button>
          <button
            className="grid size-[58px] place-items-center rounded-full border border-kurio-line text-kurio-amber"
            type="button"
            aria-label={`Adicionar edição ${activeEdition} ao carrinho`}
            onClick={addToCart}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
