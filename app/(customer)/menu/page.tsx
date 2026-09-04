import { supabase } from "../../lib/supabase";
import MenuList from "./MenuList";
import { Product } from "../../data/products";

export default async function MenuPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-red-500">Gagal memuat menu: {error.message}</p>
      </main>
    );
  }

  return <MenuList products={(products as Product[]) ?? []} />;
}