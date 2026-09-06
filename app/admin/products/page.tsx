"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  is_available: boolean;
};

const emptyForm = {
  name: "",
  slug: "",
  price: "",
  description: "",
};

export default function AdminProductsPage() {
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadProducts() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("id");
    setProducts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      price: String(product.price),
      description: product.description ?? "",
    });
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.slug.trim() || !form.price.trim()) {
      alert("Nama, slug, dan harga wajib diisi.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      description: form.description,
    };

    if (editingId) {
      await supabase.from("products").update(payload).eq("id", editingId);
    } else {
      await supabase.from("products").insert({ ...payload, is_available: true });
    }

    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    loadProducts();
  }

  async function toggleAvailability(product: Product) {
    await supabase
      .from("products")
      .update({ is_available: !product.is_available })
      .eq("id", product.id);
    loadProducts();
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-8">Memuat...</main>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">Kelola Produk</h1>
        <button
          onClick={openAddForm}
          className="text-sm text-primary font-medium border border-primary/30 rounded-md px-3 py-1.5 hover:bg-primary/10 transition-colors"
        >
          + Tambah
        </button>
      </div>

      {showForm && (
        <div className="border border-border rounded-lg p-4 mb-4 flex flex-col gap-3">
          <p className="font-semibold text-foreground">
            {editingId ? "Edit Produk" : "Produk Baru"}
          </p>

          <div>
            <p className="text-sm text-foreground/70 mb-1">Nama</p>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <p className="text-sm text-foreground/70 mb-1">Slug</p>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="contoh: cireng-ayam-suwir-pedas"
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <p className="text-sm text-foreground/70 mb-1">Harga</p>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <p className="text-sm text-foreground/70 mb-1">Deskripsi</p>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 rounded-md border border-border text-foreground text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-border rounded-lg p-3 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-sm text-foreground/60">
                Rp{product.price.toLocaleString("id-ID")}
              </p>
              <p
                className={`text-xs mt-1 font-medium ${
                  product.is_available ? "text-success" : "text-foreground/50"
                }`}
              >
                {product.is_available ? "Tersedia" : "Habis"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <button
                onClick={() => openEditForm(product)}
                className="text-xs text-primary hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => toggleAvailability(product)}
                className="text-xs text-foreground/60 hover:underline"
              >
                Toggle Stok
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-xs text-foreground/40 hover:text-red-500 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}