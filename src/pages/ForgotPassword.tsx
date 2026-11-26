import { use, useState } from "react";
import { Link } from "react-router-dom";
import { Lock,ArrowRight,MailCheck } from "lucide-react";
import { api } from "../api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function ForgotPassword(){

    const [email,setEmail] = useState('');
    const [loading,setLoading]= useState(false);
    const [sent,setSent] = useState(false);
    const [error,setError]=useState('');

    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try{
             await api('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
         });
            setSent(true);
        }
        catch(err){
            setError((err as Error).message);
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-brand">
            {sent ? <MailCheck size={36} /> : <Lock size={36} />}
          </div>
          <h1 className="text-3xl font-bold text-navy">
            {sent ? 'Check Your Email' : 'Forgot Password?'}
          </h1>
          <p className="mt-2 text-slate-600">
            {sent
              ? 'If an account with that email exists, a reset link is on its way. The link expires in 1 hour.'
              : "No worries! Enter your email address and we'll send you a reset link."}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {sent ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-slate-500">
                Didn't get it? Check your spam folder, or try again in a minute.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-sm font-medium text-brand hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" loading={loading}>
                <span className="inline-flex items-center justify-center gap-2">
                  Send Reset Link <ArrowRight size={16} />
                </span>
              </Button>
            </form>
          )}

          <div className="mt-5 text-center">
            <Link to="/login" className="text-sm font-medium text-brand hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
    )
}