const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api';
export function token(){return typeof window==='undefined'?'':localStorage.getItem('token')||''}
export async function api(path:string,opts:any={}){const r=await fetch(`${API}${path}`,{...opts,headers:{'content-type':'application/json',...(opts.headers||{}),...(token()?{Authorization:`Bearer ${token()}`}:{})}});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Request failed');return j}
