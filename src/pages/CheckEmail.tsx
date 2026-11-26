import { useEffect,useState } from "react";
import { Link,Navigate, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import { api } from "../api";

export default function CheckEmail(){

    const location = useLocation();
    const email = (location.state as {email?:string} | null)?.email;

    const [cooldown,setCooldown] = useState(60);
    const [resending,setResending] = useState(false);
    const [msg,setMsg] = useState('');

    // count down once per second while cooldown > 0
    useEffect(()=>{
        if(cooldown <= 0) return;
        const t = setTimeout(() => {
            setCooldown((c)=> c-1);
        }, 1000);
        return ()=> clearTimeout(t);
    },[cooldown])

    if(!email) return <Navigate to='/login' replace />

    async function handleResend() {
        setResending(true);
        setMsg('');
        try{
            const res = await api<{ message: string }>('/auth/resend-verification', {
              method: 'POST',
              body: JSON.stringify({ email }),
            });
            setMsg(res.message);
            setCooldown(60);
        }
        catch(err){
            setMsg((err as Error).message);
        }
        finally{
            setResending(false);
        }
    }

    return (
         <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-brand">
          <Mail size={36} />
        </div>
        <h1 className="text-3xl font-bold text-navy">Check Your Email</h1>
        <p className="mt-3 text-slate-600">We've sent a verification link to</p>
        <p className="font-semibold text-navy">{email}</p>
        <p className="mt-3 text-sm text-slate-500">
          Click the link in your email to verify your account and start booking services.
        </p>

        <div className="mt-6 flex items-center justify-between rounded-lg bg-blue-50 p-4 text-left">
          <div>
            <p className="text-sm font-medium text-navy">Didn't receive the email?</p>
            <p className="text-xs text-slate-500">
              {cooldown > 0
                ? `Check your spam folder or try again in ${cooldown} seconds.`
                : 'Check your spam folder or send a new link.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="text-sm font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
          >
            {resending ? 'Sending…' : 'Resend Email'}
          </button>
        </div>

        {msg && <p className="mt-3 text-xs text-slate-600">{msg}</p>}

        <Link to="/login" className="mt-6 inline-block text-sm font-medium text-brand hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
    )
}
