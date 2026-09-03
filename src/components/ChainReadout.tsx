"use client";

import { useBlock, useGasPrice } from "wagmi";
import { formatGwei } from "viem";
import { clsx } from "clsx";
import { useNowSeconds } from "@/lib/clock";
import { ROBINHOOD_CHAIN_ID } from "@/lib/chain";

/**
 * The only numbers on this site that are true right now. They are read from
 * the Robinhood Chain RPC in the visitor's own browser, and they sit
 * deliberately next to the project's own stats, which are all zero. The
 * chain is real; the project is not live yet; the page shows both rather
 * than borrowing the credibility of one for the other.
 */
function Cell({
  label,
  value,
  tone = "bone",
}: {
  label: string;
  value: string;
  tone?: "bone" | "red" | "ice";
}) {
  return (
    <div className="bg-ink-2 p-4">
      <p className="label">{label}</p>
      <p
        className={clsx(
          "num mt-3 text-[17px] leading-none",
          tone === "red" && "text-red",
          tone === "ice" && "text-ice",
          tone === "bone" && "text-bone",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function ChainReadout() {
  const now = useNowSeconds();

  const block = useBlock({ query: { refetchInterval: 6_000 } });
  const gas = useGasPrice({ query: { refetchInterval: 30_000 } });

  const failed = block.isError;
  const waiting = block.isPending;

  const height = block.data ? block.data.number.toLocaleString("en-US") : "—";

  // Age of OUR READ, not of the block. Robinhood Chain produces blocks far
  // faster than the 6s poll below, so labelling this "last block" would be
  // quietly false: what is a few seconds old is this panel, not the chain.
  const readAgeSeconds =
    block.dataUpdatedAt > 0 && now > 0
      ? Math.max(0, now - Math.floor(block.dataUpdatedAt / 1000))
      : null;

  const gasPrice = gas.data ? Number(formatGwei(gas.data)) : null;
  const gasLabel =
    gasPrice === null
      ? "—"
      : `${gasPrice >= 1 ? gasPrice.toFixed(2) : gasPrice.toPrecision(3)} gwei`;

  return (
    <div className="plate overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-4">
        <span className="label text-bone-dim">
          Robinhood Chain · {ROBINHOOD_CHAIN_ID}
        </span>
        <span
          className={clsx(
            "label flex items-center gap-2",
            failed ? "text-red" : waiting ? "text-ice" : "text-red",
          )}
        >
          <span
            aria-hidden
            className={clsx(
              "h-1 w-1 rounded-full",
              failed ? "bg-red" : waiting ? "bg-ice" : "live-dot bg-red",
            )}
          />
          {failed
            ? "RPC unreachable"
            : waiting
              ? "Connecting"
              : "Live · read in your browser"}
        </span>
      </div>
      <div className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
        <Cell
          label="Block height"
          value={height}
          tone={block.data ? "red" : "ice"}
        />
        <Cell
          label="Last read"
          value={readAgeSeconds === null ? "—" : `${readAgeSeconds}s ago`}
          tone={readAgeSeconds === null ? "ice" : "bone"}
        />
        <Cell
          label="Gas price"
          value={gasLabel}
          tone={gasPrice === null ? "ice" : "bone"}
        />
        <Cell
          label="RPC"
          value={failed ? "unreachable" : waiting ? "connecting" : "responding"}
          tone={failed || waiting ? "ice" : "red"}
        />
      </div>
    </div>
  );
}
