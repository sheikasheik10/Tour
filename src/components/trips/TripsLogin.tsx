"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { openTrips } from "@/app/actions";

export function TripsLogin() {
  const [state, action, pending] = useActionState(openTrips, null);
  const [v, setV] = useState({ email: "", ref: "" });
  return (
    <form action={action} className="space-y-4">
      <label className="field">
        <span>Email used to book</span>
        <input name="email" type="email" className="input" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} required autoComplete="email" />
        {state?.fieldErrors?.email && <em className="text-xs not-italic text-clay">{state.fieldErrors.email}</em>}
      </label>
      <label className="field">
        <span>Any booking reference</span>
        <input name="ref" className="input font-mono uppercase" placeholder="SRD-XXXXXX" value={v.ref} onChange={(e) => setV({ ...v, ref: e.target.value })} required />
        {state?.fieldErrors?.ref && <em className="text-xs not-italic text-clay">{state.fieldErrors.ref}</em>}
      </label>
      {state?.error && <p className="rounded-xl bg-clay/10 p-3 text-sm text-clay-2">{state.error}</p>}
      <button className="btn btn-clay h-14 w-full" disabled={pending}>
        {pending ? <Loader2 size={18} className="animate-spin" /> : null}
        Open my trips <ArrowRight size={18} />
      </button>
    </form>
  );
}
