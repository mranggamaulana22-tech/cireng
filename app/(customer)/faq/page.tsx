export const metadata = {
  title: "Pertanyaan Umum",
  description:
    "Temukan jawaban seputar cara pesan, metode pembayaran, minimum order, dan area delivery Cireng A&R Seyegan.",
};

const faqList = [
  {
    question: "Berapa minimum order untuk delivery?",
    answer: "Minimum order untuk delivery adalah Rp10.000.",
  },
  {
    question: "Apakah ada biaya ongkir?",
    answer:
      "Saat ini gratis ongkir untuk area Seyegan selama periode promo launching.",
  },
  {
    question: "Bagaimana cara memesan?",
    answer:
      "Pilih menu yang diinginkan, atur jumlahnya di halaman Menu, lalu lanjutkan ke Checkout. Pesanan akan dikonfirmasi melalui WhatsApp, dan lokasi pengantaran dikirim lewat fitur share location.",
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