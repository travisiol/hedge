import { Section } from "./ui/Section";
import { launchConfig, explorer } from "@/lib/site-config";

/**
 * A schematic, not an illustration. Every box here is a thing that has to
 * exist onchain, and the two outbound lanes are drawn with different weights
 * because only one of them moves money on any given day.
 */
function Schematic() {
  return (
    <div className="plate scroll-x overflow-x-auto p-5 sm:p-8">
      <svg
        viewBox="0 0 900 260"
        className="w-full min-w-[520px]"
        role="img"
        aria-label="Trading fees flow into a USDG vault. On a red day the vault pays holders; on a green day the balance stays put."
      >
        <defs>
          <linearGradient id="lane-red" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff2e1f" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ff2e1f" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* lanes */}
        <path
          d="M150 130 H340"
          stroke="var(--rule-2)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M560 130 H620 Q640 130 640 110 V64 H760"
          stroke="url(#lane-red)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M560 130 H620 Q640 130 640 150 V196 H760"
          stroke="var(--rule-2)"
          strokeWidth="1"
          strokeDasharray="3 4"
          fill="none"
        />

        {/* boxes */}
        <g>
          <rect
            x="20"
            y="104"
            width="130"
            height="52"
            rx="3"
            fill="var(--ink-3)"
            stroke="var(--rule-2)"
          />
          <text
            x="85"
            y="126"
            textAnchor="middle"
            className="num"
            fontSize="10"
            letterSpacing="1.6"
            fill="var(--bone-faint)"
          >
            TRADES
          </text>
          <text
            x="85"
            y="142"
            textAnchor="middle"
            className="num"
            fontSize="11"
            fill="var(--bone)"
          >
            fee in USDG
          </text>
        </g>

        <g>
          <rect
            x="340"
            y="88"
            width="220"
            height="84"
            rx="3"
            fill="var(--ink-3)"
            stroke="rgba(255,46,31,0.35)"
          />
          <text
            x="450"
            y="114"
            textAnchor="middle"
            className="num"
            fontSize="10"
            letterSpacing="1.6"
            fill="var(--red)"
          >
            THE VAULT
          </text>
          <text
            x="450"
            y="138"
            textAnchor="middle"
            className="num"
            fontSize="13"
            fill="var(--bone)"
          >
            holds USDG
          </text>
          <text
            x="450"
            y="156"
            textAnchor="middle"
            className="num"
            fontSize="10"
            fill="var(--bone-faint)"
          >
            fills on green, drains on red
          </text>
        </g>

        <g>
          <rect
            x="760"
            y="38"
            width="120"
            height="52"
            rx="3"
            fill="rgba(255,46,31,0.07)"
            stroke="rgba(255,46,31,0.45)"
          />
          <text
            x="820"
            y="60"
            textAnchor="middle"
            className="num"
            fontSize="10"
            letterSpacing="1.6"
            fill="var(--red)"
          >
            RED DAY
          </text>
          <text
            x="820"
            y="76"
            textAnchor="middle"
            className="num"
            fontSize="11"
            fill="var(--bone)"
          >
            holders paid
          </text>
        </g>

        <g>
          <rect
            x="760"
            y="170"
            width="120"
            height="52"
            rx="3"
            fill="transparent"
            stroke="var(--rule-2)"
            strokeDasharray="3 4"
          />
          <text
            x="820"
            y="192"
            textAnchor="middle"
            className="num"
            fontSize="10"
            letterSpacing="1.6"
            fill="var(--ice)"
          >
            GREEN DAY
          </text>
          <text
            x="820"
            y="208"
            textAnchor="middle"
            className="num"
            fontSize="11"
            fill="var(--bone-faint)"
          >
            balance stays
          </text>
        </g>

        {/* the switch */}
        <circle
          cx="640"
          cy="130"
          r="5"
          fill="var(--ink)"
          stroke="var(--red)"
          strokeWidth="1.5"
        />
        <text
          x="640"
          y="248"
          textAnchor="middle"
          className="num"
          fontSize="9"
          letterSpacing="1.6"
          fill="var(--bone-faint)"
        >
          ORACLE READS THE CLOSE
        </text>
      </svg>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="bg-ink-2 p-5">
      <span className="label">{label}</span>
      <p className="num awaiting mt-3 text-[1.5rem] leading-none">{value}</p>
      {note && (
        <p className="mt-2 text-[11px] leading-relaxed text-bone-faint">
          {note}
        </p>
      )}
    </div>
  );
}

export function VaultSection() {
  const { vaultAddress, isLive, feeDescription, payoutRule } = launchConfig;

  return (
    <Section
      id="vault"
      num="02"
      title="Where the money comes from"
      lede={
        <>
          Nothing is minted to pay you and nobody is underwriting this. Every
          USDG a holder ever receives was collected as a trading fee first,
          sat in the vault while the market went up, and left on a day it went
          down.
        </>
      }
    >
      <Schematic />

      <div className="mt-4 grid gap-px overflow-hidden rounded-[3px] bg-rule sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Vault balance"
          value="—"
          note={isLive ? "Reading from chain." : "No vault deployed yet."}
        />
        <Stat label="Paid to date" value="0.00" note="No distribution has run." />
        <Stat label="Red days paid" value="0" note="Counted from launch." />
        <Stat
          label="Trade fee"
          value={feeDescription ?? "—"}
          note={feeDescription ? undefined : "Undecided — see §06."}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="plate p-6">
          <span className="label">Vault contract</span>
          <p className="num mt-3 text-[13px] break-all text-bone-dim">
            {vaultAddress ? (
              <a
                className="hover:text-red"
                href={explorer.address(vaultAddress)}
                target="_blank"
                rel="noreferrer noopener"
              >
                {vaultAddress}
              </a>
            ) : (
              "—"
            )}
          </p>
          <p className="mt-4 text-[12px] leading-relaxed text-bone-faint">
            Published here the moment it is deployed, before anything is
            bought. Until then this line is a dash, not a placeholder address.
          </p>
        </div>
        <div className="plate p-6">
          <span className="label">Payout rule</span>
          <p className="num mt-3 text-[13px] text-bone-dim">
            {payoutRule ?? "—"}
          </p>
          <p className="mt-4 text-[12px] leading-relaxed text-bone-faint">
            How much of the vault a red day releases, and how that scales with
            the size of the fall. Still open — a number invented here would be
            a forecast wearing a rule&apos;s clothes.
          </p>
        </div>
      </div>
    </Section>
  );
}
