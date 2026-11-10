"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/actions";

export function AdminLogin() {
  const [state, action, pending] = useActionState(adminLogin, null);
  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="field">
        <span>Admin key</span>
        <input name="key" type="password" className="input" required autoComplete="current-password" />
      </label>
      {state?.error && <p className="text-sm text-clay">{state.error}</p>}
      <button className="btn h-12 w-full" disabled={pending}>
        Enter
      </button>
    </form>
  );
}
