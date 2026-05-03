export function LoadingSpinner({ label = "加载中…" }: { label?: string }) {
  return (
    <div className="atelier-loading">
      <div className="atelier-loading-spinner" />
      <p>{label}</p>
    </div>
  );
}
