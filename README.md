# HEDGE

**The token that pays you when it goes wrong.**

A landing site for a Robinhood Chain token that pays its holders in USDG on
every day NVDA or the S&P 500 closes lower, and pays nothing on the days they
close higher. Crash insurance sold like a memecoin — the inverse of every
other token on the chain.

Nothing is deployed. This repo is the site, not the contracts.

```bash
npm install
npm run dev        # http://localhost:3300
```

---

## The mechanism, in four lines

1. Every trade of `$HEDGE` pays a fee, converted to USDG, into **the vault**.
2. After each US close an oracle posts the daily change of NVDA and of the
   S&P 500.
3. **Either one closed down** → the vault releases a share to holders,
   pro-rata by balance.
4. **Both closed up** → nothing is paid. The fees stay in the vault.

Green days fund red days. That is the whole product, and it is also its
limit: a payout can never exceed the fees already collected.

## What this site refuses to invent

Same discipline as the sibling projects in this account. Before launch:

- No price, no chart, no benchmark reading anywhere. There is no feed
  connected, so a number would be decoration pretending to be data.
- Every project stat is a zero or an em dash, never a plausible figure.
- Every contract address renders as `—` until the env var is set.
- Buy is disabled with the reason written on the button, not in a tooltip.
- The estimator's fields start empty and its result stays a dash; it names
  which inputs are missing instead of pre-filling a forecast.
- The one panel with live numbers (§04) reads Robinhood Chain from the
  visitor's own browser, and sits directly above the project's own zeros.
  The chain is real; the project is not live; the page shows both.

## The load-bearing premise, unverified

**That both closes can be read onchain, correctly, every day, by a feed
nobody has to trust.** This could not be checked from here, so §03 publishes
it as four unchecked conditions rather than asserting it:

1. An oracle contract is deployed and named.
2. Both closes are readable onchain. NVDA is straightforward; **the S&P 500
   is licensed IP of S&P Dow Jones Indices**, so this needs either a licensed
   feed or a tradable proxy read instead, said plainly on the page.
3. The calendar is defined — sessions, half days, holidays, and what happens
   when a trading halt leaves no clean close.
4. A no-post rule exists. An oracle that can silently skip a red day is a
   vault with a back door.

The first ticks itself once `NEXT_PUBLIC_HEDGE_ORACLE_ADDRESS` is set. The
other three are ticked by humans.

## Eight open decisions

Listed on the page in §06, not guessed at anywhere else:

| # | Decision | Why it is not decided here |
|---|---|---|
| 1 | Fee size, and which side it sits on | Too small, the vault never fills; too large, nobody trades, and the vault never fills |
| 2 | The payout curve | Flat share vs scaled to the fall. Scaling is truer to the pitch and easier to game with one bad print |
| 3 | Either / both / weighted | The site currently says *either*, the most generous reading — roughly one session in two is a red day for something |
| 4 | How the S&P 500 gets read | Licensed feed or tradable proxy. Quietly swapping one for the other is not an option |
| 5 | Push or claim | Pushing costs gas that scales with holder count; a claim window strands whoever does not show up |
| 6 | The snapshot | Balance at the close is trivially farmed — buy 15:59, collect, sell 09:31. Time-weighted fixes it and costs more |
| 7 | A vault floor | Whether the vault refuses to pay below a reserve, and who sets that number after launch |
| 8 | The regulatory read | A transferable token paying holders when a named equity falls has the shape of a derivative. Needs a lawyer, not a disclaimer |

## Two things written down here rather than moralised on the page

**This is not insurance.** Nobody underwrites it, no capital is reserved, and
there is no claim to make. The name is a joke about the marketing. The FAQ
answers this in question 1, before any flattering question.

**The failure mode is real and arrives at the worst moment.** A long grinding
drawdown is exactly when trading volume dies, so fees stop arriving at the
same time payouts trigger every session. The vault empties and red days stop
paying. §01 states this once and does not soften it.

## Art direction

"Storm chamber." Obsidian ground, bone type, and one saturated colour —
`#ff2e1f` — used **only for the paid state**. That inversion is the system:
everywhere else red means you lost money, here red is the day you get paid,
and the up-day colour (`--ice`, a cold grey-blue) is deliberately dull.

