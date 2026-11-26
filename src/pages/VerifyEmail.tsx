import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, X, Loader2, ArrowRight } from "lucide-react";
import { api } from "../api";

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
    
  const [params] = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : "This link is missing its token.",
  );
  const called = useRef(false);

  useEffect(() => {
    if (!token || called.current) return;
    called.current = true; // the token is single-use, so send the request only once

    api("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setMessage((err as Error).message);
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <Loader2
              className="mx-auto mb-5 animate-spin text-brand"
              size={48}
            />
            <h1 className="text-2xl font-bold text-navy">
              Verifying your email…
            </h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white">
              <Check size={40} />
            </div>
            <h1 className="text-3xl font-bold text-navy">Email Verified!</h1>
            <p className="mt-3 text-slate-600">
              Your email has been successfully verified. You can now sign in to
              your account.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              Go to Login <ArrowRight size={16} />
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
              <X size={40} />
            </div>
            <h1 className="text-3xl font-bold text-navy">Link not valid</h1>
            <p className="mt-3 text-slate-600">{message}</p>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to request a new verification email.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              Go to Login <ArrowRight size={16} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
