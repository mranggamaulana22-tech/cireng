"use client";

import { Product } from "../../data/products";
import { useCart } from "../../context/CartContext";
import ProductImage from "../../components/ProductImage";

export default function MenuList({ products }: { products: Product[] }) {
  const { items, addItem, updateQuantity } = useCart();

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

      {products.length === 0 && (
        <p className="text-foreground/60">Belum ada produk tersedia.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
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
                <div className="flex items-center justify-center gap-4 mt-3 border border-border rounded-md py-1.5">
                  <button
                    onClick={() => decrease(product.id)}
                    disabled={qty === 0}
                    className="w-7 h-7 flex items-center justify-center text-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-foreground font-medium">
                    {qty}
                  </span>
                  <button
                    onClick={() => increase(product)}
                    className="w-7 h-7 flex items-center justify-center text-foreground hover:text-primary text-lg"
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