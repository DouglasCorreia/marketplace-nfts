import { http, HttpResponse, ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";
import { z } from "zod";
import { subtotalEth } from "../domain/cart/cart";
import { formatEth, toWei } from "../domain/catalog/catalog";
import {
  defaultEditionSelection,
  editionOptions,
  maxQuantityForEdition,
  type CartEntry,
  type CartResponse,
  type EditionSelection,
} from "../domain/cart/types";
import type { Order, OrderItemSnapshot } from "../domain/order/order";
import type { User } from "../domain/account/session";
import { sessionStorageKey } from "../lib/storage/session";
import { nfts } from "./fixtures/nfts";

const socketUrl =
  typeof window === "undefined"
    ? "ws://localhost:5173/socket.io"
    : new URL("/socket.io", window.location.origin)
        .toString()
        .replace(/^http/, "ws");
const socketServer = ws.link(socketUrl);
const cartStorageKey = "gallery.mock.cart.v1";
const cartEntrySchema = z.object({
  nftId: z.string().min(1),
  edition: z.enum(editionOptions),
  quantity: z.number().int().positive(),
});
const storedCartEntrySchema = z.object({
  nftId: z.string().min(1),
  edition: z.enum(editionOptions).optional(),
  quantity: z.number().int().positive(),
});
const quantitySchema = z.object({ quantity: z.number().int().positive() });
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(10),
});
const orderInputSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  network: z.enum(["Ethereum", "Polygon"]),
  paymentDecision: z.enum(["approve", "decline"]),
});
const storedOrderSchema = z.object({
  idempotencyKey: z.string(),
  order: z.custom<Order>(
    (value) => typeof value === "object" && value !== null
  ),
});
const demoUser: User = {
  id: "collector-demo",
  name: "Alex Morgan",
  email: "collector@gallery.test",
};
const demoPasswordHash =
  "88db54a37341aa85db10c0a6e08117277005eefa481a4b3d1052cf9bf99ec604";
const accountsStorageKey = "gallery.mock.accounts.v1";
const ordersStorageKey = "gallery.mock.orders.v1";
const cartEntriesSchema = z.array(cartEntrySchema);

function readCartEntries(): CartEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.sessionStorage.getItem(cartStorageKey);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = z.array(storedCartEntrySchema).safeParse(parsed);
    return result.success
      ? result.data.flatMap((entry) => {
          const nft = nfts.find((item) => item.id === entry.nftId);
          return nft
            ? [
                {
                  ...entry,
                  edition:
                    entry.edition ?? defaultEditionSelection(nft.edition),
                },
              ]
            : [];
        })
      : [];
  } catch {
    return [];
  }
}

function saveCartEntries(entries: CartEntry[]) {
  if (typeof window !== "undefined")
    window.sessionStorage.setItem(cartStorageKey, JSON.stringify(entries));
}

function getCartResponse(entries = readCartEntries()): CartResponse {
  const items = entries.flatMap((entry) => {
    const nft = nfts.find((item) => item.id === entry.nftId);
    return nft
      ? [{ nft, edition: entry.edition, quantity: entry.quantity }]
      : [];
  });
  return {
    items,
    version: entries.reduce((version, entry) => version + entry.quantity, 0),
    subtotalEth: subtotalEth(
      items.map(({ nft, quantity }) => ({
        nftId: nft.id,
        quantity,
        priceEth: nft.priceEth,
      }))
    ),
  };
}

function readSession(): { token: string; user: User } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(sessionStorageKey);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const result = z
      .object({
        token: z.string().min(1),
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string().email(),
        }),
      })
      .safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

const storedAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  passwordHash: z.string().length(64),
});
function readAccounts(): z.infer<typeof storedAccountSchema>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(accountsStorageKey);
    if (!raw) return [];
    const result = z.array(storedAccountSchema).safeParse(JSON.parse(raw));
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: z.infer<typeof storedAccountSchema>[]) {
  if (typeof window !== "undefined")
    window.sessionStorage.setItem(accountsStorageKey, JSON.stringify(accounts));
}

function authorized(request: Request): boolean {
  const session = readSession();
  return Boolean(
    session &&
      request.headers.get("authorization") === `Bearer ${session.token}`
  );
}

