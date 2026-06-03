"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppNav } from "@/components/AppNav";
import { PageHeader } from "@/components/PageHeader";

const chartData = [
  { day: "Thu", sleep: 720, feeding: 8, diaper: 7 },
  { day: "Fri", sleep: 650, feeding: 9, diaper: 8 },
  { day: "Sat", sleep: 790, feeding: 8, diaper: 6 },
  { day: "Sun", sleep: 700, feeding: 10, diaper: 9 },
  { day: "Mon", sleep: 760, feeding: 9, diaper: 7 },
  { day: "Tue", sleep: 690, feeding: 8, diaper: 8 },
  { day: "Wed", sleep: 810, feeding: 9, diaper: 9 },
];

export function AnalyticsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] px-4 pb-28 pt-5">
      <PageHeader title="Analytics" subtitle="Last 7 days" />
      <ChartCard title="Sleep duration">
        <ResponsiveContainer height={220} width="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#2a3346" vertical={false} />
            <XAxis dataKey="day" stroke="#c9c0b1" tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid #ffffff1a" }}
              labelStyle={{ color: "#fff7ed" }}
            />
            <Bar dataKey="sleep" fill="#c4b5fd" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Feeding count">
        <ResponsiveContainer height={190} width="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#2a3346" vertical={false} />
            <XAxis dataKey="day" stroke="#c9c0b1" tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid #ffffff1a" }}
              labelStyle={{ color: "#fff7ed" }}
            />
            <Line dataKey="feeding" stroke="#fed7aa" strokeWidth={3} type="monotone" />
            <Line dataKey="diaper" stroke="#86efac" strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <AppNav />
    </main>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4 rounded-[8px] border border-white/10 bg-white/7 p-4 shadow-soft">
      <h2 className="mb-3 font-display text-2xl font-semibold text-cream-50">{title}</h2>
      {children}
    </section>
  );
}
