import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Plus, Pencil, Trash2, LogOut, ArrowLeft } from "lucide-react";
import pb from "@/lib/pocketbaseClient";
import { BUSINESS_NAME, formatPrice } from "@/lib/config";

const CATEGORIES = ["Perfume", "Body Spray", "Oud", "Diffuser", "Other"];
const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "Perfume",
  image: "",
  featured: false,
  in_stock: true,
};

export default function AdminPage() {
  const [user, setUser] = useState(pb.authStore.record);

  useEffect(() => pb.authStore.onChange((_t, r) => setUser(r)), []);

  const isAdmin = user && user.role === "admin";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100">
      <Helmet>
        <title>{BUSINESS_NAME} — Store Manager</title>
      </Helmet>
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-[#f5d98b] text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to store
          </Link>
          <span className="font-display tracking-[0.3em] gold-text">{BUSINESS_NAME} ADMIN</span>
          {isAdmin ? (
            <button
              onClick={() => pb.authStore.clear()}
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <span className="w-24" />
          )}
        </div>
      </header>
      {isAdmin ? <Manager /> : <Login authed={!!user} />}
    </div>
  );
}

function Login({ authed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await pb.collection("users").authWithPassword(email, password);
      if (res.record.role !== "admin") {
        setErr("This account is not an administrator.");
        pb.authStore.clear();
      }
    } catch {
      setErr("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-24">
      <h1 className="font-display text-4xl mb-2">Store manager</h1>
      <p className="text-neutral-400 mb-8">Sign in to create and manage products.</p>
      {authed && (
        <p className="mb-4 text-amber-400 text-sm">Signed in, but this account lacks admin access.</p>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg bg-neutral-950 border border-white/15 px-4 py-3 focus:border-[#f5d98b] outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg bg-neutral-950 border border-white/15 px-4 py-3 focus:border-[#f5d98b] outline-none"
          />
        </div>
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-[#b8862f] to-[#f5d98b] text-black font-medium py-3.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Manager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product or null
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    pb
      .collection("products")
      .getFullList({ sort: "-created", requestKey: "admin-list" })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setShowForm(true);
  };
  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    await pb.collection("products").delete(p.id);
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Products</h1>
          <p className="text-neutral-400 mt-1">{products.length} item(s) in your store.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b8862f] to-[#f5d98b] text-black font-medium px-5 py-3 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" /> New product
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-neutral-400 py-16 text-center border border-white/10 rounded-xl">
          No products yet. Create your first one.
        </p>
      ) : (
        <div className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 bg-neutral-950">
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 rounded-lg object-cover bg-neutral-900"
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              />
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg truncate">{p.name}</p>
                <p className="text-sm text-neutral-500">
                  {p.category} · {formatPrice(p.price)}
                  {p.featured ? " · Featured" : ""}
                  {p.in_stock ? "" : " · Sold out"}
                </p>
              </div>
              <button onClick={() => openEdit(p)} className="p-2 text-neutral-400 hover:text-[#f5d98b]">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(p)} className="p-2 text-neutral-400 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => setShowForm(false)}
          onSaved={(rec) => {
            setProducts((prev) => {
              const exists = prev.some((x) => x.id === rec.id);
              return exists ? prev.map((x) => (x.id === rec.id ? rec : x)) : [rec, ...prev];
            });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          category: product.category || "Perfume",
          image: product.image || "",
          featured: !!product.featured,
          in_stock: product.in_stock !== false,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    const data = { ...form, price: Number(form.price) || 0 };
    try {
      const rec = product
        ? await pb.collection("products").update(product.id, data)
        : await pb.collection("products").create(data);
      onSaved(rec);
    } catch (e2) {
      setErr("Could not save. Check the fields and try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-10 px-4">
      <div className="w-full max-w-lg bg-neutral-950 border border-white/10 rounded-2xl p-6">
        <h3 className="font-display text-2xl mb-5">
          {product ? "Edit product" : "New product"}
        </h3>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full rounded-lg bg-black border border-white/15 px-4 py-2.5 focus:border-[#f5d98b] outline-none"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-lg bg-black border border-white/15 px-4 py-2.5 focus:border-[#f5d98b] outline-none resize-none"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price">
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="w-full rounded-lg bg-black border border-white/15 px-4 py-2.5 focus:border-[#f5d98b] outline-none"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full rounded-lg bg-black border border-white/15 px-4 py-2.5 focus:border-[#f5d98b] outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Image URL">
            <input
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://…"
              className="w-full rounded-lg bg-black border border-white/15 px-4 py-2.5 focus:border-[#f5d98b] outline-none"
            />
          </Field>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="accent-[#b8862f] w-4 h-4"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.in_stock}
                onChange={(e) => set("in_stock", e.target.checked)}
                className="accent-[#b8862f] w-4 h-4"
              />
              In stock
            </label>
          </div>
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-white/15 py-3 text-neutral-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="flex-1 rounded-full bg-gradient-to-r from-[#b8862f] to-[#f5d98b] text-black font-medium py-3 hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-neutral-400">{label}</label>
      {children}
    </div>
  );
}
