export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  image_url: string | null;
  is_available: boolean;
};