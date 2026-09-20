"use client";

import { useState } from "react";
import Link from "next/link";

interface CalculatorResult {
  incomeEur: number;
  requiredThresholdEur: number;
  meetsThreshold: boolean;
  baseThresholdEur: number;
}

export function IncomeCalculatorForm() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [childrenCount, setChildrenCount] = useState("0");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/tools/income-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyIncome: Number(monthlyIncome),
          currency,
          hasSpouse,
          childrenCount: Number(childrenCount),
        }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setResult(data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="monthlyIncome" className="text-sm font-medium text-stone-700">
              Monthly income (before tax)
            </label>
            <input
              id="monthlyIncome"
              type="number"
              min={0}
              step="0.01"
              required
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-teal-700"
            />
          </div>
          <div>
            <label htmlFor="currency" className="text-sm font-medium text-stone-700">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1.5 rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-teal-700"
            >
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="hasSpouse"
            type="checkbox"
            checked={hasSpouse}
            onChange={(e) => setHasSpouse(e.target.checked)}
          />
          <label htmlFor="hasSpouse" className="text-sm text-stone-700">
            Applying with a spouse or partner
          </label>
        </div>

        <div>
          <label htmlFor="childrenCount" className="text-sm font-medium text-stone-700">
            Number of children included
          </label>
          <input
            id="childrenCount"
            type="number"
            min={0}
            max={10}
            value={childrenCount}
            onChange={(e) => setChildrenCount(e.target.value)}
            className="mt-1.5 w-32 rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-teal-700"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-900 disabled:opacity-60"
        >
          {status === "loading" ? "Calculating…" : "Check eligibility"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        )}
      </form>

      {result && (
        <div
          className={`mt-6 rounded-xl border p-6 ${
            result.meetsThreshold
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p
            className={`text-lg font-medium ${
              result.meetsThreshold ? "text-emerald-900" : "text-amber-900"
            }`}
          >
            {result.meetsThreshold ? "You meet the income threshold" : "You're below the income threshold"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">
            Your income converts to approximately{" "}
            <strong>€{result.incomeEur.toLocaleString("en-US")}</strong> per month. Based on your
            family size, the required threshold is{" "}
            <strong>€{result.requiredThresholdEur.toLocaleString("en-US")}</strong> per month
            (base: €{result.baseThresholdEur.toLocaleString("en-US")} for a single applicant).
          </p>
          <p className="mt-3 text-xs leading-relaxed text-stone-500">
            This is an estimate for guidance only, not a guarantee of visa approval — consulates
            increasingly want a 6-month average above this figure, and currency conversion rates
            fluctuate daily.
          </p>
          <Link
            href="/start"
            className="mt-4 inline-flex w-fit items-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
          >
            Start your D8 packet
          </Link>
        </div>
      )}
    </div>
  );
}
