"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SaranPage() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!message.trim()) {
      alert("Tulis saran atau masukanmu dulu ya.");
      return;
    }

    setSending(true);

    const { error } = await supabase.from("feedback").insert({
      message: message,
    });

    setSending(false);

    if (error) {
      alert("Gagal mengirim saran. Coba lagi ya.");
      return;
    }

    setMessage("");
    setSent(true);
  }

  if (sent) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Terima Kasih!
        </h1>
        <p className="text-foreground/60">
          Saranmu sudah kami terima. Kami akan terus berusaha menjadi lebih
          baik.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Kirim saran lain
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Saran & Masukan
      </h1>
      <p className="text-sm text-foreground/60 mb-6">
        Punya kritik, saran, atau ide buat Cireng A&R? Tulis di bawah. Kamu
        tidak perlu login, dan boleh kirim secara anonim.
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        placeholder="Tulis saran kamu di sini..."
        className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
      />

      <button
        onClick={handleSend}
        disabled={sending}
        className="mt-3 w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {sending ? "Mengirim..." : "Kirim Saran"}
      </button>
    </main>
  );
}