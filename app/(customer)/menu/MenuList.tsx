"use client";

import { useState } from "react";
import { Product, ProductCategory } from "../../data/products";
import { useCart } from "../../context/CartContext";
import ProductImage from "../../components/ProductImage";

type TabKey = "semua" | ProductCategory;

const tabs: { key: TabKey; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "makanan", label: "Makanan" },
  { key: "minuman", label: "Minuman" },
];

export default function MenuList({ products }: { products: Product[] }) {
  const { items, addItem, updateQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<TabKey>("semua");

  const hasDrinks = products.some((p) => p.category === "minuman");
  const visibleProducts =
    activeTab === "semua"
      ? products
      : products.filter((p) => p.category === activeTab);

  function getQty(productId: number) {
    const found = items.find((item) => item.id === String(productId));
    return found ? found.quantity : 0;
  }

  function increase(product: Product) {
    const currentQty = getQty(product.id);
    if (currentQty === 0) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        category: product.category,
      });
    } else {
      updateQuantity(String(product.id), currentQty + 1);
    }
  }

  function decrease(productId: number) {
    const currentQty = getQty(productId);
    updateQuantity(String(productId), currentQty - 1);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Menu</h1>

      {hasDrinks && (
        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 && (
        <p className="text-foreground/60">Belum ada produk tersedia.</p>
      )}

      {products.length > 0 && visibleProducts.length === 0 && (
        <p className="text-foreground/60">Belum ada produk di kategori ini.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {visibleProducts.map((product) => {
          const qty = getQty(product.id);

          return (
            <div
              key={product.id}
              className="border border-border rounded-lg p-3 bg-background"
            >
              <ProductImage src={product.image_url ?? undefined} alt={product.name} />
              <h3 className="font-semibold text-foreground mt-3">
                {product.name}
              </h3>
              <p className="text-sm text-foreground/70 mt-1">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-primary">
                  Rp{product.price.toLocaleString("id-ID")}
                </span>
                {product.is_available ? (
                  <span className="text-xs text-success font-medium">
                    Tersedia
                  </span>
                ) : (
                  <span className="text-xs text-foreground/50 font-medium">
                    Habis
                  </span>
                )}
              </div>

              {product.is_available && (
                <div className="flex items-center justify-between mt-3 py-1">
                  <button
                    onClick={() => decrease(product.id)}
                    disabled={qty === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-foreground/5 text-foreground text-base font-medium active:scale-90 active:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-transform"
                  >
                    −
                  </button>
                  <span className="text-center text-foreground font-semibold text-sm min-w-[20px]">
                    {qty}
                  </span>
                  <button
                    onClick={() => increase(product)}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground text-base font-medium active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}