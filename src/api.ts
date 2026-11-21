const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function getToken(){
    return localStorage.getItem('token') ?? '';
}

export function setToken(token:string | null){
    if(token){
        localStorage.setItem('token', token);
    }
    else
    {
        localStorage.removeItem('token');
    }
}


export async function api<T>(path:string, options:RequestInit= {}):Promise<T>{
    const token= getToken();
    const res = await fetch(`${API_URL}${path}`,{
        ...options,
        headers:{
            'Content-Type':'application/json',
            ...(token ? {'Authorization': `Bearer ${token}`} : {}),
            ...options.headers
        },
    });

    const data = await res.json().catch(()=> null);

    if(!res.ok){
        const msg= Array.isArray(data?.message) ? data.message.join(', '): data?.message;
        throw new Error(msg ?? 'Request Failed (${res.status})');
    }
    return data as T;
}

export function getUser(): { sub: number; role: 'owner' | 'customer' } | null {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}