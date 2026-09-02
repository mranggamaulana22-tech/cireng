"use client";

import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function MenuPage() {
  const { addItem } = useCart();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Menu</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-border rounded-lg p-4 bg-background"
          >
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-foreground/70 mt-1">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-bold text-primary">
                Rp{product.price.toLocaleString("id-ID")}
              </span>
              {product.isAvailable ? (
                <span className="text-xs text-success font-medium">
                  Tersedia
                </span>
              ) : (
                <span className="text-xs text-foreground/50 font-medium">
                  Habis
                </span>
              )}
            </div>

            <button
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                })
              }
              disabled={!product.isAvailable}
              className="mt-3 w-full py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {product.isAvailable ? "Tambah ke Keranjang" : "Stok Habis"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}