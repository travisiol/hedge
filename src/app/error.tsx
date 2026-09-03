"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="label text-red">Error</p>
      <h1 className="display max-w-lg text-[2rem] leading-[0.95] sm:text-[2.75rem]">
        Something broke on the way down
      </h1>
      <p className="max-w-md text-[14px] leading-relaxed text-bone-dim">
        This page failed to render. Nothing was bought, sold or signed — there
        is nothing here that can be.
      </p>
      <button
        type="button"
        onClick={reset}
        className="pill btn-red px-7 py-3.5 font-mono text-[11px] tracking-[0.18em] uppercase"
      >
        Try again
      </button>
    </main>
  );
}
