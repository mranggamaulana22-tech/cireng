export type ProductCategory = "makanan" | "minuman";

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  image_url: string | null;
  is_available: boolean;
  category: ProductCategory;
  // true = saat dipesan, pelanggan memilih Es atau Hangat (popup)
  has_temperature: boolean;
};