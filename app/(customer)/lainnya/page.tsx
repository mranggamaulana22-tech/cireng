import Link from "next/link";
import { Info, Megaphone, HelpCircle, MessageSquareText, Phone } from "lucide-react";

const menuItems = [
  { href: "/tentang", label: "Tentang Kami", icon: Info },
  { href: "/pengumuman", label: "Pengumuman", icon: Megaphone },
  { href: "/faq", label: "Pertanyaan Umum (FAQ)", icon: HelpCircle },
  { href: "/saran", label: "Saran & Masukan", icon: MessageSquareText },
  { href: "/hubungi-kami", label: "Hubungi Kami", icon: Phone },
];

export default function LainnyaPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Lainnya</h1>

      <div className="flex flex-col rounded-lg border border-border overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 hover:bg-foreground/5 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <Icon size={20} className="text-foreground/50" />
              <span className="text-foreground">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}