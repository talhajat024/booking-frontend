import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, type, ...rest }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? rest.name;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-navy"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && show ? "text" : type}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${
            isPassword ? "pr-10" : ""
          } ${error ? "border-red-500" : "border-slate-300"}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-navy"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
