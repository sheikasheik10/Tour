"use client";

import { useActionState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { subscribe } from "@/app/actions";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, null);

  if (state?.ok)
    return (
      <p className="mt-10 inline-flex items-center gap-3 rounded-full bg-paper/10 px-5 py-3 text-paper">
        <Check size={18} className="text-saffron" /> You&apos;re on the list. The first letter arrives next month.
      </p>
    );

  return (
    <form action={action} className="mt-10 max-w-md">
      <label className="flex items-center gap-2 rounded-full bg-paper/10 p-1.5 pl-5 ring-1 ring-paper/15 focus-within:ring-paper/50">
        <span className="sr-only">Email address</span>
        <input
          name="email"
          type="email"
          required
          placeholder="you@somewhere.com"
          className="min-w-0 flex-1 bg-transparent text-paper outline-none placeholder:text-paper/40"
        />
        <button className="btn btn-paper btn-sm" disabled={pending}>
          Subscribe <ArrowRight size={16} />
        </button>
      </label>
      {state?.error && <p className="mt-3 text-sm text-rose">{state.error}</p>}
    </form>
  );
}
