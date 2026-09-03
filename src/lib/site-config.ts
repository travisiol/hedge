/**
 * The whole brand lives in the three strings at the top of `siteConfig`
 * (`name`, `wordmark`, `ticker`) plus the `NEXT_PUBLIC_HEDGE_*` env prefix.
 * Nothing else in the codebase spells the name out, so a rename is those
 * strings and the prefix — never a grep-and-replace through components.
 */
export const siteConfig = {
  // Placeholder name — not final.
  name: "HEDGE",
  wordmark: "Hedge",
  ticker: "$HEDGE",

  tagline: "THE TOKEN THAT PAYS YOU WHEN IT GOES WRONG.",
  description:
    "A token that pays its holders in USDG on every day NVDA or the S&P 500 closes down, and pays nothing on the days they close up. Trading fees pile up while the market climbs; they are handed back while it falls.",
  seoDescription:
    "USDG to holders on every red day for NVDA or the S&P 500. Nothing on green days. Crash insurance priced like a memecoin.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hedge.example",
  x: "https://x.com/hedge_onchain",

  /**
   * The two things this project must never be mistaken for. Both appear in
   * full in the footer, and the FAQ answers each of them before it answers
   * anything flattering.
   */
  affiliationNotice:
    "HEDGE is an independent project. It is not affiliated with, endorsed by or connected to NVIDIA Corporation, S&P Global, S&P Dow Jones Indices, Paxos or Robinhood Markets. “NVDA” and “S&P 500” are used only to name the public benchmarks this token reads.",
  notInsuranceNotice:
    "HEDGE is not insurance, not a put option and not a hedge in the regulated sense of the word. Nobody underwrites it, no capital is reserved for you, and a payout can only ever be as large as the fees already collected.",
} as const;

/** Treats both "unset" and "" the same way: not configured yet. */
export function envOrNull(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value : null;
}

const tokenAddress = envOrNull(process.env.NEXT_PUBLIC_HEDGE_TOKEN_ADDRESS);
const vaultAddress = envOrNull(process.env.NEXT_PUBLIC_HEDGE_VAULT_ADDRESS);
const oracleAddress = envOrNull(process.env.NEXT_PUBLIC_HEDGE_ORACLE_ADDRESS);

/**
 * Launch surface. Every value is env-driven and unset by default: an address
 * that is not real must never be able to reach a build.
 *
 * `isLive` needs the flag AND the token AND the vault, because the vault is
 * the half of this product that actually pays. A token with no vault behind
 * it is a token that pays nothing on red days either.
 */
export const launchConfig = {
  isLive:
    process.env.NEXT_PUBLIC_HEDGE_LIVE === "true" &&
    tokenAddress !== null &&
    vaultAddress !== null,
  tokenAddress,
  /** Holds the collected USDG between distributions. */
  vaultAddress,
  /** Posts the daily close of each benchmark. Undecided — see §06. */
  oracleAddress,
  /** USDG on this chain. Must be the real one; a wrong address pays nobody. */
  usdgAddress: envOrNull(process.env.NEXT_PUBLIC_HEDGE_USDG_ADDRESS),
  buyUrl: envOrNull(process.env.NEXT_PUBLIC_HEDGE_BUY_URL),
  /** e.g. "1.5% of every buy and sell" — one line, only once it is decided. */
  feeDescription: envOrNull(process.env.NEXT_PUBLIC_HEDGE_FEE_DESCRIPTION),
  /** e.g. "35% of the vault per red day" — the payout rule, once decided. */
  payoutRule: envOrNull(process.env.NEXT_PUBLIC_HEDGE_PAYOUT_RULE),
} as const;

export const explorer = {
  base:
    process.env.NEXT_PUBLIC_ROBINHOOD_EXPLORER_URL ??
    "https://robinhoodchain.blockscout.com",
  address(addr: string) {
    return `${this.base}/address/${addr}`;
  },
} as const;
