import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Users, Store, ArrowRight } from "lucide-react";
import { api } from "../api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

type Role = 'customer' | 'owner';

const roles = [
    { value: 'customer' as Role, title: 'Customer', desc: 'Book services from trusted providers', icon: Users },
  { value: 'owner' as Role, title: 'Business Owner', desc: 'Offer your services and get bookings', icon: Store },
];

export default function Register(){

    const [role,setRole] = useState<Role>('customer');
    const [name,setName] = useState('');
    const [email,setEmail]= useState('');
    const [password,setPassword] = useState('');
    const [error,setError]= useState('');
    const [loading,setLoading]=useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            await api('/auth/register',{
                method:'POST',
                body: JSON.stringify({ name, email, password, role }),
            });
            navigate('/check-email', { state: { email } });
        }
        catch(err){
            setError((err as Error).message);
        }
        finally{
            setLoading(false);
        }
    }

    return(
       <div className="flex min-h-screen bg-surface">

        <section className="hidden flex-1 flex-col justify-center px-16 lg:flex">
             <h1 className="max-w-md text-5xl font-bold leading-tight text-navy">
                Create Your Account
            </h1>
            <p className="mt-4 max-w-sm text-slate-600">
              Join our platform and get started today.
            </p>
        </section>

        <section className="flex flex-1 items-center justify-center p-6">
            <form onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-lg">

            <div>
            <h2 className="text-2xl font-bold text-navy">Choose Your Role</h2>
            <p className="text-sm text-slate-500">Select how you'd like to use our platform</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {roles.map(({ value, title, desc, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                aria-pressed={role === value}
                className={`rounded-xl border-2 p-4 text-center transition ${
                  role === value ? 'border-brand bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className="mx-auto mb-2 text-brand" size={24} />
                <p className="text-sm font-semibold text-navy">{title}</p>
                <p className="mt-1 text-xs text-slate-500">{desc}</p>
              </button>
            ))}
          </div>

          <Input label="Full Name" name="name" placeholder="Enter your full name"
            value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" name="email" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" name="password" type="password" placeholder="Create a password"
            value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" loading={loading}>
            <span className="inline-flex items-center justify-center gap-2">
              Create Account <ArrowRight size={16} />
            </span>
          </Button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand hover:underline">Sign in</Link>
          </p>

          </form>
        </section>

       </div>
    );
}