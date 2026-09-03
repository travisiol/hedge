import { siteConfig, launchConfig } from "@/lib/site-config";
import { Storm } from "./Storm";
import { BuyButton } from "./BuyButton";

/**
 * The hero states the rule and nothing else. There is no price, no chart and
 * no benchmark reading anywhere on it, because none of those exist yet and a
 * hero is exactly where a project is most tempted to invent them.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <div aria-hidden className="grid-floor absolute inset-0 opacity-70" />

      {/* The wordmark, set enormous and nearly invisible, as the back plate
          the object falls in front of. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[16%] flex justify-center"
      >
        <span
          className="display select-none text-[26vw] leading-none text-transparent"
          style={{
            WebkitTextStroke: "1px rgba(233,230,224,0.075)",
            fontVariationSettings: '"wdth" 125',
          }}
        >
          {siteConfig.name}
        </span>
      </div>

      <Storm className="absolute inset-0" />
      <div aria-hidden className="hero-veil absolute inset-0 z-[1]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pt-28 pb-8 sm:px-8">
        <p className="label">
          <span className="text-red">■</span> Crash insurance, sold as a
          memecoin
        </p>

        <div className="mt-auto max-w-3xl">
          <h1 className="display text-[3.25rem] leading-[0.88] sm:text-[4.5rem] md:text-[6.25rem]">
            Get paid
            <br />
            on the way
            <br />
            <span className="text-red">down.</span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-bone-dim sm:text-base">
            {siteConfig.ticker} pays its holders in USDG on every day NVDA or
            the S&amp;P 500 closes lower. On the days they close higher it pays
            nothing at all, and the fees keep piling up for the next time they
            don&apos;t.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <BuyButton />
            <a
              href="#inversion"
              className="pill btn-ghost px-7 py-3.5 font-mono text-[11px] tracking-[0.18em] uppercase"
            >
              How it works
            </a>
            {!launchConfig.isLive && (
              <span className="label max-w-[16rem] leading-relaxed">
                No contract deployed. Nothing on this page is buyable yet.
              </span>
            )}
          </div>
        </div>
      </div>

      <RuleTape />
    </section>
  );
}

/**
 * The rule, repeated, not the data. Every sibling project of this one has a
 * ticker tape carrying invented prices; this one carries the only thing that
 * is actually true before launch.
 */
function RuleTape() {
  const beats = [
    "Red day",
    "USDG to holders",
    "Green day",
    "Nothing",
    "Red day",
    "USDG to holders",
    "Green day",
    "Nothing",
  ];

  return (
    <div
      aria-hidden
      className="relative z-10 overflow-hidden border-y border-rule bg-ink/60 py-3 backdrop-blur-sm"
    >
      <div className="tape flex w-max gap-8">
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-8">
            {beats.map((beat, i) => (
              <span
                key={`${copy}-${i}`}
                className={`label whitespace-nowrap ${
                  i % 4 < 2 ? "text-red" : "text-ice"
                }`}
              >
                {beat}
                <span className="mx-8 text-bone-faint">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
