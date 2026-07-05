import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ShoppingBag, Plus, Minus, X, Trash2, Sparkles } from "lucide-react";
import pb from "@/lib/pocketbaseClient";
import { useCart } from "@/lib/CartContext";
import {
  WHATSAPP_NUMBER,
  BUSINESS_NAME,
  formatPrice,
} from "@/lib/config";

const HERO_IMG =
  "https://6a458d1f29e4cbc974f01623.imgix.net/2026_06_21_13_23_25_IMG_3019.PNG";
const CATEGORIES = ["All", "Perfume", "Body Spray", "Oud", "Diffuser", "Other"];

function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    pb.collection("products")
      .getFullList({ sort: "-created", requestKey: "store-list" })
      .then((r) => setProducts(r))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);
  return { products, loading, error };
}

export default function HomePage() {
  const { products, loading, error } = useProducts();
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [cat, setCat] = useState("All");

  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 3),
    [products]
  );
  const filtered = useMemo(
    () => (cat === "All" ? products : products.filter((p) => p.category === cat)),
    [products, cat]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100">
      <Helmet>
        <title>{BUSINESS_NAME} — Luxury Fragrances</title>
        <meta
          name="description"
          content="SIYAJZH — luxury perfumes, body sprays and fragrance. Order straight to WhatsApp."
        />
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-black/70 border-b border-white/10">
        <div className="max-w-[90rem] mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="font-display text-2xl tracking-[0.35em] gold-text font-semibold">
            {BUSINESS_NAME}
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-neutral-300">
            <a href="#shop" className="hover:text-[#f5d98b] transition-colors">Shop</a>
            <a href="#featured" className="hover:text-[#f5d98b] transition-colors">Featured</a>
            <a href="#about" className="hover:text-[#f5d98b] transition-colors">About</a>
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full border border-[#b8862f]/50 px-4 py-2 text-sm text-[#f5d98b] hover:bg-[#b8862f]/10 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.6} />
            <span className="hidden sm:inline">Cart</span>
            {cart.count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#f5d98b] to-[#b8862f] text-black text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Luxury perfume bottle with gold cap on black marble"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        <div className="relative max-w-[90rem] mx-auto px-5 md:px-10 w-full">
          <div className="max-w-xl animate-fade-up">
            <p className="flex items-center gap-2 text-[#f5d98b] tracking-[0.3em] text-xs uppercase mb-6">
              <Sparkles className="w-4 h-4" strokeWidth={1.4} /> Signature Fragrances
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] font-medium">
              Wear your <span className="gold-text italic">essence</span> in liquid gold.
            </h1>
            <p className="mt-6 text-neutral-300 text-lg leading-relaxed">
              Perfumes, body sprays and oud crafted for the bold. Build your cart
              and confirm your order in seconds — straight to our WhatsApp.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#shop"
                className="rounded-full bg-gradient-to-r from-[#b8862f] to-[#f5d98b] text-black font-medium px-8 py-3.5 hover:opacity-90 transition active:scale-[0.98]"
              >
                Shop the collection
              </a>
              <a
                href="#featured"
                className="rounded-full border border-white/25 px-8 py-3.5 text-neutral-200 hover:border-[#f5d98b] hover:text-[#f5d98b] transition"
              >
                View featured
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section id="featured" className="max-w-[90rem] mx-auto px-5 md:px-10 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#b8862f] tracking-[0.3em] text-xs uppercase mb-3">The Icons</p>
            <h2 className="font-display text-4xl md:text-5xl">Featured scents</h2>
          </div>
        </div>
        {loading ? (
          <SkeletonRow />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((p) => (
              <article
                key={p.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-950"
              >
                <div className="aspect-[4/5] overflow-hidden bg-neutral-900">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-widest text-[#b8862f] uppercase">{p.category}</p>
                  <h3 className="font-display text-2xl mt-1">{p.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[#f5d98b] text-lg">{formatPrice(p.price)}</span>
                    <button
                      onClick={() => cart.add(p)}
                      className="rounded-full border border-[#b8862f]/50 px-4 py-2 text-sm text-[#f5d98b] hover:bg-[#b8862f]/10 transition active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Shop */}
      <section id="shop" className="max-w-[90rem] mx-auto px-5 md:px-10 pb-28">
        <div className="border-t border-white/10 pt-16">
          <p className="text-[#b8862f] tracking-[0.3em] text-xs uppercase mb-3">Full Collection</p>
          <h2 className="font-display text-4xl md:text-5xl mb-8">Shop all fragrances</h2>
          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-5 py-2 text-sm tracking-wide transition ${
                  cat === c
                    ? "bg-gradient-to-r from-[#b8862f] to-[#f5d98b] text-black"
                    : "border border-white/15 text-neutral-300 hover:border-[#f5d98b]/60"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonRow />
          ) : error ? (
            <p className="text-neutral-400">Unable to load products right now. Please refresh.</p>
          ) : filtered.length === 0 ? (
            <p className="text-neutral-400 py-10 text-center">No products in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="group rounded-xl overflow-hidden border border-white/10 bg-neutral-950 flex flex-col"
                >
                  <div className="aspect-square overflow-hidden bg-neutral-900 relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {!p.in_stock && (
                      <span className="absolute top-3 left-3 bg-black/80 text-neutral-300 text-[11px] px-2 py-1 rounded">
                        Sold out
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] tracking-widest text-[#b8862f] uppercase">{p.category}</p>
                    <h3 className="font-display text-xl leading-tight mt-1">{p.name}</h3>
                    <p className="text-neutral-400 text-sm mt-1 line-clamp-2 flex-1">{p.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[#f5d98b]">{formatPrice(p.price)}</span>
                      <button
                        disabled={!p.in_stock}
                        onClick={() => cart.add(p)}
                        className="rounded-full bg-white/5 border border-white/15 w-9 h-9 flex items-center justify-center text-[#f5d98b] hover:bg-[#b8862f]/15 transition active:scale-90 disabled:opacity-40"
                        aria-label={`Add ${p.name} to cart`}
                      >
                        <Plus className="w-4 h-4" strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-white/10">
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-24 text-center">
          <p className="text-[#b8862f] tracking-[0.3em] text-xs uppercase mb-4">Our Craft</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6">
            Fragrance that <span className="gold-text italic">lingers</span>.
          </h2>
          <p className="text-neutral-300 leading-relaxed text-lg">
            {BUSINESS_NAME} curates rich, long-lasting scents — from opulent oud to
            fresh everyday body sprays. Every order is personal: pick your favourites,
            confirm on WhatsApp, and we handle the rest.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black">
        <div className="max-w-[90rem] mx-auto px-5 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl tracking-[0.35em] gold-text">{BUSINESS_NAME}</span>
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
          </p>
          <Link to="/admin" className="text-neutral-500 text-sm hover:text-[#f5d98b] transition">
            Manage store
          </Link>
        </div>
      </footer>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-neutral-950 overflow-hidden">
          <div className="aspect-square bg-neutral-900 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-1/2 bg-neutral-800 animate-pulse rounded" />
            <div className="h-3 w-3/4 bg-neutral-800 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CartDrawer({ open, onClose }) {
  const cart = useCart();

  const checkout = () => {
    if (cart.items.length === 0) return;
    const lines = cart.items.map(
      (i) => `• ${i.name} x${i.qty} — ${formatPrice(i.price * i.qty)}`
    );
    const msg =
      `Hi ${BUSINESS_NAME}! I'd like to order:\n\n` +
      lines.join("\n") +
      `\n\nTotal: ${formatPrice(cart.total)}\n\nPlease confirm availability and delivery.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-neutral-950 border-l border-white/10 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <h3 className="font-display text-2xl">Your cart</h3>
          <button onClick={onClose} aria-label="Close cart" className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500">
              <ShoppingBag className="w-10 h-10 mb-4" strokeWidth={1} />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.items.map((i) => (
                <li key={i.id} className="flex gap-4">
                  <img src={i.image} alt={i.name} className="w-20 h-20 rounded-lg object-cover bg-neutral-900" />
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="font-display text-lg leading-tight">{i.name}</p>
                      <button onClick={() => cart.remove(i.id)} className="text-neutral-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[#f5d98b] text-sm mt-1">{formatPrice(i.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => cart.setQty(i.id, i.qty - 1)}
                        className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center">{i.qty}</span>
                      <button
                        onClick={() => cart.setQty(i.id, i.qty + 1)}
                        className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-white/10 px-6 py-5 space-y-4">
          <div className="flex justify-between text-lg">
            <span className="text-neutral-400">Total</span>
            <span className="text-[#f5d98b] font-display text-2xl">{formatPrice(cart.total)}</span>
          </div>
          <button
            onClick={checkout}
            disabled={cart.items.length === 0}
            className="w-full rounded-full bg-gradient-to-r from-[#b8862f] to-[#f5d98b] text-black font-medium py-3.5 hover:opacity-90 transition active:scale-[0.99] disabled:opacity-40"
          >
            Confirm order on WhatsApp
          </button>
          {cart.items.length > 0 && (
            <button onClick={cart.clear} className="w-full text-neutral-500 text-sm hover:text-neutral-300">
              Clear cart
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
