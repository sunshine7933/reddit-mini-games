import express from 'express';
import {cleanSave} from '../engine.js';
export function createApp({reddit,redis,getUserId}){
 const app=express();app.use(express.json({limit:'12kb'}));
 app.get('/api/granny/progress',async(_req,res)=>{try{const id=getUserId();if(!id)return res.json({enabled:false});const raw=await redis.get(`granny:v1:${id}`);res.json({enabled:true,save:raw?cleanSave(JSON.parse(raw)):null});}catch{res.status(503).json({error:'Progress sync unavailable'});}});
 app.put('/api/granny/progress',async(req,res)=>{try{const id=getUserId();if(!id)return res.status(401).json({error:'Sign in to sync progress'});if(req.body?.version!==1||!Array.isArray(req.body.best))return res.status(400).json({error:'Invalid save'});await redis.set(`granny:v1:${id}`,JSON.stringify(cleanSave(req.body)));res.json({ok:true});}catch{res.status(503).json({error:'Progress sync unavailable'});}});
 app.post('/internal/menu/create-post',async(_req,res)=>{try{const post=await reddit.submitCustomPost({title:'Granny Gone Wild: Mall Mayhem! 🛒 Five floors. Zero chill.',entry:'default',textFallback:{text:'A shopping-cart action platformer from Sunshine’s Mini-Games. Jump, duck and boost through five mall levels, collect coupons and face the manager. Keyboard and touch controls. Tap Play to open.'}});res.json({navigateTo:post.url});}catch{res.status(500).json({showToast:'Could not create the game post. Please try again.'});}});
 return app;
}
