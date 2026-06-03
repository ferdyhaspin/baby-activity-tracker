import { Baby, Clock, LineChart, Settings } from "lucide-react";
import Link from "next/link";

export function AppNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-[430px] grid-cols-4 gap-1 border-t border-white/10 bg-ink-950/95 px-4 pb-4 pt-3 backdrop-blur">
      {[
        { href: "/", label: "Home", icon: Baby },
        { href: "/timeline", label: "Timeline", icon: Clock },
        { href: "/analytics", label: "Analytics", icon: LineChart },
        { href: "/settings", label: "Settings", icon: Settings },
      ].map((item) => (
        <Link
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-[8px] text-xs font-bold text-cream-400 transition hover:bg-white/7 active:scale-95"
          href={item.href}
          key={item.href}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
