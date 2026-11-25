const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
    status: number;
    code? : string;
    constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function getToken(){
    return localStorage.getItem('token') ?? sessionStorage.getItem('token') ?? '';
}

export function setToken(token:string | null, remember= true){
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    if(token){
        (remember? localStorage : sessionStorage).setItem('token',token);
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
        throw new ApiError(msg ?? `Request failed (${res.status})`, res.status, data?.code);
    }
    return data as T;
}

export function getUser(): { sub: number; role: 'owner' | 'customer' } | null {

  const token = getToken();
  if (!token) return null;

  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if(payload.exp && payload.exp * 1000 < Date.now())
    {
        setToken(null);
        return null;
    }
    return payload;
  } catch {
    return null;
  }

}