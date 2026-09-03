import { Section } from "./ui/Section";
import { ChainReadout } from "./ChainReadout";
import { launchConfig, explorer } from "@/lib/site-config";

function AddressRow({
  label,
  address,
  note,
}: {
  label: string;
  address: string | null;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-1 bg-ink-2 p-5 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="label sm:w-40 sm:shrink-0">{label}</span>
      <div className="min-w-0">
        <p className="num text-[13px] break-all text-bone-dim">
          {address ? (
            <a
              className="hover:text-red"
              href={explorer.address(address)}
              target="_blank"
              rel="noreferrer noopener"
            >
              {address}
            </a>
          ) : (
            "—"
          )}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-bone-faint">
          {note}
        </p>
      </div>
    </div>
  );
}

export function ChainSection() {
  const { tokenAddress, vaultAddress, oracleAddress, usdgAddress, isLive } =
    launchConfig;

  return (
    <Section
      id="chain"
      num="04"
      title="What is actually live"
      lede={
        <>
          The panel below is real: your browser is talking to Robinhood Chain
          as you read this. Everything underneath it is a dash, because none of
          it has been deployed. Both facts belong on the same screen.
        </>
      }
    >
      <ChainReadout />

      <div className="mt-4 grid gap-px overflow-hidden rounded-[3px] bg-rule">
        <AddressRow
          label="Token"
          address={tokenAddress}
          note="The ERC-20 you would hold."
        />
        <AddressRow
          label="Vault"
          address={vaultAddress}
          note="Holds the USDG between distributions."
        />
        <AddressRow
          label="Oracle"
          address={oracleAddress}
          note="Posts the daily close of each benchmark. See §03."
        />
        <AddressRow
          label="USDG"
          address={usdgAddress}
          note="The stablecoin holders are paid in. Verify this one against Paxos yourself — a wrong token address pays out something that is not a dollar."
        />
      </div>

      <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-bone-faint">
        {isLive
          ? "Contracts are deployed. Read them before you buy anything."
          : "Nothing is deployed. No presale, no allowlist, no private round — if you are being offered one of those in this project's name, it is not this project."}
      </p>
    </Section>
  );
}
