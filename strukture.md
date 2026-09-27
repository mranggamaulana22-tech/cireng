# Struktur Proyek Cireng A&R Seyegan

Dokumen ini merangkum struktur folder dan file utama proyek.

```text
cireng/
├── .env.local                 # Variabel lingkungan lokal
├── .gitignore
├── AGENTS.md                  # Aturan kerja agen untuk proyek
├── CLAUDE.md                  # Referensi aturan agen
├── eslint.config.mjs          # Konfigurasi ESLint
├── middleware.ts              # Middleware Next.js
├── next-env.d.ts              # Deklarasi tipe Next.js
├── next.config.ts             # Konfigurasi Next.js
├── package-lock.json          # Lockfile dependensi npm
├── package.json               # Metadata proyek dan scripts npm
├── postcss.config.mjs         # Konfigurasi PostCSS
├── README.md                  # Dokumentasi proyek
├── strukture.md               # Dokumentasi struktur proyek ini
├── tsconfig.json              # Konfigurasi TypeScript
├── app/
│   ├── globals.css            # Style global aplikasi
│   ├── icon.png               # Ikon aplikasi
│   ├── layout.tsx             # Root layout, metadata, provider, dan Google Analytics
│   ├── robots.ts              # Konfigurasi robots.txt
│   ├── sitemap.ts             # Konfigurasi sitemap
│   ├── (customer)/             # Route group untuk halaman pelanggan
│   │   ├── layout.tsx          # Layout area pelanggan
│   │   ├── page.tsx            # Halaman utama pelanggan
│   │   ├── cart/
│   │   │   └── page.tsx        # Halaman keranjang
│   │   ├── checkout/
│   │   │   └── page.tsx        # Halaman checkout
│   │   ├── faq/
│   │   │   └── page.tsx        # Halaman FAQ
│   │   ├── hubungi-kami/
│   │   │   └── page.tsx        # Halaman kontak
│   │   ├── lainnya/
│   │   │   └── page.tsx        # Halaman menu lainnya
│   │   ├── lokasi-hari-ini/
│   │   │   └── page.tsx        # Halaman lokasi berjualan hari ini
│   │   ├── menu/
│   │   │   ├── MenuList.tsx    # Komponen daftar menu
│   │   │   └── page.tsx        # Halaman menu
│   │   ├── order/
│   │   │   └── [orderCode]/
│   │   │       └── page.tsx     # Halaman detail pesanan berdasarkan kode
│   │   ├── pengumuman/
│   │   │   └── page.tsx        # Halaman pengumuman
│   │   ├── saran/
│   │   │   └── page.tsx        # Halaman saran pelanggan
│   │   └── tentang/
│   │       └── page.tsx        # Halaman tentang usaha
│   ├── admin/                   # Route area administrasi
│   │   ├── layout.tsx           # Layout area admin
│   │   ├── page.tsx             # Dashboard admin
│   │   ├── feedback/
│   │   │   └── page.tsx         # Pengelolaan feedback
│   │   ├── location/
│   │   │   └── page.tsx         # Pengelolaan lokasi
│   │   ├── login/
│   │   │   └── page.tsx         # Halaman login admin
│   │   ├── products/
│   │   │   └── page.tsx         # Pengelolaan produk
│   │   └── status/
│   │       └── page.tsx         # Pengelolaan status toko
│   ├── components/              # Komponen UI yang digunakan bersama
│   │   ├── AnnouncementBoard.tsx
│   │   ├── BottomNav.tsx
│   │   ├── CartStickyBar.tsx
│   │   ├── Header.tsx
│   │   ├── InstallButton.tsx
│   │   ├── LocationTodayCard.tsx
│   │   ├── MenuPreview.tsx
│   │   ├── ProductImage.tsx
│   │   ├── StoreStatusCard.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── context/
│   │   └── CartContext.tsx      # Context dan state keranjang belanja
│   ├── data/                    # Data dan fungsi pengolahan data aplikasi
│   │   ├── announcements.ts
│   │   ├── location.ts
│   │   ├── orderUtils.ts
│   │   ├── products.ts
│   │   └── storeStatus.ts
│   └── lib/                     # Helper dan konfigurasi layanan eksternal
│       ├── storeStatusHelper.ts
│       ├── supabase.ts
│       └── supabase/
│           ├── client.ts        # Supabase client untuk sisi browser
│           └── server.ts         # Supabase client untuk sisi server
└── public/                      # Asset statis yang dapat diakses publik
    ├── apple-touch-icon.png
    ├── file.svg
    ├── globe.svg
    ├── manifest.json            # Konfigurasi Progressive Web App
    ├── next.svg
    ├── vercel.svg
    ├── window.svg
    └── icons/
        ├── icon-192.png
        └── icon-512.png
```

## Catatan Struktur

- Folder `(customer)` adalah route group Next.js, sehingga nama folder tersebut tidak menjadi bagian dari URL.
- Folder `[orderCode]` adalah dynamic route untuk menampilkan pesanan berdasarkan kode pesanan.
- Folder `admin` berisi halaman dan alur khusus pengelola aplikasi.
- Folder `components`, `context`, `data`, dan `lib` menjadi area kode bersama untuk halaman pelanggan maupun admin.
- Folder `public` berisi file statis, ikon, dan manifest PWA.
- Folder hasil generate seperti `node_modules`, `.next`, dan `.git` tidak dicantumkan dalam dokumentasi ini.
