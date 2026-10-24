export const metadata = {
  title: "Pertanyaan Umum",
  description:
    "Temukan jawaban seputar cara pesan, ongkir, metode pembayaran, minuman, dan area delivery Cireng A&R Seyegan.",
};

const faqList = [
  {
    question: "Apakah ada minimum order untuk delivery?",
    answer:
      "Tidak ada minimum order, berapa pun belanjamu bisa dipesan. Untuk belanja mulai Rp10.000, ongkir Reguler gratis. Untuk belanja di bawah Rp10.000, ada ongkir Rp2.000.",
  },
  {
    question: "Apakah ada biaya ongkir?",
    answer:
      "Ongkir Reguler gratis untuk belanja mulai Rp10.000 di area Seyegan, dan Rp2.000 untuk belanja di bawah Rp10.000. Tersedia juga pengiriman Express dengan tarif yang tertera di halaman Checkout.",
  },
  {
    question: "Apa bedanya pengiriman Reguler dan Express?",
    answer:
      "Reguler mengikuti rute pengantaran, jadi pesanan bisa digabung dengan pesanan lain di rute yang sama. Express adalah pengiriman prioritas: pesanan langsung disiapkan begitu dikonfirmasi. Estimasi waktu tiba dikonfirmasi melalui WhatsApp.",
  },
  {
    question: "Bagaimana cara memesan?",
    answer:
      "Pilih menu yang diinginkan, atur jumlahnya di halaman Menu, lalu lanjutkan ke Checkout. Pesanan akan dikonfirmasi melalui WhatsApp, dan lokasi pengantaran dikirim lewat fitur share location.",
  },
  {
    question: "Apakah minuman bisa dipilih es atau hangat?",
    answer:
      "Bisa. Untuk minuman yang punya pilihan suhu, akan muncul pilihan Es atau Hangat saat kamu menambahkannya ke keranjang.",
  },
  {
    question: "Apakah minuman ikut diantar?",
    answer:
      "Ya, minuman ikut diantar bersama pesanan. Minuman es bisa sedikit mencair selama perjalanan, jadi sebaiknya langsung diminum setelah diterima.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer: "Saat ini tersedia COD (Cash on Delivery) dan QRIS.",
  },
  {
    question: "Apakah bisa pesan di luar area Seyegan?",
    answer:
      "Untuk saat ini, layanan delivery hanya tersedia untuk area Kecamatan Seyegan.",
  },
];

export default function FaqPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Pertanyaan Umum
      </h1>

      <div className="flex flex-col gap-4">
        {faqList.map((item, index) => (
          <div key={index} className="border-b border-border pb-4">
            <p className="font-semibold text-foreground">{item.question}</p>
            <p className="text-sm text-foreground/70 mt-1">{item.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
}