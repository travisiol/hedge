import { Section } from "./ui/Section";
import { launchConfig, explorer } from "@/lib/site-config";

const benchmarks = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    why: "The single most owned reason a portfolio is up. Which makes it the single most owned reason it is down.",
    kind: "Common stock, Nasdaq",
  },
  {
    symbol: "S&P 500",
    name: "The rest of it",
    why: "One name can fall on its own news. The index only falls when the market does, and that is the day this token exists for.",
    kind: "Equity index",
  },
];

/**
 * The premise this whole product rests on — that both closes can be read
 * onchain, correctly, every day, by a feed nobody has to trust — cannot be
 * verified from here. So it is published as four conditions the oracle has
 * to meet, unchecked, instead of asserted as a fact.
 *
 * The first box ticks itself once the oracle address is set.
 */
function Conditions() {
  const oracleSet = launchConfig.oracleAddress !== null;

  const conditions = [
    {
      done: oracleSet,
      title: "An oracle contract is deployed and named",
      body: "Its address is published on this page and can be read by anyone before they buy.",
    },
    {
      done: false,
      title: "Both closes are readable onchain",
      body: "NVDA is straightforward. The S&P 500 is licensed intellectual property of S&P Dow Jones Indices, so this either needs a licensed feed or has to read a tradable proxy instead and say so plainly.",
    },
    {
      done: false,
      title: "The calendar is defined, not assumed",
      body: "Which sessions count, what a half day does, what happens on a holiday, and what the contract does when a trading halt means there is no clean close to read.",
    },
    {
      done: false,
      title: "A no-post rule exists",
      body: "If the feed does not publish, the day must resolve to something written in advance. An oracle that can silently skip a red day is a vault with a back door.",
    },
  ];

  return (
    <ul className="mt-4 grid gap-px overflow-hidden rounded-[3px] bg-rule">
      {conditions.map((condition) => (
        <li key={condition.title} className="flex gap-4 bg-ink-2 p-6">
          <span
            aria-hidden
            className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[2px] border text-[9px] ${
              condition.done
                ? "border-red/60 bg-red-soft text-red"
                : "border-rule-2 text-transparent"
            }`}
          >
            ✓
          </span>
          <div>
            <h3 className="text-[14px] font-medium text-bone">
              {condition.title}
              <span className="label ml-3 inline">
                {condition.done ? "met" : "not met"}
              </span>
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-bone-dim">
              {condition.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Triggers() {
  const { oracleAddress } = launchConfig;

  return (
    <Section
      id="triggers"
      num="03"
      title="Two numbers, once a day"
      lede={
        <>
          The contract reads exactly two things and ignores everything else. No
          intraday wick, no volatility index, no funding rate — just where each
          benchmark closed against where it closed the day before.
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {benchmarks.map((benchmark) => (
          <div key={benchmark.symbol} className="plate p-6 sm:p-8">
            <span
              className="display block text-[1.75rem] sm:text-[2.25rem]"
              style={{ fontVariationSettings: '"wdth" 110' }}
            >
              {benchmark.symbol}
            </span>
            {/* Name and kind share a row under the symbol rather than beside
                it — set alongside a 36px lockup, "COMMON STOCK, NASDAQ" broke
                to three ragged lines. */}
            <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-[13px] text-bone-faint">
                {benchmark.name}
              </span>
              <span className="label">{benchmark.kind}</span>
            </div>
            <p className="mt-6 border-t border-rule pt-5 text-[13px] leading-relaxed text-bone-dim">
              {benchmark.why}
            </p>
            {/* No price, no chart, no arrow. There is no feed connected and a
                number here would be decoration pretending to be data. */}
            <p className="label mt-6">Last close · awaiting oracle</p>
          </div>
        ))}
      </div>

      <div className="plate mt-4 p-6 sm:p-8">
        <span className="label text-red">Definition</span>
        <p className="mt-4 text-[15px] leading-relaxed text-bone">
          A <span className="text-red">red day</span> is any session where
          either benchmark closes below its own previous close. Either — not
          both. One of the two being down is enough to pay, because a day where
          your index held and your largest position did not is still a day that
          went wrong.
        </p>
      </div>

      <Conditions />

      <div className="plate mt-4 p-6">
        <span className="label">Oracle contract</span>
        <p className="num mt-3 text-[13px] break-all text-bone-dim">
          {oracleAddress ? (
            <a
              className="hover:text-red"
              href={explorer.address(oracleAddress)}
              target="_blank"
              rel="noreferrer noopener"
            >
              {oracleAddress}
            </a>
          ) : (
            "—"
          )}
        </p>
      </div>
    </Section>
  );
}
