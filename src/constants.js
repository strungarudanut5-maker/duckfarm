export const BREEDS=[
  {id:"mallard", name:"Mallard",  bodyColor:"#4a7c3f",headColor:"#1a4a2e",billColor:"#f4a340",eyeColor:"#fff",accent:"#7ec850"},
  {id:"mandarin",name:"Mandarin", bodyColor:"#e8521a",headColor:"#2563a8",billColor:"#f7c948",eyeColor:"#fff",accent:"#f97316"},
  {id:"black",   name:"Black",    bodyColor:"#1a1a2e",headColor:"#0d0d1a",billColor:"#6366f1",eyeColor:"#a78bfa",accent:"#6366f1"},
  {id:"royal",   name:"Royal",    bodyColor:"#f8fafc",headColor:"#e2e8f0",billColor:"#fbbf24",eyeColor:"#1e293b",accent:"#fbbf24"},
  {id:"cosmic",  name:"Cosmic",   bodyColor:"#312e81",headColor:"#1e1b4b",billColor:"#e879f9",eyeColor:"#f0abfc",accent:"#e879f9"},
  {id:"golden",  name:"Golden",   bodyColor:"#f59e0b",headColor:"#d97706",billColor:"#fef3c7",eyeColor:"#1c1917",accent:"#fde68a"},
  {id:"arctic",  name:"Arctic",   bodyColor:"#bfdbfe",headColor:"#93c5fd",billColor:"#f97316",eyeColor:"#1e3a5f",accent:"#60a5fa"},
  {id:"volcanic",name:"Volcanic", bodyColor:"#7f1d1d",headColor:"#450a0a",billColor:"#f97316",eyeColor:"#fca5a5",accent:"#ef4444"},
];
export const RARITIES=[
  {id:"common",   name:"Common",  color:"#94a3b8",glow:"#64748b", eggRate:0.033,breedChance:0.90,syrCost:1,incub:7200,mineBase:0.005,mineRate:0.75},
  {id:"rare",     name:"Rare",    color:"#38bdf8",glow:"#0ea5e9", eggRate:0.133,breedChance:0.20,syrCost:2,incub:7200,mineBase:0.025,mineRate:0.80},
  {id:"epic",     name:"Epic",    color:"#a78bfa",glow:"#7c3aed", eggRate:0.333,breedChance:0.08,syrCost:4,incub:7200,mineBase:0.075,mineRate:0.85},
  {id:"legendary",name:"Legendary",color:"#fb923c",glow:"#ea580c", eggRate:1.0, breedChance:0.01,syrCost:8,incub:7200,mineBase:0.175,mineRate:0.90},
  {id:"mythic",   name:"Mythic",   color:"#f0abfc",glow:"#d946ef", eggRate:2.5, breedChance:0,  syrCost:0,incub:0,  mineBase:0.400,mineRate:0.95},
];
export const DUKY_R={common:0.003,rare:0.008,epic:0.015,legendary:0.024,mythic:0.03};
export const LVLS=[
  {l:1,xp:100,fpf:2, fph:2,  skip:30},
  {l:2,xp:100,fpf:3, fph:4,  skip:60},
  {l:3,xp:100,fpf:4, fph:8,  skip:100},
  {l:4,xp:100,fpf:5, fph:16, skip:160},
  {l:5,xp:100,fpf:6, fph:30, skip:250},
  {l:6,xp:100,fpf:7, fph:60, skip:400},
  {l:7,xp:0,  fpf:0, fph:120,skip:0},
];
export const SEEDS=[
  {id:"basic",    name:"Basic",   emoji:"🌾",desc:"Wheat+Corn",          time:60,feed:10,cost:10,skip:5, color:"#a16207"},
  {id:"medium",   name:"Medium",  emoji:"🌽",desc:"Corn+Sunflower",      time:30,feed:25,cost:25,skip:10,color:"#ca8a04"},
  {id:"legendary",name:"Legendary",emoji:"🌻",desc:"Complete Mix",       time:15,feed:60,cost:60,skip:20,color:"#a78bfa"},
];
export const TIER_COLORS=["#94a3b8","#38bdf8","#a78bfa","#fbbf24"];
export const RECIPES=[
  {id:"ou",   tier:0,name:"Boiled Egg",      emoji:"🥚",  eggs:50,    coins:1,  time:30},
  {id:"om",   tier:0,name:"Omelette",        emoji:"🍳",  eggs:100,   coins:2,  time:60},
  {id:"omb",  tier:0,name:"Cheese Omelette", emoji:"🧀",  eggs:200,   coins:3,  time:90},
  {id:"scr",  tier:0,name:"Scrambled Eggs",  emoji:"🍲",  eggs:350,   coins:4,  time:120},
  {id:"cla",  tier:1,name:"Pancakes",        emoji:"🥞",  eggs:500,   coins:6,  time:180},
  {id:"suf",  tier:1,name:"Soufflé",         emoji:"🫕",  eggs:750,   coins:8,  time:240},
  {id:"pra",  tier:1,name:"Cake Slice",      emoji:"🎂",  eggs:1000,  coins:11, time:300},
  {id:"cre",  tier:1,name:"Custard",         emoji:"🍮",  eggs:1500,  coins:15, time:360},
  {id:"tor",  tier:2,name:"Simple Cake",     emoji:"🎂",  eggs:2500,  coins:20, time:600},
  {id:"ecl",  tier:2,name:"Eclair",          emoji:"🍫",  eggs:4000,  coins:27, time:900},
  {id:"crb",  tier:2,name:"Crème Brulée",    emoji:"🍯",  eggs:6000,  coins:35, time:1200},
  {id:"mac",  tier:2,name:"Macaron",         emoji:"🫐",  eggs:8000,  coins:45, time:1500},
  {id:"trg",  tier:3,name:"Royal Cake",      emoji:"👑🎂",eggs:15000,  coins:57, time:3600},
  {id:"sfd",  tier:3,name:"Divine Soufflé",  emoji:"✨🫕",eggs:30000,  coins:68, time:7200},
  {id:"tnw",  tier:3,name:"Wedding Cake",    emoji:"💍🎂",eggs:60000,  coins:77, time:14400},
  {id:"sec",  tier:3,name:"Secret Recipe",   emoji:"🦆👑",eggs:100000, coins:85, time:21600},
];
export const MEDS=[
  {id:"recovery",  name:"Recovery Pill",   emoji:"💊",desc:"Instantly heals fatigue",cost:20},
  {id:"breedboost",name:"Breeding Boost",  emoji:"⚡",desc:"×2 breeding chance",      cost:35},
];
export const UPGRADES=[
  {id:"nest",name:"Premium Nest", emoji:"🪺",desc:"+50% egg rate", cost:30, mult:1.5},
  {id:"feed",name:"Bio Feed",     emoji:"🌾",desc:"+100% egg rate",cost:80, mult:2},
  {id:"pond",name:"Magic Pond",   emoji:"💧",desc:"+200% egg rate",cost:200,mult:3},
];
export const SLOT_COSTS=[0,0,0,80,150,250,400,600];
export const SYR_COST=15,MAX_TAPS=10000,MAX_WATER=30,MAX_ADS=10,MAX_MINE=4,MINE_SECS=7200,CD_SECS=7200,BREED_CD_SECS=7200;

