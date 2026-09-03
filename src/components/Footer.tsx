import { siteConfig, launchConfig } from "@/lib/site-config";
import { navLinks } from "@/lib/nav";
import { BuyButton } from "./BuyButton";

export function Footer() {
  return (
    <footer className="border-t border-rule px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <p
              className="display text-[2.5rem] leading-[0.9] sm:text-[3.5rem]"
              style={{ fontVariationSettings: '"wdth" 120' }}
            >
              {siteConfig.name}
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-bone-dim">
              {siteConfig.tagline.toLowerCase().replace(/\.$/, "")} — in USDG,
              on the days NVDA or the S&amp;P 500 close lower, out of fees
              collected on the days they didn&apos;t.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <BuyButton size="sm" />
              <a
                href={siteConfig.x}
                target="_blank"
                rel="noreferrer noopener"
                className="pill btn-ghost px-5 py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase"
              >
                X
              </a>
            </div>
          </div>

          <nav aria-label="Sections">
            <ul className="grid gap-2.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="label flex items-center gap-3 transition-colors hover:text-red"
                  >
                    <span className="text-ice">[{link.num}]</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* The "not insurance" notice is not repeated here: §07 closes on it,
            and on a tall viewport both would land on screen at once, which
            reads as boilerplate rather than as a warning. */}
        <div className="mt-14 grid gap-5 border-t border-rule pt-8 text-[11px] leading-relaxed text-bone-faint md:grid-cols-2">
          <p>{siteConfig.affiliationNotice}</p>
          <p>
            Nothing on this page is financial advice or an offer of anything.
            {!launchConfig.isLive &&
              " No contract is deployed, so there is currently nothing to buy — treat any token, sale or allowlist using this name as fraudulent."}
          </p>
        </div>
      </div>
    </footer>
  );
}
