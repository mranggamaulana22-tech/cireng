"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Deteksi apakah sudah terpasang sebagai app (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Deteksi iPhone/iPad
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Tangkap event install (cuma jalan di Chrome/Edge Android)
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setInstallPrompt(e);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;

    installPrompt.prompt();
    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  }

  if (isInstalled) {
    return null;
  }

  // Android/Chrome: tombol yang beneran memicu popup instalasi
  if (installPrompt) {
    return (
      <button
        onClick={handleInstall}
        className="w-full flex items-center gap-3 px-4 py-3.5 border border-primary/30 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
      >
        <Download size={20} className="text-primary" />
        <div className="text-left">
          <p className="text-foreground font-medium">Tambahkan ke Layar Utama</p>
          <p className="text-xs text-foreground/60">
            Akses lebih cepat, seperti aplikasi
          </p>
        </div>
      </button>
    );
  }

  // iPhone: instruksi manual, karena tidak bisa dipicu otomatis
  if (isIOS) {
    return (
      <div className="w-full flex items-start gap-3 px-4 py-3.5 border border-border rounded-lg">
        <Download size={20} className="text-foreground/50 mt-0.5" />
        <div className="text-left">
          <p className="text-foreground font-medium">Tambahkan ke Layar Utama</p>
          <p className="text-xs text-foreground/60 mt-0.5">
            Tap ikon Share (kotak dengan panah ke atas), lalu pilih
            &quot;Add to Home Screen&quot;
          </p>
        </div>
      </div>
    );
  }

  // Desktop atau browser yang tidak mendukung: sembunyikan saja
  return null;
}