"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { siteConfig } from "@/lib/site-config";
import { navLinks } from "@/lib/nav";
import { WalletConnect } from "./WalletConnect";

/**
 * Section highlighting runs on a throttled timer rather than an
 * IntersectionObserver.
 *
 * IntersectionObserver never delivers in a page that is not being rendered
 * (a hidden tab, an off-screen pane), and a root flattened to zero height by
 * negative margins never fires at all. A timer reading
 * `getBoundingClientRect` is boring and correct.
 */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;

    const measure = () => {
      ticking = false;
      // The line the reader's eye sits on, a third down the viewport.
      const line = window.innerHeight * 0.34;
      let current: string | null = null;
      for (const link of navLinks) {
        const element = document.getElementById(link.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= line) current = link.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.setTimeout(measure, 120);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return active;
}

export function Navbar() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-rule bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8">
        <a
          href="#top"
          className="display text-[15px] tracking-[0.02em]"
          style={{ fontVariationSettings: '"wdth" 122' }}
        >
          {siteConfig.name}
        </a>
        <span className="label hidden text-red sm:block">{siteConfig.ticker}</span>

        <nav className="ml-auto hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? "true" : undefined}
              className={clsx(
                "label transition-colors hover:text-bone",
                active === link.id ? "text-red" : "text-bone-faint",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <WalletConnect />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu"
            className="pill label border border-rule-2 px-3 py-2 text-bone lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu"
          className="border-t border-rule bg-ink/95 px-5 py-4 backdrop-blur-xl sm:px-8 lg:hidden"
        >
          <ul className="grid gap-3">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="label flex items-center gap-3 text-bone-dim"
                >
                  <span className="text-red">[{link.num}]</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
