export default function AdminLoading() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="animate-pulse flex flex-col gap-3">
        <div className="h-5 bg-foreground/10 rounded w-1/4" />
        <div className="h-32 bg-foreground/10 rounded" />
      </div>
    </main>
  );
}