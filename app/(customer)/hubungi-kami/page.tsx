import { BUSINESS_WHATSAPP_NUMBER } from "../../data/orderUtils";

export default function HubungiKamiPage() {
  const waLink = "https://wa.me/" + BUSINESS_WHATSAPP_NUMBER;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Hubungi Kami
      </h1>

      <div className="border border-border rounded-lg p-4 flex flex-col gap-3">
        <div>
          <p className="text-sm text-foreground/60">WhatsApp</p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
            Chat via WhatsApp
          </a>
        </div>

        <div>
          <p className="text-sm text-foreground/60">Area Delivery</p>
          <p className="text-foreground">Kecamatan Seyegan, Sleman</p>
        </div>

        <div>
          <p className="text-sm text-foreground/60">Jam Operasional</p>
          <p className="text-foreground">Cek Status Toko di Beranda</p>
        </div>
      </div>
    </main>
  );
}