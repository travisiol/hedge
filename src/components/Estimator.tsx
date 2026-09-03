"use client";

import { useId, useState } from "react";
import { launchConfig } from "@/lib/site-config";

/**
 * Every field starts empty and the result stays a dash until all four are
 * filled in. A pre-filled calculator on a pre-launch token site is a forecast
 * with a formula drawn around it, and two of these four numbers do not exist
 * yet — so the tool's real job here is to show you which ones are missing.
 */
type Field = {
  key: "vault" | "release" | "holding" | "supply";
  label: string;
  suffix: string;
  hint: string;
  known: boolean;
};

const fields: Field[] = [
  {
    key: "vault",
    label: "Vault balance",
    suffix: "USDG",
    hint: "Not deployed. Nothing to read.",
    known: false,
  },
  {
    key: "release",
    label: "Released on a red day",
    suffix: "% of vault",
    hint: "Undecided — see §06.",
    known: false,
  },
  {
    key: "holding",
    label: "Your holding",
    suffix: "tokens",
    hint: "Yours to type.",
    known: true,
  },
  {
    key: "supply",
    label: "Total supply",
    suffix: "tokens",
    hint: "Not minted yet.",
    known: false,
  },
];

export function Estimator() {
  const id = useId();
  const [values, setValues] = useState<Record<Field["key"], string>>({
    vault: "",
    release: "",
    holding: "",
    supply: "",
  });

  const parsed = {
    vault: Number(values.vault),
    release: Number(values.release),
    holding: Number(values.holding),
    supply: Number(values.supply),
  };

  const missing = fields.filter(
    (field) =>
      !Number.isFinite(parsed[field.key]) ||
      values[field.key].trim() === "" ||
      (field.key === "supply" && parsed.supply <= 0),
  );

  const result =
    missing.length === 0
      ? (parsed.vault * (parsed.release / 100) * parsed.holding) / parsed.supply
      : null;

  return (
    <div className="plate overflow-hidden">
      <div className="grid gap-px bg-rule sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="bg-ink-2 p-5">
            <label
              htmlFor={`${id}-${field.key}`}
              className="label block text-bone-faint"
            >
              {field.label}
            </label>
            <div className="mt-3 flex items-baseline gap-2 border-b border-rule-2 pb-2 focus-within:border-red">
              <input
                id={`${id}-${field.key}`}
                inputMode="decimal"
                autoComplete="off"
                placeholder="—"
                value={values[field.key]}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    [field.key]: event.target.value,
                  }))
                }
                className="num w-full bg-transparent text-[18px] text-bone outline-none placeholder:text-bone-faint"
              />
              <span className="label shrink-0">{field.suffix}</span>
            </div>
            <p
              className={`mt-2 text-[11px] ${
                field.known ? "text-bone-faint" : "text-ice"
              }`}
            >
              {field.hint}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-rule p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:shrink-0">
          <span className="label">Your share of one red day</span>
          {/* Red is the paid state, so an empty result is not red — a dash in
              the payout colour reads as a value, which is the one thing this
              panel must never do. */}
          <p
            className={`num mt-3 text-[2rem] leading-none ${
              result === null ? "text-bone-faint" : "text-red"
            }`}
          >
            {result === null
              ? "—"
              : `${result.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })} USDG`}
          </p>
        </div>
        <p className="max-w-sm text-[12px] leading-relaxed text-bone-faint">
          {missing.length > 0 ? (
            <>
              Waiting on {missing.length} value
              {missing.length > 1 ? "s" : ""}:{" "}
              <span className="text-ice">
                {missing.map((field) => field.label.toLowerCase()).join(", ")}
              </span>
              . Two of them cannot exist until the contracts do.
            </>
          ) : (
            <>
              Arithmetic on numbers you typed. Not a projection, not a yield,
              and not a promise that a red day arrives.
            </>
          )}
        </p>
      </div>

      {launchConfig.payoutRule && (
        <p className="border-t border-rule px-6 py-4 text-[12px] text-bone-faint">
          Current rule: {launchConfig.payoutRule}
        </p>
      )}
    </div>
  );
}
