export default function Loading() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="animate-pulse flex flex-col gap-4">
        <div className="h-6 bg-foreground/10 rounded w-1/3" />
        <div className="h-24 bg-foreground/10 rounded" />
        <div className="h-24 bg-foreground/10 rounded" />
        <div className="h-24 bg-foreground/10 rounded" />
      </div>
    </main>
  );
}