import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-5 flex items-start gap-3">
      <Link
        aria-label="Back to dashboard"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/7 text-cream-100 shadow-soft transition active:scale-95"
        href="/"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <div>
        <p className="text-sm font-semibold text-peach-200">{subtitle}</p>
        <h1 className="font-display text-4xl font-semibold text-cream-50">{title}</h1>
      </div>
    </header>
  );
}
