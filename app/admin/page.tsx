import Link from "next/link";

const adminMenu = [
  {
    href: "/admin/status",
    title: "Status Toko & Pengumuman",
    description: "Atur buka/tutup toko dan kelola pengumuman",
  },
  {
    href: "/admin/products",
    title: "Kelola Produk",
    description: "Tambah, edit, dan atur ketersediaan produk",
  },
  {
    href: "/admin/location",
    title: "Lokasi Hari Ini",
    description: "Atur lokasi jualan harian",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Dashboard Admin
      </h1>

      <div className="flex flex-col gap-3">
        {adminMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-border rounded-lg p-4 hover:border-primary transition-colors block"
          >
            <p className="font-semibold text-foreground">{item.title}</p>
            <p className="text-sm text-foreground/60 mt-1">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}