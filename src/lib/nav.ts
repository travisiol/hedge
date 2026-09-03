/**
 * Shared by the client Navbar and the server Footer, so it lives here with
 * no "use client" directive on the module.
 *
 * Exporting this array from a "use client" component and importing it into a
 * server component turns it into a client *reference* — a proxy, not an
 * array — and the prerender dies on `.map is not a function`. Data that
 * crosses that boundary belongs in a plain module.
 */
export const navLinks = [
  { id: "inversion", num: "01", label: "The inversion" },
  { id: "vault", num: "02", label: "The vault" },
  { id: "triggers", num: "03", label: "Triggers" },
  { id: "chain", num: "04", label: "Chain" },
  { id: "estimate", num: "05", label: "Estimate" },
  { id: "undecided", num: "06", label: "Undecided" },
  { id: "questions", num: "07", label: "Questions" },
] as const;
