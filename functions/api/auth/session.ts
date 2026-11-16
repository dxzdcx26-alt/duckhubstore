type Env = { DB: D1Database; DH_SESSION_SECRET?: string };

type UserRow = { id:string; username:string; email:string|null; role:string; balance:number; points:number; total_spent:number; spin_count:number; created_at:string; photo_url:string|null; last_daily_claim:number|null; daily_streak:number; password_hash:string|null };
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':'*'}});
async function sha256(value:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');}
function b64(v:string){return btoa(v).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
async function token(user:UserRow,secret:string){const now=Math.floor(Date.now()/1000);const payload=b64(JSON.stringify({sub:user.id,username:user.username,role:user.role,iat:now,exp:now+604800}));const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(payload));return `${payload}.${b64(String.fromCharCode(...new Uint8Array(sig)))}`;} 
export const onRequest=async({request,env}:{request:Request;env:Env})=>{
 if(request.method==='OPTIONS')return json(null,204);
 if(request.method!=='POST')return json({message:'Method Not Allowed'},405);
 try{const input=await request.json().catch(()=>({})) as {username?:string;email?:string;password?:string};const login=String(input.username||input.email||'').trim();const password=String(input.password||'');if(!login||!password)return json({message:'กรุณากรอกอีเมล/ชื่อผู้ใช้และรหัสผ่าน'},400);
 const row=await env.DB.prepare('SELECT * FROM users WHERE username=? OR email=? LIMIT 1').bind(login,login).first<UserRow>();const hash=await sha256(password+'dh-salt-2026');if(!row||!row.password_hash||row.password_hash!==hash)return json({message:'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง'},401);
 const {password_hash,...safe}=row;const secret=env.DH_SESSION_SECRET||crypto.randomUUID();const t=await token(row,secret);await env.DB.prepare('INSERT INTO sessions(id,user_id,expires_at,created_at) VALUES(?,?,?,?)').bind(crypto.randomUUID(),row.id,Math.floor(Date.now()/1000)+604800,Math.floor(Date.now()/1000)).run();return json({user:safe,token:t,expiresAt:Math.floor(Date.now()/1000)+604800});
 }catch(e){console.error(e);return json({message:'ไม่สามารถตรวจสอบการเข้าสู่ระบบได้'},500);}
};