export const LVL_PASS_COST=100;
export const RARITY_FEED_ADD={common:0,rare:3,epic:7,legendary:15,mythic:30};
export const gR=id=>RARITIES.find(r=>r.id===id);
export const gNR=id=>{const i=RARITIES.findIndex(r=>r.id===id);return i>=0&&i<4?RARITIES[i+1]:null;};
export const gL=lvl=>LVLS[Math.min(lvl-1,6)];
// Returns feed/xp requirements for leveling FROM lvl. lvl 7+ scales up exponentially.
export const gLExtended=lvl=>{
  if(lvl<7)return LVLS[lvl-1];
  const n=lvl-6; // n=1 for lvl7, n=2 for lvl8, etc.
  return{l:lvl,xp:150,fpf:4+n*6,fph:Math.round(120*Math.pow(1.5,n-1)),skip:0};
};
export const gLC=l=>["#94a3b8","#38bdf8","#4ade80","#fbbf24","#fb923c","#a78bfa","#f0abfc"][l-1]||"#fff";
export const gBreed=rid=>({common:"mallard",rare:"golden",epic:"black",legendary:"royal",mythic:"cosmic"})[rid]||"mallard";
export const fD=n=>n<.01?n.toFixed(4):n.toFixed(3);
export const fT=s=>{if(s<=0)return "0s";if(s<60)return `${s}s`;if(s<3600)return `${Math.floor(s/60)}m`;return `${Math.floor(s/3600)}h`;};

