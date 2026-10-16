export function generateOrderCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900); // angka 100-999

  return `AR-${yy}${mm}${dd}-${random}`;
}

export const BUSINESS_WHATSAPP_NUMBER = "6288216244145"; 

// ===== Bumbu =====
export const MAX_SEASONINGS = 2;

export const NO_SEASONING_ID = "tanpa-bumbu";

export type Seasoning = {
  id: string;
  name: string;
};

// Opsi "Tanpa bumbu" bersifat eksklusif: tidak bisa digabung dengan bumbu lain.
export const SEASONINGS: Seasoning[] = [
  { id: "tabur-jagung-bakar", name: "Bumbu tabur jagung bakar" },
  { id: "tabur-balado-pedas-manis", name: "Bumbu tabur balado pedas manis" },
  { id: "tabur-balado-extra-pedas", name: "Bumbu tabur balado extra pedas" },
  { id: "saus", name: "Saus" },
];

export function getSeasoningLabel(ids: string[]): string {
  if (ids.length === 0 || ids.includes(NO_SEASONING_ID)) {
    return "Tanpa bumbu";
  }
  return ids
    .map((id) => SEASONINGS.find((s) => s.id === id)?.name ?? id)
    .join(", ");
}