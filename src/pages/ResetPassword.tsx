import { useState } from "react";
import { Link,useNavigate,useSearchParams } from "react-router-dom";
import { ShieldCheck,ArrowRight } from "lucide-react";
import { api } from "../api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function ResetPassword(){

    const [params] = useSearchParams();
    const token = params.get('token');
    const navigate = useNavigate();

    const [password,setPassword]= useState('');
    const [confirm,setConfirm] = useState('');
    const [error,setError]= useState('');
    const [loading,setLoading]= useState(false);
    const [done,setDone] = useState(false);

    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault();
        setError('');

        if(password != confirm){
            setError('Password do not match');
            return;
        }

        setLoading(true);
        try{
            await api('/auth/reset-password',{
                method:'POST',
                body: JSON.stringify({ token, newPassword: password }),
            });
            setDone(true);
            setTimeout(() => {
                navigate('/login',{replace:true})
            }, 2500);
        }
        catch(err){
            setError((err as Error).message);
        }
        finally{
            setLoading(false);
        }
    }

    if(!token){
        return(
            <div className="flex min-h-screen items-center justify-center bg-surface p-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-navy">Link not valid</h1>
          <p className="mt-3 text-slate-600">This reset link is missing its token.</p>
          <Link to="/forgot-password" className="mt-6 inline-block text-sm font-medium text-brand hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
        );
    }

    return(
        <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-brand">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-3xl font-bold text-navy">
            {done ? 'Password Updated' : 'Reset Your Password'}
          </h1>
          <p className="mt-2 text-slate-600">
            {done ? 'Taking you to the login page…' : 'Enter your new password below.'}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {done ? (
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              Go to Login <ArrowRight size={16} />
            </Link>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="Create new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8}
                required
              />
              {error && (
                <p className="text-sm text-red-600">
                  {error}
                  {error.toLowerCase().includes('expired') && (
                    <>
                      {' '}
                      <Link to="/forgot-password" className="font-medium underline">
                        Request a new link
                      </Link>
                    </>
                  )}
                </p>
              )}
              <Button type="submit" loading={loading}>
                <span className="inline-flex items-center justify-center gap-2">
                  Reset Password <ArrowRight size={16} />
                </span>
              </Button>
            </form>
          )}

          {!done && (
            <div className="mt-5 text-center">
              <Link to="/login" className="text-sm font-medium text-brand hover:underline">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
    );
}