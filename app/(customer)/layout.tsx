import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import CartStickyBar from "../components/CartStickyBar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex-1 pb-20">{children}</div>
      <CartStickyBar />
      <BottomNav />
    </>
  );
}