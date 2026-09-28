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
      <div className="flex-1 pb-[calc(10rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
      <CartStickyBar />
      <BottomNav />
    </>
  );
}