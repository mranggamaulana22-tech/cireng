import Link from "next/link";
import { supabase } from "../lib/supabase";
import { Product } from "../data/products";

export default async function MenuPreview() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("id")
    .limit(4);

  if (error || !products) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-foreground text-lg">Menu Populer</h2>
        <Link
          href="/menu"
          className="text-sm text-primary font-medium hover:underline"
        >
          Lihat Semua Menu →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(products as Product[]).map((product) => (
          <div
            key={product.id}
            className="border border-border rounded-lg p-3"
          >
            <p className="text-sm font-medium text-foreground">
              {product.name}
            </p>
            <p className="text-sm text-primary font-semibold mt-1">
              Rp{product.price.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}