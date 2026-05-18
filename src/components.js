import React from 'react';
import { BREEDS } from './constants';

const DUCK_SKINS=['/hellfire.png','/gangster.png','/steampunk.png','/detective.png','/captain.png'];

export function Duck({breedId,duckId,size=60,tired,mining,cooldown,lvl=1,animType,onClick}){
  const b=BREEDS.find(x=>x.id===breedId)||BREEDS[0];
  const ov=tired?"zz":mining?"...":cooldown?"cd":null;
  const num=duckId?parseInt(duckId.replace(/\D/g,''),10)||0:0;
  const skin=DUCK_SKINS[num%DUCK_SKINS.length];
  const evAnim=animType==='feed'?'duckFeed 0.55s ease-out'
    :animType==='lvlup'?'duckLvlup 0.95s ease-in-out'
    :animType==='heal'?'duckHeal 0.75s ease-in-out':'none';
  return(
    <div style={{position:"relative",width:size,display:"inline-block",opacity:(tired||cooldown)?0.55:1,cursor:onClick?"pointer":"default",animation:evAnim}} onClick={onClick}>
      <img src={skin} alt="duck"
        style={{display:"block",width:"100%",height:"auto",
          filter:`drop-shadow(0 0 ${Math.min(lvl*2,14)}px ${b.accent})`,
          animation:"none"}}/>
      {ov&&<div style={{position:"absolute",top:-5,right:-5,fontSize:size*.22}}>{ov}</div>}
    </div>
  );
}

export const G=({children,style={},glow=""})=>(
  <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"13px 14px",boxShadow:glow?`0 0 24px ${glow}33, 0 4px 24px rgba(0,0,0,0.4)`:"0 4px 24px rgba(0,0,0,0.3)",...style}}>{children}</div>
);
export const B=({color,children,size=9})=>(
  <span style={{background:`${color}18`,color,border:`1px solid ${color}44`,borderRadius:5,padding:`1px ${Math.round(size/2)+1}px`,fontSize:size,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>
);
export const PB=({pct,color,h=5})=>(
  <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:h,overflow:"hidden",width:"100%"}}>
    <div style={{height:"100%",borderRadius:99,width:`${Math.min(Math.max(pct,0),100)}%`,background:color||"linear-gradient(90deg,#6366f1,#a78bfa)",transition:"width .4s"}}></div>
  </div>
);
export const SL=({children})=><div style={{fontSize:9,fontWeight:700,color:"rgba(99,102,241,0.6)",letterSpacing:2,textTransform:"uppercase",marginTop:2,marginBottom:1}}>{children}</div>;
export const Row=({l,v,c="#e2e8f0"})=>(
  <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(99,102,241,0.07)",fontSize:11}}>
    <span style={{color:"rgba(255,255,255,0.4)"}}>{l}</span>
    <span style={{color:c,fontFamily:"'Orbitron',sans-serif",fontSize:10}}>{v}</span>
  </div>
);