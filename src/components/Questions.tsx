import { Section } from "./ui/Section";
import { siteConfig } from "@/lib/site-config";

/**
 * The unflattering questions come first, on purpose. A reader who is going
 * to be talked out of this should be talked out of it in the first three
 * answers, not in the small print under the last one.
 */
const questions = [
  {
    q: "Is this insurance?",
    a: "No. Nobody underwrites it, no capital is reserved against your position, and there is no claim to make. It pays out of fees it already collected, and when those run out it pays nothing. Calling it crash insurance is marketing, and the name is a joke about the marketing.",
  },
  {
    q: "Is it a security or a derivative?",
    a: "That question has not been answered yet and this page will not pretend otherwise. A transferable token that pays holders when a named stock falls has the shape of a derivative in most places that regulate them. It is listed as an open item in §06 and it needs a lawyer, not a disclaimer.",
  },
  {
    q: "What happens when the vault is empty?",
    a: "Red days pay nothing. This is the failure mode, and it arrives at the worst possible moment: a long grinding drawdown is exactly when trading volume dies, so fees stop coming in at the same time payouts are triggered every session.",
  },
  {
    q: "What if the market just goes up for a year?",
    a: "You get paid on the down days inside that year, of which there will be plenty, and the token does nothing else for you. There is no yield, no staking and no buyback. On a straight line up this is a token that costs you a fee and hands back small amounts.",
  },
  {
    q: "So why hold it at all?",
    a: "Because the days it pays are the days everything else you own is losing. That correlation is the entire product. If you want something that goes up when the market goes up, almost every other token on this chain already does that better.",
  },
  {
    q: "Where does the USDG come from?",
    a: "Trading fees, converted to USDG, held in the vault. It is not minted, not borrowed and not deposited by a treasury. If nobody trades the token, nothing accumulates and nothing gets paid.",
  },
  {
    q: "Can the team drain the vault?",
    a: "That depends on contracts that are not written yet, so the only honest answer today is: read them when they exist. Ownership, upgradeability and any admin key will be published on this page before anything is buyable, and if they are not, that itself is the answer.",
  },
  {
    q: "What stops someone buying at the close and selling at the open?",
    a: "Nothing yet. The snapshot rule is one of the open items in §06 precisely because the obvious version — balance at the close — is trivially farmed, and the fix costs more to compute.",
  },
  {
    q: "Why NVDA and the S&P 500?",
    a: "One concentrated position and one broad market, because those are the two ways a portfolio goes wrong. A single name can fall on its own news; the index only falls when everything does.",
  },
  {
    q: "Will the token price go up?",
    a: "No idea, and anyone who tells you otherwise is guessing at best. The mechanism described on this page is about distributions, not price. The token can pay every red day for a year and still be worth less than you paid for it.",
  },
];

export function Questions() {
  return (
    <Section
      id="questions"
      num="07"
      title="Questions"
      lede="Starting with the ones that argue against buying."
    >
      <div className="grid gap-px overflow-hidden rounded-[3px] bg-rule">
        {questions.map((item) => (
          <details key={item.q} className="group bg-ink-2">
            <summary className="flex cursor-pointer list-none items-baseline gap-4 p-6 text-[14px] font-medium text-bone marker:content-none hover:text-red">
              <span
                aria-hidden
                className="num shrink-0 text-[11px] text-ice transition-transform group-open:text-red"
              >
                +
              </span>
              {item.q}
            </summary>
            <p className="px-6 pb-6 pl-16 text-[13px] leading-relaxed text-bone-dim">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <div className="plate mt-4 p-6 sm:p-8">
        <span className="label text-red">Read this one twice</span>
        <p className="mt-4 text-[13px] leading-relaxed text-bone-dim">
          {siteConfig.notInsuranceNotice}
        </p>
      </div>
    </Section>
  );
}
