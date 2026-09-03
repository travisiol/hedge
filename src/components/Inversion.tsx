import { Section } from "./ui/Section";

/**
 * The two states of the product, drawn as two panels of deliberately unequal
 * weight. The red one is lit and the green one is grey, which is the whole
 * inversion in one image: on this token a rising market is the boring day.
 */
function DayCard({
  kind,
  when,
  then,
  detail,
}: {
  kind: "red" | "green";
  when: string;
  then: string;
  detail: string;
}) {
  const red = kind === "red";
  return (
    <div
      className={`plate relative overflow-hidden p-6 sm:p-8 ${
        red ? "plate-red" : ""
      }`}
    >
      {red && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--red-glow),transparent_68%)] blur-2xl"
        />
      )}
      <div className="relative">
        <span className={`label ${red ? "text-red" : "text-ice"}`}>
          {red ? "Red day" : "Green day"}
        </span>

        <p className="mt-5 text-[13px] leading-relaxed text-bone-dim">
          <span className="text-bone-faint">When </span>
          {when}
        </p>

        <p
          className={`display mt-6 text-[2rem] leading-[0.95] sm:text-[2.5rem] ${
            red ? "text-red" : "text-ice"
          }`}
        >
          {then}
        </p>

        <p className="mt-6 border-t border-rule pt-5 text-[13px] leading-relaxed text-bone-dim">
          {detail}
        </p>
      </div>
    </div>
  );
}

const steps = [
  {
    n: "1",
    title: "A fee on every trade",
    body: "Buying or selling the token pays a fee. It is converted to USDG and parked in the vault. That is the only place the money ever comes from.",
  },
  {
    n: "2",
    title: "The close is read",
    body: "After each US session an oracle posts the day's change for NVDA and for the S&P 500. Two numbers, once a day, and nothing else is read.",
  },
  {
    n: "3",
    title: "One of them is red",
    body: "If either benchmark closed lower, the day is a red day. The vault releases a share of what it is holding, scaled to how far the market fell.",
  },
  {
    n: "4",
    title: "Holders are paid in USDG",
    body: "The release is split pro-rata across balances at the close. Paid in a dollar stablecoin, not in more of the token — a payout you have to sell is not a payout.",
  },
];

export function Inversion() {
  return (
    <Section
      id="inversion"
      num="01"
      title="Everything else is built to go up"
      lede={
        <>
          Every other token on every other chain asks you to believe the line
          keeps rising. This one has no opinion about the line. It only cares
          which way it moved yesterday, and it only pays you when the answer is
          down.
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <DayCard
          kind="red"
          when="NVDA or the S&P 500 closes below its previous close."
          then="The vault pays out"
          detail="USDG lands in holder wallets, split by balance. The deeper the fall, the larger the share of the vault that is released."
        />
        <DayCard
          kind="green"
          when="Both close flat or higher. The good day, for everyone else."
          then="Nothing happens"
          detail="No distribution, no announcement, no consolation. The fees collected that day stay in the vault and wait. Green days are what pay for red ones."
        />
      </div>

      <ol className="mt-4 grid gap-px overflow-hidden rounded-[3px] bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li key={step.n} className="bg-ink-2 p-6">
            <span className="num text-[11px] text-red">0{step.n}</span>
            <h3 className="mt-4 text-[14px] font-medium text-bone">
              {step.title}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-bone-dim">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-2xl border-l border-red/40 pl-5 text-[13px] leading-relaxed text-bone-dim">
        <span className="text-bone">
          The uncomfortable half, stated once and not softened:
        </span>{" "}
        a payout can never be larger than the fees already collected. A long
        enough fall with no trading volume behind it empties the vault and the
        red days stop paying, exactly when you would want them most. That is
        the failure mode of this design and no amount of copy removes it.
      </p>
    </Section>
  );
}
