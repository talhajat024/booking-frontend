import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api,setToken } from "../api";

export default function Login(){
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await api<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.access_token);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return(
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-3">
      <h1 className="text-2xl font-bold">Log in</h1>
      <input
        className="w-full border p-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-600">{error}</p>}
      <button className="w-full bg-blue-600 text-white p-2 rounded">Log in</button>
    </form>
  )
}