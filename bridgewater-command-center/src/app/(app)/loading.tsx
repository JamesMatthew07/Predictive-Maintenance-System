export default function AppLoading() {
  return (
    <div className="space-y-6">
      <div className="h-28 rounded-[1.4rem] border border-border/70 bg-white/70 animate-pulse" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[320px] rounded-[1.4rem] border border-border/70 bg-white/70 animate-pulse" />
        <div className="h-[320px] rounded-[1.4rem] border border-border/70 bg-white/70 animate-pulse" />
      </div>
      <div className="h-[260px] rounded-[1.4rem] border border-border/70 bg-white/70 animate-pulse" />
    </div>
  );
}
