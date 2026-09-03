import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="w-full bg-background border-b border-border px-4 py-3 flex items-center justify-between">
      <h2 className="text-lg font-bold text-primary">Cireng A&R</h2>
      <ThemeToggle />
    </header>
  );
}