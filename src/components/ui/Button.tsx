import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {loading?: boolean};

export function Button({loading,children,className = '',disabled, ...rest}:Props){
    return(
        <button
        disabled={disabled || loading}
        className={`w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60 ${className}`}>
            {loading ? 'Please wait…' : children}
        </button>
    );
}

