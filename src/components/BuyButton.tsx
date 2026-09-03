import { clsx } from "clsx";
import { launchConfig } from "@/lib/site-config";

/**
 * Disabled until a token address, a vault address and the live flag are all
 * set, and the reason is written on the button rather than in a tooltip.
 * A Buy button that looks enabled before there is anything to buy is the
 * single most expensive lie a pre-launch token site can tell.
 */
export function BuyButton({
  className,
  size = "lg",
}: {
  className?: string;
  size?: "sm" | "lg";
}) {
  const ready = launchConfig.isLive && launchConfig.buyUrl !== null;

  const shape = clsx(
    "pill inline-flex items-center justify-center font-mono uppercase tracking-[0.18em]",
    size === "lg" ? "px-7 py-3.5 text-[11px]" : "px-5 py-2.5 text-[10px]",
    className,
  );

  if (!ready) {
    return (
      <button type="button" disabled className={clsx(shape, "btn-red")}>
        Not launched yet
      </button>
    );
  }

  return (
    <a
      href={launchConfig.buyUrl ?? "#"}
      target="_blank"
      rel="noreferrer noopener"
      className={clsx(shape, "btn-red")}
    >
      Buy {"→"}
    </a>
  );
}
