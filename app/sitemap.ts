import { MetadataRoute } from "next";
import { supabase } from "./lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cirengar.com";

  const staticPages = [
    "",
    "/menu",
    "/cart",
    "/lokasi-hari-ini",
    "/pengumuman",
    "/tentang",
    "/faq",
    "/lainnya",
    "/hubungi-kami",
    "/saran",
    "/masalah-pesanan",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  return staticPages;
}