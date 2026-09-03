"use client";

import { useConnect, useConnection, useDisconnect, useSwitchChain } from "wagmi";
import { clsx } from "clsx";
import { robinhoodChain } from "@/lib/chain";

function short(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/**
 * Injected connector only — no WalletConnect project id, no wallet library.
 * wagmi's `ssr: true` keeps the server render and the first client render
 * both "disconnected", so no hydration gate is needed here.
 *
 * Connecting proves nothing and unlocks nothing yet: there is no vault to
 * read. It exists so the network path is real and testable before launch
 * rather than written on launch day.
 */
export function WalletConnect({ className }: { className?: string }) {
  const { address, isConnected, chainId } = useConnection();
  const {
    connect,
    connectors,
    isPending: isConnecting,
    error: connectError,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { mutate: switchChain, isPending: isSwitching } = useSwitchChain();

  const wrongNetwork = isConnected && chainId !== robinhoodChain.id;

  if (isConnected && address) {
    if (wrongNetwork) {
      return (
        <button
          type="button"
          onClick={() => switchChain({ chainId: robinhoodChain.id })}
          disabled={isSwitching}
          className={clsx(
            "pill label border border-red/45 bg-red-soft px-3.5 py-2 text-red transition hover:bg-red/15 disabled:opacity-60",
            className,
          )}
        >
          {isSwitching ? "Switching…" : "Wrong network"}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => disconnect()}
        title="Disconnect wallet"
        className={clsx(
          "pill label flex items-center gap-2 border border-rule-2 px-3.5 py-2 text-bone transition hover:border-red/50 hover:text-red",
          className,
        )}
      >
        <span aria-hidden className="live-dot h-1 w-1 rounded-full bg-red" />
        {/* normal-case: an address must keep its EIP-55 casing */}
        <span className="num text-[10px] normal-case">{short(address)}</span>
      </button>
    );
  }

  const injectedConnector = connectors[0];

  return (
    <div className={clsx("flex flex-col items-end gap-1", className)}>
      <button
        type="button"
        disabled={!injectedConnector || isConnecting}
        onClick={() =>
          injectedConnector && connect({ connector: injectedConnector })
        }
        className="pill label border border-rule-2 px-3.5 py-2 text-bone transition hover:border-red/50 hover:text-red disabled:cursor-not-allowed disabled:border-rule disabled:text-bone-faint"
      >
        {isConnecting
          ? "Connecting…"
          : injectedConnector
            ? "Connect wallet"
            : "No wallet found"}
      </button>
      {connectError && (
        <span className="max-w-[220px] text-right text-[10px] leading-tight text-red">
          {connectError.message}
        </span>
      )}
    </div>
  );
}
