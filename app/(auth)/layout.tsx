export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <div className="dot-grid animate-grid-fade pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.08_255/0.06),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.6_0.1_290/0.04),transparent_50%)]" />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