export const GEN_OPP=()=>Array.from({length:99},(_,i)=>{
  const names=["Duck","Quack","Farm","Breed","Egg","Myth","Gold","Epic","Rare","Legend"];
  const rs=["common","common","rare","rare","epic","legendary","mythic"];
  const rid=rs[Math.floor(Math.random()*rs.length)];
  const rates={common:0.033,rare:0.133,epic:0.333,legendary:1,mythic:2.5};
  return{id:"o"+i,name:names[i%10]+"#"+(100+i),score:+(rates[rid]*(Math.floor(Math.random()*7)+1)*(Math.floor(Math.random()*5)+1)*60*(0.7+Math.random()*.6)).toFixed(2),rarityId:rid,isPlayer:false};
});
export const TREWARD=r=>{
  if(r===1)  return{duky:0.100,syr:5,med:3,seeds:{legendary:3,medium:0,basic:0},label:"🥇 Champion #1",color:"#fbbf24"};
  if(r<=3)   return{duky:0.050,syr:3,med:2,seeds:{legendary:1,medium:2,basic:0},label:"🥇 Top 3",      color:"#fbbf24"};
  if(r<=10)  return{duky:0.020,syr:2,med:1,seeds:{legendary:0,medium:3,basic:0},label:"🥈 Top 10",     color:"#94a3b8"};
  if(r<=25)  return{duky:0.010,syr:1,med:0,seeds:{legendary:0,medium:1,basic:3},label:"🥉 Top 25",     color:"#fb923c"};
  if(r<=50)  return{duky:0,   syr:0,med:1,seeds:{legendary:0,medium:0,basic:3},label:"😅 Top 50",     color:"#4ade80"};
  return           {duky:0,   syr:0,med:0,seeds:{legendary:0,medium:0,basic:1},label:"💪 Participant", color:"#6366f1"};
};

export const PRIZE_TABLE=[
  {rank:"#1",        icon:"🥇",duky:0.100,syr:5,med:3,seedLabel:"3🌻",       color:"#fbbf24"},
  {rank:"Top 3",     icon:"🥇",duky:0.050,syr:3,med:2,seedLabel:"1🌻 2🌽",   color:"#fbbf24"},
  {rank:"Top 10",    icon:"🥈",duky:0.020,syr:2,med:1,seedLabel:"3🌽",       color:"#94a3b8"},
  {rank:"Top 25",    icon:"🥉",duky:0.010,syr:1,med:0,seedLabel:"1🌽 3🌾",   color:"#fb923c"},
  {rank:"Top 50",    icon:"😅",duky:0,   syr:0,med:1,seedLabel:"3🌾",       color:"#4ade80"},
  {rank:"Participant",icon:"💪",duky:0,   syr:0,med:0,seedLabel:"1🌾",       color:"#6366f1"},
];

