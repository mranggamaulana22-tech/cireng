export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  isAvailable: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Cireng Original",
    price: 1000,
    description: "Cireng klasik, renyah di luar, kenyal di dalam.",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Cireng Ayam Pedas",
    price: 1000,
    description: "Isian ayam suwir pedas yang bikin nagih.",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Cireng Bakso Pedas",
    price: 1000,
    description: "Isian bakso dengan sambal pedas.",
    isAvailable: true,
  },
  {
    id: "4",
    name: "Cireng Keju",
    price: 1500,
    description: "Isian keju leleh yang gurih.",
    isAvailable: false,
  },
];