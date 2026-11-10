"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { cancelBooking } from "@/app/actions";

function Confirm() {
  const { pending } = useFormStatus();
  return (
    <button className="rounded-full bg-clay px-3 py-1.5 text-xs font-semibold text-paper disabled:opacity-60" disabled={pending}>
      {pending ? "Cancelling…" : "Yes, cancel"}
    </button>
  );
}

/** Two-step cancel so a stray click can't drop a booking. */
export function CancelButton({ refCode }: { refCode: string }) {
  const [ask, setAsk] = useState(false);
  if (!ask)
    return (
      <button type="button" onClick={() => setAsk(true)} className="text-sm text-ink-soft underline-offset-4 hover:text-clay hover:underline">
        Cancel
      </button>
    );
  return (
    <form action={cancelBooking} className="flex items-center gap-2">
      <input type="hidden" name="ref" value={refCode} />
      <span className="text-xs text-ink-soft">Sure?</span>
      <Confirm />
      <button type="button" onClick={() => setAsk(false)} className="text-xs text-ink-soft hover:text-ink">
        Keep it
      </button>
    </form>
  );
}
