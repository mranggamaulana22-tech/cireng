import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";

export default function ProductImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) {
    return (
      <div className="w-full aspect-square rounded-md bg-foreground/5 flex items-center justify-center">
        <UtensilsCrossed className="text-foreground/20" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full aspect-square rounded-md overflow-hidden relative">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}