function readStoredOrders() {
  if (typeof window === "undefined")
    return [] as z.infer<typeof storedOrderSchema>[];
  try {
    const raw = window.sessionStorage.getItem(ordersStorageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    const result = z.array(storedOrderSchema).safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

function saveStoredOrders(orders: z.infer<typeof storedOrderSchema>[]) {
  if (typeof window !== "undefined")
    window.sessionStorage.setItem(ordersStorageKey, JSON.stringify(orders));
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export const handlers = [
  http.get("/api/nfts", ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").toLocaleLowerCase();
    const category = url.searchParams.get("category") ?? "all";
    const sort = url.searchParams.get("sort") ?? "featured";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const pageSize = 12;
    const results = nfts.filter((nft) => {
      const matchesText =
        !q ||
        `${nft.name} ${nft.collection} ${nft.creator}`
          .toLocaleLowerCase()
          .includes(q);
      return matchesText && (category === "all" || nft.category === category);
    });
    if (sort === "price-asc")
      results.sort((a, b) => Number(a.priceEth) - Number(b.priceEth));
    if (sort === "price-desc")
      results.sort((a, b) => Number(b.priceEth) - Number(a.priceEth));
    if (sort === "newest") results.reverse();
    if (sort === "featured")
      results.sort((a, b) => Number(b.featured) - Number(a.featured));
    return HttpResponse.json({
      items: results.slice((page - 1) * pageSize, page * pageSize),
      total: results.length,
      page,
      pageSize,
    });
  }),
  http.get("/api/nfts/:nftId", ({ params }) => {
    const nft = nfts.find((item) => item.id === params.nftId);
    return nft
      ? HttpResponse.json(nft)
      : HttpResponse.json(
          { code: "NOT_FOUND", message: "This artwork could not be found." },
          { status: 404 }
        );
  }),
  http.get("/api/cart", () => HttpResponse.json(getCartResponse())),
  http.post("/api/cart/items", async ({ request }) => {
    const body = cartEntrySchema.safeParse(await request.json());
    if (!body.success)
      return HttpResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: "A valid NFT and quantity are required.",
        },
        { status: 400 }
      );
    const nft = nfts.find((item) => item.id === body.data.nftId);
    if (!nft)
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "This artwork could not be found." },
        { status: 404 }
      );
    const entries = readCartEntries();
    const existing = entries.find(
      (item) => item.nftId === nft.id && item.edition === body.data.edition
    );
    const quantity = (existing?.quantity ?? 0) + body.data.quantity;
    if (quantity > maxQuantityForEdition(body.data.edition, nft.available))
      return HttpResponse.json(
        {
          code: "UNAVAILABLE",
          message: "There are not enough editions available.",
        },
        { status: 409 }
      );
    const next = existing
      ? entries.map((item) =>
          item.nftId === nft.id && item.edition === body.data.edition
            ? { ...item, quantity }
            : item
        )
      : [...entries, { ...body.data }];
    saveCartEntries(next);
    return HttpResponse.json(getCartResponse(next), { status: 201 });
  }),
  http.patch("/api/cart/items/:nftId", async ({ params, request }) => {
    const body = quantitySchema.safeParse(await request.json());
    if (!body.success)
      return HttpResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: "Quantity must be a positive integer.",
        },
        { status: 400 }
      );
    const nft = nfts.find((item) => item.id === params.nftId);
    if (!nft)
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "This artwork could not be found." },
        { status: 404 }
      );
    const edition = new URL(request.url).searchParams.get(
      "edition"
    ) as EditionSelection | null;
    if (!edition || !editionOptions.includes(edition))
      return HttpResponse.json(
        { code: "VALIDATION_ERROR", message: "Select a valid edition." },
        { status: 400 }
      );
    if (body.data.quantity > maxQuantityForEdition(edition, nft.available))
      return HttpResponse.json(
        {
          code: "UNAVAILABLE",
          message: "There are not enough editions available.",
        },
        { status: 409 }
      );
    const entries = readCartEntries().map((item) =>
      item.nftId === nft.id && item.edition === edition
        ? { ...item, quantity: body.data.quantity }
        : item
    );
    saveCartEntries(entries);
    return HttpResponse.json(getCartResponse(entries));
  }),
  http.delete("/api/cart/items/:nftId", ({ params, request }) => {
    const edition = new URL(request.url).searchParams.get(
      "edition"
    ) as EditionSelection | null;
    const entries = readCartEntries().filter(
      (item) => item.nftId !== params.nftId || item.edition !== edition
    );
    saveCartEntries(entries);
    return HttpResponse.json(getCartResponse(entries));
  }),
  http.get("/api/session", () =>
    HttpResponse.json({ user: readSession()?.user ?? null })
  ),
  http.post("/api/auth/login", async ({ request }) => {
    const body = loginSchema.safeParse(await request.json());
    const email = body.success ? body.data.email.toLocaleLowerCase() : "";
    const account = readAccounts().find(
      (item) => item.email.toLocaleLowerCase() === email
    );
    const validDemo =
      body.success &&
      email === demoUser.email &&
      (await sha256(body.data.password)) === demoPasswordHash;
    const validRegistered =
      body.success &&
      account !== undefined &&
      (await sha256(body.data.password)) === account.passwordHash;
    if (!validDemo && !validRegistered) {
      return HttpResponse.json(
        {
          code: "INVALID_CREDENTIALS",
          message: "Email or password is incorrect.",
        },
        { status: 401 }
      );
    }
    const token = crypto.randomUUID();
    const user = validDemo
      ? demoUser
      : {
          id: account?.id ?? "",
          name: account?.name ?? "",
          email: account?.email ?? email,
        };
    if (typeof window !== "undefined")
      window.sessionStorage.setItem(
        sessionStorageKey,
        JSON.stringify({ token, user })
      );
    return HttpResponse.json({ user });
  }),
  http.post("/api/auth/register", async ({ request }) => {
    const body = registerSchema.safeParse(await request.json());
    if (!body.success)
      return HttpResponse.json(
        {
          code: "VALIDATION_ERROR",
          message:
            "Enter a name, valid email and password of at least 10 characters.",
        },
        { status: 400 }
      );
    const email = body.data.email.toLocaleLowerCase();
    if (
      email === demoUser.email ||
      readAccounts().some(
        (account) => account.email.toLocaleLowerCase() === email
      )
    ) {
      return HttpResponse.json(
        {
          code: "EMAIL_IN_USE",
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }
    const user: User = {
      id: `collector-${crypto.randomUUID().slice(0, 8)}`,
      name: body.data.name,
      email,
    };
    const account = { ...user, passwordHash: await sha256(body.data.password) };
    saveAccounts([...readAccounts(), account]);
    const token = crypto.randomUUID();
    if (typeof window !== "undefined")
      window.sessionStorage.setItem(
        sessionStorageKey,
        JSON.stringify({ token, user })
      );
    return HttpResponse.json({ user }, { status: 201 });
  }),
  http.post("/api/auth/logout", () => {
    if (typeof window !== "undefined")
      window.sessionStorage.removeItem(sessionStorageKey);
    return HttpResponse.json({ ok: true });
  }),
  http.post("/api/orders", async ({ request }) => {
    if (!authorized(request))
      return HttpResponse.json(
        { code: "UNAUTHORIZED", message: "Sign in to place an order." },
        { status: 401 }
      );
    const body = orderInputSchema.safeParse(await request.json());
    const idempotencyKey = request.headers.get("idempotency-key");
    if (!body.success || !idempotencyKey)
      return HttpResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: "Payment details are incomplete.",
        },
        { status: 400 }
      );
    const stored = readStoredOrders();
    const prior = stored.find((item) => item.idempotencyKey === idempotencyKey);
    if (prior) return HttpResponse.json(prior.order);
    const entriesResult = cartEntriesSchema.safeParse(readCartEntries());
    if (!entriesResult.success || entriesResult.data.length === 0)
      return HttpResponse.json(
        {
          code: "EMPTY_CART",
          message: "Add an artwork before placing an order.",
        },
        { status: 409 }
      );
    const items = entriesResult.data.flatMap((entry): OrderItemSnapshot[] => {
      const nft = nfts.find((item) => item.id === entry.nftId);
      if (
        !nft ||
        entry.quantity > maxQuantityForEdition(entry.edition, nft.available)
      )
        return [];
      const lineTotal = subtotalEth([
        { nftId: nft.id, quantity: entry.quantity, priceEth: nft.priceEth },
      ]);
      return [
        {
          nftId: nft.id,
          edition: entry.edition,
          name: nft.name,
          collection: nft.collection,
          creator: nft.creator,
          quantity: entry.quantity,
          unitPriceEth: nft.priceEth,
          lineTotalEth: lineTotal,
        },
      ];
    });
    if (items.length !== entriesResult.data.length)
      return HttpResponse.json(
        {
          code: "UNAVAILABLE",
          message:
            "An item in your bag is no longer available. Review your bag.",
        },
        { status: 409 }
      );
    const subtotal = subtotalEth(
      items.map((item) => ({
        nftId: item.nftId,
        quantity: item.quantity,
        priceEth: item.unitPriceEth,
      }))
    );
    const status =
      body.data.paymentDecision === "approve" ? "confirmed" : "declined";
    const transactionHash = `0x${crypto.randomUUID().replaceAll("-", "")}`;
    const order: Order = {
      id: `order-${crypto.randomUUID().slice(0, 8)}`,
      status,
      version: 1,
      createdAt: new Date().toISOString(),
      network: body.data.network,
      walletAddress: body.data.walletAddress,
      items,
      subtotalEth: subtotal,
      networkFeeEth: status === "confirmed" ? "0.016" : "0",
      totalEth: formatEth(
        toWei(subtotal) + (status === "confirmed" ? toWei("0.016") : 0n)
      ),
      receipt:
        status === "confirmed"
          ? {
              transactionHash,
              explorerUrl: `https://explorer.gallery.test/tx/${transactionHash}`,
            }
          : null,
    };
    saveStoredOrders([...stored, { idempotencyKey, order }]);
    if (status === "confirmed") saveCartEntries([]);
    return HttpResponse.json(order, { status: 201 });
  }),
  http.get("/api/orders/:orderId", ({ params, request }) => {
    if (!authorized(request))
      return HttpResponse.json(
        { code: "UNAUTHORIZED", message: "Sign in to view this order." },
        { status: 401 }
      );
    const order = readStoredOrders().find(
      (item) => item.order.id === params.orderId
    )?.order;
    return order
      ? HttpResponse.json(order)
      : HttpResponse.json(
          { code: "NOT_FOUND", message: "This order could not be found." },
          { status: 404 }
        );
  }),
  socketServer.addEventListener("connection", (connection) => {
    const socket = toSocketIo(connection);
    socket.client.on("catalog:subscribe", () => {
      socket.server.emit("catalog:update", {
        version: 1,
        updatedAt: new Date().toISOString(),
      });
    });
  }),
];
