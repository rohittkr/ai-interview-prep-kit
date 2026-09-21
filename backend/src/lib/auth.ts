import jwt from 'jsonwebtoken';
export function signUser(id:string){return jwt.sign({id},process.env.JWT_SECRET||'dev-secret',{expiresIn:'7d'})}
export function verifyUser(token:string){return jwt.verify(token,process.env.JWT_SECRET||'dev-secret') as {id:string}}
