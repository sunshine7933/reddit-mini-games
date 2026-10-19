export const LEVELS = [
  {name:'Parking Lot Escape',tag:'01 / OUT OF PARKING, OUT OF PATIENCE',color:'#498a91',sky:'#bce1dc',hazard:'cone',tip:'Jump cones. Duck under barriers. Boost through crates.',length:3900,par:42},
  {name:'Food Court Frenzy',tag:'02 / FAST FOOD. FASTER GRANNY.',color:'#bc674b',sky:'#f8d3ac',hazard:'spill',tip:'Slippery spills hurt! Ride the tables for extra coupons.',length:4200,par:45},
  {name:'Toy Store Trouble',tag:'03 / BATTERIES INCLUDED. CHAOS TOO.',color:'#8366ac',sky:'#e0d4f5',hazard:'robot',tip:'Toy robots patrol. Time your jumps or boost them away.',length:4500,par:48},
  {name:'Fashion Floor Fiasco',tag:'04 / THIS LOOK IS A HIT AND RUN.',color:'#a45479',sky:'#f4d2e1',hazard:'rack',tip:'Rolling racks sway. Duck sale signs and take the high road.',length:4800,par:52},
  {name:'Mega Mall Showdown',tag:'05 / PLEASE SPEAK TO THE MANAGER.',color:'#385a7b',sky:'#c3d6ea',hazard:'cone',tip:'Dodge the manager’s receipts. Boost into the cart when OPEN!',length:3200,par:90}
];
export const OUTFITS=[{name:'Sunday best',color:'#e96963',stars:0},{name:'Disco gran',color:'#9964d8',stars:5},{name:'Sunshine queen',color:'#efb83e',stars:10},{name:'Mall legend',color:'#4ac7b0',stars:15}];
export const emptySave=()=>({version:1,wallet:0,best:[0,0,0,0,0],upgrades:{battery:0,armor:0},outfit:0,daily:{}});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function cleanSave(v){const s=emptySave();if(!v||v.version!==1)return s;s.wallet=clamp(Math.floor(Number(v.wallet)||0),0,999999);s.best=s.best.map((_,i)=>clamp(Math.floor(Number(v.best?.[i])||0),0,3));for(const k of ['battery','armor'])s.upgrades[k]=clamp(Math.floor(Number(v.upgrades?.[k])||0),0,3);s.outfit=clamp(Math.floor(Number(v.outfit)||0),0,3);if(s.best.reduce((a,b)=>a+b,0)<OUTFITS[s.outfit].stars)s.outfit=0;for(const [k,n]of Object.entries(v.daily||{}).slice(-30))if(/^\d{4}-\d{2}-\d{2}$/.test(k))s.daily[k]=clamp(Math.floor(Number(n)||0),0,999999);return s;}
export function daySeed(day){let n=2166136261;for(const c of day)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
export function random(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function createRun(level=0,upgrades={},seed=0,daily=false){
 const cfg=LEVELS[level],rng=random(seed||level+71),platforms=[],hazards=[],coins=[];
 for(let x=650,i=0;x<cfg.length-450;x+=440,i++){
   const offset=daily?Math.floor(rng()*110):0;
   platforms.push({x:x+80,y:i%2?290:310,w:205,h:20});
   const type=i%3===1?'sign':i%4===3?'crate':cfg.hazard;
   hazards.push({x:x+offset,y:type==='sign'?330:365,w:type==='sign'?88:type==='rack'?55:42,h:55,type,origin:x+offset});
   for(let j=0;j<5;j++)coins.push({x:x+90+j*38,y:270-(i%2?20:0),w:20,h:20,taken:false});
   for(let j=0;j<3;j++)coins.push({x:x-150+j*35,y:379,w:20,h:20,taken:false});
 }
 const hp=3+(daily?0:upgrades.armor||0);
 return {level,daily,seed,cfg,platforms,hazards,coins,x:70,y:364,w:68,h:56,vx:0,vy:0,hp,maxHp:hp,energy:100,maxEnergy:100+(daily?0:upgrades.battery||0)*25,grounded:true,coyote:.1,jumpBuffer:0,prevJump:false,invincible:0,t:0,elapsed:0,collected:0,hits:0,checkpoint:70,state:'playing',boosting:false,ducking:false,particles:[],message:'',messageTime:0,boss:level===4?{hp:5,x:cfg.length-220,y:340,w:100,h:80,phase:0,cooldown:0,shots:[]}:null};
}
export function rating(r){return 1+(r.collected>=Math.ceil(r.coins.length*.55)?1:0)+(r.hits<=1&&r.elapsed<=r.cfg.par?1:0);}
export function finish(r){r.state='won';r.stars=rating(r);r.score=Math.max(0,Math.round(r.collected*100+r.hp*200+Math.max(0,r.cfg.par-r.elapsed)*25+(r.boss?1500:0)));}
function hurt(r){if(r.invincible>0)return;r.hp--;r.hits++;r.invincible=1.5;r.vy=-220;r.message=['My coupons survived. Did you?','That was NOT on my shopping list!','I demand a senior discount!'][r.hits%3];r.messageTime=2;if(r.hp<=0)r.state='lost';}
function burst(r,x,y,color){for(let i=0;i<9;i++)r.particles.push({x,y,vx:(i%3-1)*100,vy:-70-i*13,life:.5,color});}
export function step(r,input,dt){
 if(r.state!=='playing')return;dt=clamp(dt,0,1/30);r.t+=dt;r.elapsed+=dt;r.invincible=Math.max(0,r.invincible-dt);r.messageTime=Math.max(0,r.messageTime-dt);
 const jump=!!input.jump;if(jump&&!r.prevJump)r.jumpBuffer=.14;else r.jumpBuffer=Math.max(0,r.jumpBuffer-dt);r.prevJump=jump;
 const feet=r.y+r.h;r.ducking=!!input.duck&&r.grounded;r.h=r.ducking?32:56;
 // Preserve the current support surface when changing posture.
 r.y=feet-r.h;
 r.boosting=!!input.boost&&r.energy>4&&!r.ducking;
 r.energy=clamp(r.energy+(r.boosting?-42:22)*dt,0,r.maxEnergy);
 const direction=(input.right?1:0)-(input.left?1:0),speed=r.boosting?510:r.ducking?110:245;
 const target=direction*speed;r.vx+=(target-r.vx)*Math.min(1,dt*(r.grounded?12:5));
 if(r.grounded)r.coyote=.11;else r.coyote=Math.max(0,r.coyote-dt);
 if(r.jumpBuffer>0&&r.coyote>0&&!r.ducking){r.vy=-670;r.grounded=false;r.coyote=0;r.jumpBuffer=0;}
 if(!jump&&r.vy<-230)r.vy+=1700*dt;
 const oldBottom=r.y+r.h;r.vy+=1550*dt;r.x=clamp(r.x+r.vx*dt,0,r.cfg.length-r.w);r.y+=r.vy*dt;r.grounded=false;
 if(r.y+r.h>=420){r.y=420-r.h;r.vy=0;r.grounded=true;}
 for(const p of r.platforms)if(r.vy>=0&&oldBottom<=p.y+3&&r.y+r.h>=p.y&&r.x+r.w>p.x&&r.x<p.x+p.w){r.y=p.y-r.h;r.vy=0;r.grounded=true;}
 for(const h of r.hazards){if(h.dead)continue;if(h.type==='robot')h.x=h.origin+Math.sin(r.t*2)*65;if(h.type==='rack')h.x=h.origin+Math.sin(r.t*1.5)*45;if(overlaps(r,h)){if(r.boosting&&['crate','robot'].includes(h.type)){h.dead=true;burst(r,h.x,h.y,'#e9ba52');r.message='Express checkout!';r.messageTime=1;}else hurt(r);}}
 for(const c of r.coins)if(!c.taken&&overlaps(r,c)){c.taken=true;r.collected++;burst(r,c.x,c.y,'#ffd36c');}
 if(r.x>r.checkpoint+1100)r.checkpoint=Math.floor(r.x/1100)*1100;
 if(r.boss){const b=r.boss,active=r.x>r.cfg.length-850;b.phase=(r.t%6);b.open=b.phase>=3.4;b.cooldown=Math.max(0,b.cooldown-dt);
   if(active){r.checkpoint=r.cfg.length-900;b.x=r.cfg.length-220+Math.sin(r.t*1.3)*55;if(!b.open&&Math.floor((r.t-dt)*1.6)!==Math.floor(r.t*1.6))b.shots.push({x:b.x,y:Math.floor(r.t)%2?382:323,w:40,h:22});
   for(const s of b.shots){s.x-=260*dt;if(overlaps(r,s))hurt(r);}b.shots=b.shots.filter(s=>s.x>r.cfg.length-1100);
   if(overlaps(r,b)){if(r.boosting&&b.open&&b.cooldown===0){b.hp--;b.cooldown=1;r.invincible=1;r.vx=-420;r.x=b.x-r.w-8;r.message=b.hp?'Manager: “That coupon has EXPIRED!”':'Granny: “I would like my receipt.”';r.messageTime=2;burst(r,b.x,b.y,'#fa7872');if(!b.hp)finish(r);}else if(!b.cooldown)hurt(r);}}
 }else if(r.x>=r.cfg.length-150)finish(r);
 r.particles=r.particles.filter(p=>(p.life-=dt)>0);for(const p of r.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=400*dt;}
}
export function bankRun(save,r,day){if(r.state!=='won'||r.banked)return false;r.banked=true;save.wallet+=r.collected;if(r.daily)save.daily[day]=Math.max(save.daily[day]||0,r.score);else save.best[r.level]=Math.max(save.best[r.level],r.stars);return true;}
export function buy(save,key){if(!['battery','armor'].includes(key)||save.upgrades[key]>=3)return false;const cost=30+save.upgrades[key]*25;if(save.wallet<cost)return false;save.wallet-=cost;save.upgrades[key]++;return true;}
