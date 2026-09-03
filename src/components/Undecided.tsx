import { Section } from "./ui/Section";

/**
 * The open decisions, published rather than papered over. Each one is a
 * number or a rule that would change what a holder actually receives, and
 * none of them is guessed at anywhere else on this site.
 */
const open = [
  {
    title: "Fee size, and which side it sits on",
    body: "Buys, sells, or both. Too small and the vault never fills; too large and nobody trades, which also means the vault never fills.",
  },
  {
    title: "The payout curve",
    body: "Flat share of the vault per red day, or scaled to the depth of the fall. Scaling is truer to the pitch and much easier to game with one bad print.",
  },
  {
    title: "Either, both, or weighted",
    body: "The page currently says either benchmark falling pays. That is the most generous reading and it drains the vault fastest — roughly one session in two is a red day for something.",
  },
  {
    title: "How the S&P 500 gets read",
    body: "The index is licensed IP. Either a licensed feed, or a tradable proxy read instead with the substitution stated on this page. Quietly swapping one for the other is not an option.",
  },
  {
    title: "Push or claim",
    body: "Pushing USDG to every holder costs gas that scales with the holder count. A claim window shifts that cost to the holder and strands whoever does not show up.",
  },
  {
    title: "The snapshot",
    body: "Balance at the close is the obvious rule and the easiest to farm: buy at 15:59, collect, sell at 09:31. A time-weighted balance fixes it and costs more to compute.",
  },
  {
    title: "A vault floor",
    body: "Whether the vault refuses to pay below a reserve so it survives a long drawdown, and who gets to set that number after launch.",
  },
  {
    title: "The regulatory read",
    body: "A transferable token that pays holders when a named equity falls has the shape of a derivative, whatever it is called. This one needs a real opinion from a real lawyer before launch, not a disclaimer.",
  },
];

export function Undecided() {
  return (
    <Section
      id="undecided"
      num="06"
      title="Not decided yet"
      lede={
        <>
          Eight things that change what you would actually receive, none of
          them settled. They are listed here instead of being invented
          elsewhere on the page, which is why several panels above are dashes.
        </>
      }
    >
      <ol className="grid gap-px overflow-hidden rounded-[3px] bg-rule sm:grid-cols-2">
        {open.map((item, index) => (
          <li key={item.title} className="bg-ink-2 p-6">
            <div className="flex items-baseline gap-3">
              <span className="num text-[11px] text-ice">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[14px] font-medium text-bone">
                {item.title}
              </h3>
            </div>
            <p className="mt-3 pl-8 text-[13px] leading-relaxed text-bone-dim">
              {item.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
