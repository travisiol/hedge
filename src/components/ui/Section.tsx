import type { ReactNode } from "react";
import { clsx } from "clsx";

/**
 * Every section carries its number in the margin. The numbers are the only
 * navigation aid on a page this long, and they match `src/lib/nav.ts`.
 */
export function Section({
  id,
  num,
  title,
  lede,
  children,
  className,
}: {
  id: string;
  num: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={clsx(
        "reveal scroll-mt-20 border-t border-rule px-5 py-20 sm:px-8 md:py-28",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 grid gap-6 md:grid-cols-[7rem_1fr] md:gap-8">
          <span className="label pt-2 text-red">[{num}]</span>
          <div className="max-w-3xl">
            <h2 className="display text-[2rem] leading-[0.95] sm:text-[2.75rem] md:text-[3.5rem]">
              {title}
            </h2>
            {lede && (
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-bone-dim">
                {lede}
              </p>
            )}
          </div>
        </header>
        <div className="md:grid md:grid-cols-[7rem_1fr] md:gap-8">
          <div aria-hidden />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

/** A small caps label with a hairline under it. Used inside panels. */
export function Eyebrow({
  children,
  tone = "bone",
}: {
  children: ReactNode;
  tone?: "bone" | "red" | "ice";
}) {
  return (
    <span
      className={clsx(
        "label block",
        tone === "red" && "text-red",
        tone === "ice" && "text-ice",
      )}
    >
      {children}
    </span>
  );
}