export const GEN_WEEKLY_OPP=()=>Array.from({length:99},(_,i)=>{
  const names=["Alpha","Pro","Elite","Master","King","Boss","Legend","Myth","God","Top"];
  const rs=["rare","epic","epic","legendary","legendary","legendary","mythic","mythic"];
  const rid=rs[Math.floor(Math.random()*rs.length)];
  const rates={common:0.033,rare:0.133,epic:0.333,legendary:1,mythic:2.5};
  return{id:"w"+i,name:names[i%10]+"#"+(200+i),score:+(rates[rid]*(Math.floor(Math.random()*7)+1)*(Math.floor(Math.random()*9)+4)*60*(1.2+Math.random())).toFixed(2),rarityId:rid,isPlayer:false};
});

export const WEEKLY_TREWARD=r=>{
  if(r===1) return{mythic:true, duky:0.500,syr:10,med:3,seeds:{legendary:5,medium:0,basic:0},label:"🏆 Weekly Champion",color:"#f0abfc"};
  if(r<=3)  return{mythic:false,duky:0.200,syr:8, med:2,seeds:{legendary:3,medium:2,basic:0},label:"🥇 Weekly Top 3",   color:"#fbbf24"};
  if(r<=10) return{mythic:false,duky:0.100,syr:5, med:1,seeds:{legendary:2,medium:3,basic:0},label:"🥈 Weekly Top 10",  color:"#94a3b8"};
  if(r<=25) return{mythic:false,duky:0.050,syr:3, med:0,seeds:{legendary:0,medium:4,basic:3},label:"🥉 Weekly Top 25",  color:"#fb923c"};
  if(r<=50) return{mythic:false,duky:0.020,syr:1, med:1,seeds:{legendary:0,medium:2,basic:5},label:"😅 Weekly Top 50",  color:"#4ade80"};
  return         {mythic:false,duky:0.005,syr:0, med:0,seeds:{legendary:0,medium:0,basic:2},label:"💪 Participant",     color:"#6366f1"};
};