- Display: **Archivo** on its width axis, pushed wide (`wdth 104–125`), caps.
- Prose: **Geist**. Everything structural and numeric: **Geist Mono**.
- Loaded from a runtime `<link>`, not `next/font/google`, which downloads and
  self-hosts at *build* time and so needs outbound access from wherever
  `next build` runs.
- No raster asset ships with this site. The grain is an inline
  `feTurbulence`, the mark is vector, and the hero's environment map is a
  canvas painted at runtime.

### The hero (`src/components/Storm.tsx`)

A chromed arrow monolith falling through red rain, in three.js:

- The environment the chrome reflects is **painted in code** — a ceiling
  softbox, four cold vertical strips and a red horizon band, drawn into a
  1024×512 canvas and mapped equirectangularly. On a metal surface the
  reflection *is* the shading: an earlier build without the softbox rendered
  the arrow as a black silhouette with a hot rim.
- Rain is one `LineSegments` draw call; each streak's fall is computed in the
  vertex shader, so nothing touches the CPU after setup.
- `EffectComposer` → `RenderPass` → `UnrealBloomPass` → `OutputPass`.
- Three states: animated / one static frame under `prefers-reduced-motion` /
  a flat SVG mark with no WebGL. The flat mark is **server-rendered and left
  in place** until a real frame is ready to cover it, so the hero is never a
  black rectangle. It is hidden by the render loop via `el.hidden`, not by
  React state — the React Compiler lint Next 16 ships rejects `setState` in
  an effect body.
- The loop pauses when the canvas leaves the viewport or the tab is hidden.

## Traps hit while building this, all verified

- **Unlayered CSS beats every layered rule at equal specificity.** `.label`
  written outside a layer silently won against `text-red` and `text-ice`,
  which meant the site's one accent colour never fired on a single label.
  The component classes now live in `@layer components`, so Tailwind's
  `utilities` layer comes after and wins. Measured with `getComputedStyle`,
  not eyeballed.
- **A full-page vignette above the content dims the type.** The first version
  reached 55% black over the lower half at `z-60` and turned `#e9e6e0`
  headlines grey. The heavy falloff the 3D object needs is now a hero-local
  layer *under* the copy (`.hero-veil`); the global one only touches corners.
- **`@media (prefers-reduced-motion: no-preference) and (not print)` does not
  parse.** Turbopack fails the build on it. The print case is handled by a
  separate `@media print` block with `!important`.
- **Scroll reveal is 100% CSS** (`animation-timeline: view()`), never JS: a
  `<script>` rendered by React 19 does not execute, and an
  IntersectionObserver does not deliver in a page that is not being rendered.
- **Screenshots of this page are unreliable and DOM measurement is not.** The
  browser pane hides itself after the first capture and then returns a flat
  fill of the page background — which on a black site looks exactly like a
  page that failed to render. On top of that, the capture path evaluates
  `view()` timelines at progress 0, so any unrevealed section captures at
  opacity 0. Verify with `getBoundingClientRect` and `getComputedStyle`.

## Verified on 2026-09-03

- Robinhood Chain RPC answers from the browser: block height ~53.57M, gas
  ~1.11 gwei, `chainId` 4663. The §04 readout is genuinely live.
- Full wallet path against a stubbed EIP-1193 provider: connect → wrong
  network → switch → address chip.
- Contrast measured against every ground: red 5.05–5.46:1, ice 5.65–6.11:1,
  faint 5.19–5.22:1, dim 8.14–8.46:1. All pass AA for normal text.
- 375px with no horizontal overflow (`scrollWidth === 375`).
- `next build`, `eslint` and `tsc --noEmit` all clean.

## Naming

The whole brand is three strings at the top of `src/lib/site-config.ts`
(`name`, `wordmark`, `ticker`) plus the `NEXT_PUBLIC_HEDGE_*` env prefix.
Nothing else spells the name out, so a rename is those three strings and the
prefix — never a grep-and-replace through components. The name is marked
*placeholder* in that file on purpose.

## Stack

Next 16.3.3 (App Router, Turbopack) · React 19.2.8 · Tailwind 4 ·
three 0.185 · wagmi 3 / viem 2 (injected connector only) · TanStack Query.
No backend, no database, no analytics.
