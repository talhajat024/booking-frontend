import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Briefcase,
  Palette,
  Heart,
  Home,
  Ellipsis,
  ArrowRight,
} from "lucide-react";
import { api, setToken, ApiError } from "../api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const navigate = useNavigate();

  const categories = [
    { label: "Professional Services", icon: Briefcase },
    { label: "Creative Services", icon: Palette },
    { label: "Health & Wellness", icon: Heart },
    { label: "Home Services", icon: Home },
    { label: "And more...", icon: Ellipsis },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setResendMsg("");

    try {
      const res = await api<{ access_token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, rememberMe }),
      });
      setToken(res.access_token, rememberMe);
      navigate("/");
    } catch (err) {
      if (err instanceof ApiError && err.code === "EMAIL_NOT_VERIFIED") {
        setUnverified(true);
      } else {
        setError((err as Error).message);
      }
    }
  }

  async function handleResend() {
    setResending(true);
    setResendMsg("");
    try {
      const res = await api<{ message: string }>("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setResendMsg(res.message);
    } catch (err) {
      setResendMsg((err as Error).message);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <section className="hidden flex-1 flex-col justify-center px-16 lg:flex">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-teal text-white">
          <CalendarDays size={28} />
        </div>

        <h1 className="max-w-md text-5xl font-bold leading-tight text-navy">
          One place to book and offer services
        </h1>

        <p className="mt-4 max-w-sm text-slate-600">
          Discover trusted businesses or grow your service business with ease.
        </p>

        <div className="mt-10 flex gap-6">
          {categories.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex w-20 flex-col items-center gap-2 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                <Icon size={22} />
              </div>
              <span className="text-xs text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sign in Card */}
      <section className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-lg"
        >
          <div>
            <h2 className="text-2xl font-bold text-navy">Welcome Back!</h2>
            <p className="text-sm text-slate-500">
              Sign in to your account to continue
            </p>
          </div>
          <Input
            label="Email address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-brand"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="font-medium text-brand hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {unverified && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
              <p className="font-medium text-navy">
                Please verify your email before logging in.
              </p>
              <p className="mt-1 text-slate-600">
                Check your inbox and spam folder for the link.
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-2 font-medium text-brand hover:underline disabled:opacity-60"
              >
                {resending ? "Sending…" : "Resend verification email"}
              </button>
              {resendMsg && (
                <p className="mt-2 text-xs text-slate-600">{resendMsg}</p>
              )}
            </div>
          )}

          <Button type="submit">
            <span className="inline-flex items-center justify-center gap-2">
              Sign in <ArrowRight size={16} />
            </span>
          </Button>
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brand hover:underline"
            >
              Create account
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
