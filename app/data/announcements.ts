export type Announcement = {
  id: string;
  type: "INFO" | "LAUNCHING" | "PROMO" | "PENTING";
  title: string;
  content: string;
};

export const announcements: Announcement[] = [
  {
    id: "1",
    type: "PROMO",
    title: "Gratis Ongkir Area Seyegan",
    content: "Selama masa promo launching, semua delivery gratis ongkir!",
  },
  {
    id: "2",
    type: "LAUNCHING",
    title: "Bumbu Spesial Segera Hadir",
    content: "Nantikan varian bumbu spesial Cireng A&R dalam waktu dekat.",
  },
];