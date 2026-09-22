import 'dotenv/config';import express from 'express';import cors from 'cors';import {connectDb} from './lib/db';import {router} from './services/http';
const app=express();
app.use(cors({origin:process.env.FRONTEND_URL}));
app.use(express.json({limit:"2mb"}));
app.get("/health",(_,res)=>res.json({ok:true}));
app.use("/api",router);
connectDb().then(()=>app.listen(Number(process.env.PORT||5000),"0.0.0.0",()=>console.log("API on " + (process.env.PORT||5000)))).catch(e=>{console.error(e);process.exit(1);});