export const WEEKLY_PRIZE_TABLE=[
  {rank:"#1",       icon:"🏆",mythic:true, duky:0.500,syr:10,med:3,seedLabel:"5🌻",     color:"#f0abfc"},
  {rank:"Top 3",    icon:"🥇",mythic:false,duky:0.200,syr:8, med:2,seedLabel:"3🌻 2🌽", color:"#fbbf24"},
  {rank:"Top 10",   icon:"🥈",mythic:false,duky:0.100,syr:5, med:1,seedLabel:"2🌻 3🌽", color:"#94a3b8"},
  {rank:"Top 25",   icon:"🥉",mythic:false,duky:0.050,syr:3, med:0,seedLabel:"4🌽 3🌾", color:"#fb923c"},
  {rank:"Top 50",   icon:"😅",mythic:false,duky:0.020,syr:1, med:1,seedLabel:"2🌽 5🌾", color:"#4ade80"},
  {rank:"Participant",icon:"💪",mythic:false,duky:0.005,syr:0,med:0,seedLabel:"2🌾",    color:"#6366f1"},
];
export const TASKS_TPL=[
  {id:"f3",  cat:"🌾",title:"Feed 3 ducks",      type:"feed",   target:3,   rw:{t:"syr",q:1,  icon:"💉",label:"1 Syringe"}},
  {id:"f5",  cat:"🌾",title:"Feed 5 ducks",      type:"feed",   target:5,   rw:{t:"med",id:"recovery",q:1,icon:"💊",label:"1 Pill"}},
  {id:"f10", cat:"🌾",title:"Feed 10 ducks",     type:"feed",   target:10,  rw:{t:"syr",q:2,  icon:"💉",label:"2 Syringes"}},
  {id:"t5",  cat:"🌾",title:"500 taps",          type:"tap",    target:500, rw:{t:"syr",q:1,  icon:"💉",label:"1 Syringe"}},
  {id:"t20", cat:"🌾",title:"2000 taps",         type:"tap",    target:2000,rw:{t:"med",id:"breedboost",q:1,icon:"⚡",label:"1 Boost"}},
  {id:"p2",  cat:"🌱",title:"Plant 2 seeds",     type:"plant",  target:2,   rw:{t:"syr",q:1,  icon:"💉",label:"1 Syringe"}},
  {id:"p4",  cat:"🌱",title:"Plant 4 seeds",     type:"plant",  target:4,   rw:{t:"med",id:"recovery",q:1,icon:"💊",label:"1 Pill"}},
  {id:"h3",  cat:"🌱",title:"Harvest 3 plots",   type:"harvest",target:3,   rw:{t:"syr",q:2,  icon:"💉",label:"2 Syringes"}},
  {id:"h6",  cat:"🌱",title:"Harvest 6 plots",   type:"harvest",target:6,   rw:{t:"med",id:"breedboost",q:1,icon:"⚡",label:"1 Boost"}},
  {id:"c1",  cat:"🍳",title:"Cook 1 recipe",     type:"cook",   target:1,   rw:{t:"syr",q:1,  icon:"💉",label:"1 Syringe"}},
  {id:"c3",  cat:"🍳",title:"Cook 3 recipes",    type:"cook",   target:3,   rw:{t:"med",id:"recovery",q:2,icon:"💊",label:"2 Pills"}},
  {id:"c5",  cat:"🍳",title:"Cook 5 recipes",    type:"cook",   target:5,   rw:{t:"syr",q:3,  icon:"💉",label:"3 Syringes"}},
  {id:"b1",  cat:"🧬",title:"1 breeding procedure", type:"breed",  target:1,   rw:{t:"syr",q:2,  icon:"💉",label:"2 Syringes"}},
  {id:"b3",  cat:"🧬",title:"3 breeding procedures", type:"breed",  target:3,   rw:{t:"med",id:"recovery",q:2,icon:"💊",label:"2 Pills"}},
  {id:"v1",  cat:"🏥",title:"Heal 1 duck",       type:"heal",   target:1,   rw:{t:"syr",q:1,  icon:"💉",label:"1 Syringe"}},
  {id:"v3",  cat:"🏥",title:"Heal 3 ducks",      type:"heal",   target:3,   rw:{t:"med",id:"breedboost",q:1,icon:"⚡",label:"1 Boost"}},
  {id:"m1",  cat:"⛏️",title:"Send to mining",    type:"mine",   target:1,   rw:{t:"med",id:"recovery",q:1,icon:"💊",label:"1 Pill"}},
  {id:"m2",  cat:"⛏️",title:"2 ducks to mining", type:"mine",   target:2,   rw:{t:"syr",q:2,  icon:"💉",label:"2 Syringes"}},
  {id:"cl1", cat:"⛏️",title:"Claim mining",      type:"claim",  target:1,   rw:{t:"med",id:"breedboost",q:1,icon:"⚡",label:"1 Boost"}},
  {id:"l1",  cat:"⭐",title:"Level up a duck",   type:"levelup",target:1,   rw:{t:"both",syr:2,mid:"recovery",mq:1,icon:"🎁",label:"2💉+1💊"}},
  {id:"l3",  cat:"⭐",title:"3 level ups",       type:"levelup",target:3,   rw:{t:"both",syr:3,mid:"breedboost",mq:1,icon:"🎁",label:"3💉+1⚡"}},
  {id:"w10", cat:"📺",title:"Watch 10 videos",   type:"watch",  target:10,  rw:{t:"coins",q:10,icon:"🪙",label:"10 Coins"}},
];
export function getDailyTasks(){
  const today=new Date().toDateString();
  let h=0;for(let i=0;i<today.length;i++)h=((h<<5)-h)+today.charCodeAt(i);
  return[...TASKS_TPL].sort(()=>(Math.sin(h++)*10000)%1-.5).slice(0,5).map(t=>({...t,progress:0,done:false}));
}

export const ACHIEVEMENTS_TPL = [
  { id: "eggs_1k",   title: "Egg Novice",    desc: "Collect 1,000 total eggs",      target: 1000,   reward: 0.005, icon: "🥚" },
  { id: "eggs_10k",  title: "Egg Baron",     desc: "Collect 10,000 total eggs",     target: 10000,  reward: 0.025, icon: "🚜" },
  { id: "ducks_5",   title: "Duck Keeper",   desc: "Own 5 ducks at once",           target: 5,      reward: 0.010, icon: "🦆" },
  { id: "lvl_max",   title: "Elite Trainer", desc: "Get a duck to Level 7",         target: 1,      reward: 0.015, icon: "⭐" },
  { id: "mine_pro",  title: "Deep Miner",    desc: "Claim mining rewards 20 times", target: 20,     reward: 0.030, icon: "⛏️" },
  { id: "breed_epic",title: "Geneticist",    desc: "Breed an Epic rarity duck",     target: 1,      reward: 0.050, icon: "🧬" },
];

export const COIN_PACKS = [
  {n:"Starter", p:"0.99€",  e:"🥚", c:"#94a3b8", coins:500,   bonusSyr:0,  bonusBoost:0, bonusPill:0, desc:"~33 syr"},
  {n:"Basic",   p:"2.99€",  e:"🦆", c:"#38bdf8", coins:2000,  bonusSyr:5,  bonusBoost:0, bonusPill:1, desc:"+5💉 +1💊"},
  {n:"Pro ⭐",  p:"7.99€",  e:"🔮", c:"#a78bfa", coins:6000,  bonusSyr:15, bonusBoost:1, bonusPill:2, desc:"+15💉 +1⚡ +2💊"},
  {n:"Elite",   p:"14.99€", e:"👑", c:"#fbbf24", coins:15000, bonusSyr:40, bonusBoost:3, bonusPill:5, desc:"+40💉 +3⚡ +5💊"},
];

export const HATCH_EGGS = [
  {rid:"rare",      name:"Rare",      emoji:"💎", coins:1500,  color:"#38bdf8", desc:"Skip breeding RNG"},
  {rid:"epic",      name:"Epic",      emoji:"💜", coins:8000,  color:"#a78bfa", desc:"5% breed chance × forever"},
  {rid:"legendary", name:"Legendary", emoji:"🔥", coins:40000, color:"#fb923c", desc:"Max DUKY mining rate"},
];

export const MYSTERY_EGGS=[
  {id:"basic",  name:"Basic Egg",   emoji:"🥚", cost:150,  costType:"coins", color:"#94a3b8",
   desc:"Common or Rare surprise",   odds:[{rid:"common",w:70},{rid:"rare",w:28},{rid:"epic",w:2}]},
  {id:"rare",   name:"Rare Egg",    emoji:"💎", cost:800,  costType:"coins", color:"#38bdf8",
   desc:"Rare or better guaranteed", odds:[{rid:"rare",w:60},{rid:"epic",w:34},{rid:"legendary",w:6}]},
  {id:"golden", name:"Golden Egg",  emoji:"🌟", cost:3000, costType:"coins", color:"#fbbf24",
   desc:"Epic or Legendary duck",    odds:[{rid:"epic",w:55},{rid:"legendary",w:38},{rid:"mythic",w:7}]},
  {id:"mythic", name:"Mythic Egg",  emoji:"👑", cost:8,    costType:"duky",  color:"#f0abfc",
   desc:"Legendary or Mythic duck",  odds:[{rid:"legendary",w:65},{rid:"mythic",w:35}]},
];

export const MAX_AD_COINS = 15;
export const MAX_AD_SYR   = 5;

export const STREAK_REWARDS = [
  { day: 1, icon: "🪙", label: "50 Coins",      type: "coins", amount: 50 },
  { day: 2, icon: "🪙", label: "100 Coins",     type: "coins", amount: 100 },
  { day: 3, icon: "💉", label: "1 Syringe",     type: "syr",   amount: 1 },
  { day: 4, icon: "🪙", label: "150 Coins",     type: "coins", amount: 150 },
  { day: 5, icon: "💊", label: "Recovery Pill", type: "med",   medId: "recovery", amount: 1 },
  { day: 6, icon: "🎁", label: "200🪙 + 2💉",   type: "both",  coins: 200, syr: 2 },
  { day: 7, icon: "💎", label: "0.01 DUKY",     type: "duky",  amount: 0.01 },
];