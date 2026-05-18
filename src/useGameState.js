import { useState, useEffect, useCallback } from "react";
import {
  DUKY_R, LVLS, SEEDS, UPGRADES, MEDS,
  MAX_MINE, MINE_SECS, CD_SECS, BREED_CD_SECS, RARITIES, SLOT_COSTS, SYR_COST, MAX_WATER, MAX_ADS,
  gR, gNR, gL, gLC, gBreed, GEN_OPP, GEN_WEEKLY_OPP, getDailyTasks, fD, fT, ACHIEVEMENTS_TPL, DUKY_R as D_REWARDS,
  STREAK_REWARDS, MAX_AD_COINS, MAX_AD_SYR
} from "./constants";

export function useGameState() {
  // Resurse
  const[eggs,     setEggs]     =useState(()=>Number(localStorage.getItem("duky_eggs"))||2);
  const[coins,    setCoins]    =useState(()=>Number(localStorage.getItem("duky_coins"))||0.5);
  const[duky,     setDuky]     =useState(()=>Number(localStorage.getItem("duky_val"))||0);
  const[feed,     setFeed]     =useState(()=>Number(localStorage.getItem("duky_feed"))||20);
  const[syringes, setSyringes] =useState(()=>Number(localStorage.getItem("duky_syr"))||1);
  const[water,    setWater]    =useState(()=>Number(localStorage.getItem("duky_water"))||30);
  const[totalEggs,setTotalEggs]=useState(()=>Number(localStorage.getItem("duky_totalEggs"))||0);
  const[tapsToday,setTapsToday]=useState(()=>Number(localStorage.getItem("duky_tapsToday"))||0);
  const[meds,     setMeds]     =useState(()=>JSON.parse(localStorage.getItem("duky_meds"))||{recovery:1,breedboost:0});
  const[slots,    setSlots]    =useState(()=>Number(localStorage.getItem("duky_slots"))||3);
  
  // Obiecte Joc
  const[ducks,    setDucks]    =useState(()=>JSON.parse(localStorage.getItem("duky_ducks"))||[
    {id:"d1",rid:"common",bid:"mallard",lvl:1,xp:0,tired:false,lvlUpAt:null,miningUntil:null,breedCdUntil:null,nickname:""},
    {id:"d2",rid:"common",bid:"mallard",lvl:2,xp:0,tired:false,lvlUpAt:null,miningUntil:null,breedCdUntil:null,nickname:""},
  ]);
  const[plots,    setPlots]    =useState(()=>JSON.parse(localStorage.getItem("duky_plots"))||Array(8).fill(null));
  const[seedInv,  setSeedInv]  =useState(()=>JSON.parse(localStorage.getItem("duky_seeds"))||{basic:3,medium:0,legendary:0});
  const[upgrades, setUpgrades] =useState(()=>JSON.parse(localStorage.getItem("duky_upgrades"))||{nest:false,feed:false,pond:false});
  
  // Meta stări
  const[adsToday, setAdsToday] =useState(()=>Number(localStorage.getItem("duky_ads"))||0);
  const[socialClaimed,setSocialClaimed]=useState(()=>JSON.parse(localStorage.getItem("duky_socialClaimed"))||{instagram:false,youtube:false,twitter:false,tiktok:false});
  const[nextId,   setNextId]   =useState(()=>Number(localStorage.getItem("duky_nextId"))||100);
  const[taskClaimed,setTaskClaimed]=useState(()=>JSON.parse(localStorage.getItem("duky_taskClaimed"))||{});
  const[tData,       setTData]      =useState(()=>({opponents:GEN_OPP(),endTime:Date.now()+24*3600*1000,claimed:false}));
  const[weeklyTData, setWeeklyTData]=useState(()=>({opponents:GEN_WEEKLY_OPP(),endTime:Date.now()+7*24*3600*1000,claimed:false}));
  const[achieved, setAchieved] =useState(()=>JSON.parse(localStorage.getItem("duky_achieved"))||{});
  const[mineCount,setMineCount]=useState(()=>Number(localStorage.getItem("duky_mineCount"))||0);
  const[loginStreak,   setLoginStreak]   =useState(()=>Number(localStorage.getItem("duky_streak"))||0);
  const[loginReward,   setLoginReward]   =useState(null);
  const[offlineEarnings,setOfflineEarnings]=useState(null);
  const[adCoinsToday,  setAdCoinsToday]  =useState(()=>Number(localStorage.getItem("duky_adCoinsToday"))||0);
  const[adSyrToday,    setAdSyrToday]    =useState(()=>Number(localStorage.getItem("duky_adSyrToday"))||0);
  const[miningBoostUntil,setMiningBoostUntil]=useState(()=>Number(localStorage.getItem("duky_miningBoostUntil"))||0);
  // Timer-e și acțiuni (Noi)
  const[cooking,  setCooking]  =useState(()=>JSON.parse(localStorage.getItem("duky_cooking"))||null);
  const[cookTimer,setCookTimer]=useState(()=>Number(localStorage.getItem("duky_cookTimer"))||0);
  const[breedSlot,setBreedSlot]=useState(()=>JSON.parse(localStorage.getItem("duky_breedSlot"))||null);
  const[breedRes, setBreedRes] =useState(null);
  const[breedBoost,setBreedBoost]=useState(false);
  const[skipCount, setSkipCount]=useState(()=>Number(localStorage.getItem("duky_skipCount"))||0);

  const[now,      setNow]      =useState(Date.now());
  const[dailyTasks,setDailyTasks]=useState(()=>getDailyTasks());
  const[pulse,    setPulse]    =useState(false);
  const[floats,   setFloats]   =useState([]);

  // --- UTILS (Moved up to prevent Initialization Errors) ---

  const addFloat=useCallback((text,color)=>{
    const id=Date.now()+Math.random();
    setFloats(f=>[...f,{id,text,color}]);
    setTimeout(()=>setFloats(f=>f.filter(x=>x.id!==id)),1700);
  },[]);

  const progTask=useCallback((type,amount=1)=>{
    setDailyTasks(prev=>prev.map(t=>{
      if(t.done||t.type!==type)return t;
      const np=Math.min((t.progress||0)+amount,t.target);
      return{...t,progress:np,done:np>=t.target};
    }));
  },[]);

  const processBreedingResult = useCallback(() => {
    const tR = gR(breedSlot.trid);
    const sR = gR(breedSlot.rid); // sursa — breedChance corect
    const ok = Math.random() < (breedBoost ? Math.min(sR.breedChance * 2, 1) : sR.breedChance);
    setBreedBoost(false);
    if(ok && ducks.length < slots){
      const nd = {id:"d"+nextId, rid:tR.id, bid:gBreed(tR.id), lvl:1, xp:0, tired:false, lvlUpAt:null, miningUntil:null, breedCdUntil:null, nickname:""};
      setNextId(n => n + 1);
      setDucks(d => [...d, nd]);
      setBreedRes({ok:true, rarity:tR, bid:nd.bid, newId: "d"+(nextId)});
      addFloat(`🎉 ${tR.name}!`, tR.color);
    } else if(ok){
      setBreedRes({ok:true, rarity:tR, noSlot:true});
      addFloat("⚠️ Slot full!", "#fbbf24");
    } else {
      setEggs(e => e + 1);
      setBreedRes({ok:false});
      addFloat("❌ Failure → +1🥚", "#ef4444");
    }
    setDucks(d => d.map(dk => dk.id === breedSlot.did ? {...dk, tired:true, tiredUntil: Date.now() + BREED_CD_SECS*1000, breedCdUntil: Math.floor(Date.now()/1000) + BREED_CD_SECS} : dk));
    setBreedSlot(null);
  }, [breedSlot, breedBoost, ducks.length, slots, nextId, addFloat]);

  const claimLoginReward = useCallback(()=>{
    if(!loginReward)return;
    const rw=loginReward;
    if(rw.type==="coins"){setCoins(c=>c+rw.amount);addFloat(`+${rw.amount}🪙`,"#fbbf24");}
    else if(rw.type==="syr"){setSyringes(s=>s+rw.amount);addFloat(`+${rw.amount}💉`,"#a78bfa");}
    else if(rw.type==="med"){setMeds(m=>({...m,[rw.medId]:(m[rw.medId]||0)+rw.amount}));addFloat(`+${rw.amount}${rw.icon}`,"#4ade80");}
    else if(rw.type==="both"){setCoins(c=>c+rw.coins);setSyringes(s=>s+rw.syr);addFloat(`🎁 Day ${rw.day}!`,"#fbbf24");}
    else if(rw.type==="duky"){setDuky(d=>+(d+rw.amount).toFixed(4));addFloat(`+${rw.amount}💎 DUKY`,"#f0abfc");}
    setLoginReward(null);
  },[loginReward,addFloat]);

  const claimOfflineEarnings = useCallback(()=>{
    if(!offlineEarnings)return;
    setEggs(e=>+(e+offlineEarnings.eggs).toFixed(2));
    setTotalEggs(t=>+(t+offlineEarnings.eggs).toFixed(2));
    addFloat(`+${offlineEarnings.eggs}🥚 offline!`,"#4ade80");
    setOfflineEarnings(null);
  },[offlineEarnings,addFloat]);

  const claimAchievement = useCallback((id) => {
    const ach = ACHIEVEMENTS_TPL.find(a => a.id === id);
    if (!ach || achieved[id]) return;
    
    setDuky(d => +(d + ach.reward).toFixed(4));
    setAchieved(prev => ({ ...prev, [id]: true }));
    addFloat(`🏆 ${ach.title} Claimed! +${fD(ach.reward)}`, "#f0abfc");
  }, [achieved, addFloat]);


  // --- EFFECTS ---

  // Persistență LocalStorage
  useEffect(() => {
    localStorage.setItem("duky_eggs", eggs);
    localStorage.setItem("duky_coins", coins);
    localStorage.setItem("duky_val", duky);
    localStorage.setItem("duky_feed", feed);
    localStorage.setItem("duky_syr", syringes);
    localStorage.setItem("duky_water", water);
    localStorage.setItem("duky_ads", adsToday);
    localStorage.setItem("duky_totalEggs", totalEggs);
    localStorage.setItem("duky_meds", JSON.stringify(meds));
    localStorage.setItem("duky_slots", slots);
    localStorage.setItem("duky_ducks", JSON.stringify(ducks));
    localStorage.setItem("duky_plots", JSON.stringify(plots));
    localStorage.setItem("duky_seeds", JSON.stringify(seedInv));
    localStorage.setItem("duky_upgrades", JSON.stringify(upgrades));
    localStorage.setItem("duky_nextId", nextId);
    localStorage.setItem("duky_taskClaimed", JSON.stringify(taskClaimed));
    localStorage.setItem("duky_socialClaimed", JSON.stringify(socialClaimed));
    localStorage.setItem("duky_achieved", JSON.stringify(achieved));
    localStorage.setItem("duky_mineCount", mineCount);
    localStorage.setItem("duky_tapsToday", tapsToday);
    localStorage.setItem("duky_cooking", JSON.stringify(cooking));
    localStorage.setItem("duky_cookTimer", cookTimer);
    localStorage.setItem("duky_breedSlot", JSON.stringify(breedSlot));
    localStorage.setItem("duky_adCoinsToday", adCoinsToday);
    localStorage.setItem("duky_adSyrToday", adSyrToday);
    localStorage.setItem("duky_miningBoostUntil", miningBoostUntil);
    localStorage.setItem("duky_skipCount", skipCount);
  }, [eggs, coins, duky, feed, syringes, water, adsToday, totalEggs, meds, slots, ducks, plots, seedInv, upgrades, nextId, taskClaimed, socialClaimed, achieved, mineCount, tapsToday, cooking, cookTimer, breedSlot, adCoinsToday, adSyrToday, miningBoostUntil, skipCount]);

  // Bucla de timp (1s)
  useEffect(()=>{const iv=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(iv);},[]);

  // Login streak + offline earnings — ruleaza o singura data la mount
  useEffect(()=>{
    // --- Login Streak ---
    const today=new Date().toDateString();
    const lastLogin=localStorage.getItem("duky_lastLogin")||"";
    const yesterday=new Date(Date.now()-86400000).toDateString();
    if(lastLogin!==today){
      const newStreak=lastLogin===yesterday?loginStreak+1:1;
      const reward=STREAK_REWARDS[(newStreak-1)%7];
      setLoginStreak(newStreak);
      localStorage.setItem("duky_streak",newStreak);
      localStorage.setItem("duky_lastLogin",today);
      setLoginReward({...reward,streakCount:newStreak});
      // Reset contori zilnici
      setTapsToday(0); setAdsToday(0);
      setAdCoinsToday(0); setAdSyrToday(0);
      setDailyTasks(getDailyTasks()); setTaskClaimed({});
    }
    // --- Offline Earnings ---
    const lastActive=Number(localStorage.getItem("duky_lastActive"))||0;
    if(lastActive>0){
      const elapsed=Math.floor((Date.now()-lastActive)/1000);
      if(elapsed>60){
        const cappedSecs=Math.min(elapsed,4*3600);
        const savedDucks=JSON.parse(localStorage.getItem("duky_ducks"))||[];
        const savedUpgrades=JSON.parse(localStorage.getItem("duky_upgrades"))||{};
        const offMult=UPGRADES.filter(u=>savedUpgrades[u.id]).reduce((a,u)=>a*u.mult,1);
        const offEps=savedDucks.reduce((a,d)=>{
          const r=gR(d.rid);
          if(d.miningUntil&&d.miningUntil>Date.now())return a;
          const lvlBonus=1+(d.lvl-1)*0.10;
          return a+(r?.eggRate||0)*(d.tired?0.4:1)*lvlBonus;
        },0)*offMult;
        if(offEps>0){
          const earned=+(offEps*cappedSecs).toFixed(2);
          if(earned>=0.01)setOfflineEarnings({eggs:earned,seconds:cappedSecs});
        }
      }
    }
    localStorage.setItem("duky_lastActive",Date.now().toString());
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  // Actualizeaza lastActive la fiecare 30s
  useEffect(()=>{
    const iv=setInterval(()=>localStorage.setItem("duky_lastActive",Date.now().toString()),30000);
    return()=>clearInterval(iv);
  },[]);

  // Auto-recuperare oboseala dupa 10 min
  useEffect(()=>{
    if(ducks.some(d=>d.tired&&d.tiredUntil&&d.tiredUntil<=now)){
      setDucks(d=>d.map(dk=>dk.tired&&dk.tiredUntil&&dk.tiredUntil<=now?{...dk,tired:false,tiredUntil:null}:dk));
    }
  },[now]); // eslint-disable-line react-hooks/exhaustive-deps

  // Multiplicator și Producție
  const mult=UPGRADES.filter(u=>upgrades[u.id]).reduce((a,u)=>a*u.mult,1);
  const eps=ducks.reduce((a,d)=>{
    const r=gR(d.rid);
    const mining=d.miningUntil&&d.miningUntil>now;
    const breeding=breedSlot&&breedSlot.did===d.id;
    if(mining||breeding)return a;
    const lvlBonus=1+(d.lvl-1)*0.10;
    return a+(r?.eggRate||0)*(d.tired?0.4:1)*lvlBonus;
  },0)*mult;

  // Producție Ouă (0.1s pentru fluiditate)
  useEffect(()=>{
    const iv=setInterval(()=>{
      const g=eps/10;
      if(g>0){
        setEggs(e=>+(e+g).toFixed(2));
        setTotalEggs(t=>+(t+g).toFixed(2));
        if(Math.random()<.05){setPulse(true);setTimeout(()=>setPulse(false),250);}
      }
    },100);
    return()=>clearInterval(iv);
  },[eps]);

  // Consum Hrană
  useEffect(()=>{
    const iv=setInterval(()=>{
      const rate=ducks.reduce((a,d)=>{
        if(d.miningUntil&&d.miningUntil>now)return a;
        if(breedSlot&&breedSlot.did===d.id)return a;
        return a+(gL(d.lvl)?.fph||2)/360;
      },0);
      if(rate>0)setFeed(f=>Math.max(0,+(f-rate).toFixed(3)));
    },10000);
    return()=>clearInterval(iv);
  },[ducks,now]);

  // --- ACTION FUNCTIONS (Centralized Logic) ---

  const feedDuck = useCallback((duckId) => {
    const duck = ducks.find(d => d.id === duckId);
    if (!duck || duck.lvl >= 7 || duck.tired) return;
    if (duck.lvlUpAt && duck.lvlUpAt > Math.floor(Date.now() / 1000)) {
      addFloat("Cooldown! ⏳", "#fbbf24");
      return;
    }
    const ld = gL(duck.lvl);
    const fn = ld.fpf || 2;
    if (feed < fn) {
      addFloat(`Need ${fn}🌾`, "#ef4444");
      return;
    }
    setFeed(f => Math.max(0, +(f - fn).toFixed(2)));
    setDucks(prev => prev.map(dk => {
      if (dk.id !== duckId) return dk;
      const nx = dk.xp + 10;
      const up = dk.lvl < 7 && nx >= ld.xp;
      if (up) {
        const dg = DUKY_R[dk.rid] || .001;
        setDuky(v => +(v + dg).toFixed(4));
        addFloat(`🎉 Lvl ${dk.lvl + 1}! +${fD(dg)} DUKY`, gLC(dk.lvl + 1));
        progTask("levelup");
        return { ...dk, lvl: dk.lvl + 1, xp: 0, lvlUpAt: Math.floor(Date.now() / 1000) + CD_SECS };
      }
      addFloat(`+10XP -${fn}🌾`, "#4ade80");
      progTask("feed");
      return { ...dk, xp: nx };
    }));
  }, [ducks, feed, addFloat, progTask]);

  const startBreeding = useCallback((duckId) => {
    const duck = ducks.find(d => d.id === duckId);
    if (!duck) return;
    const nR = gNR(duck.rid);
    if (!nR) { addFloat("Max rarity!", "#f0abfc"); return; }
    if (breedSlot) { addFloat("Lab busy!", "#ef4444"); return; }
    if (duck.tired) { addFloat("Duck is tired!", "#ef4444"); return; }
    if (duck.miningUntil && duck.miningUntil > now) { addFloat("Mining! Please wait.", "#ef4444"); return; }
    if (duck.lvlUpAt && duck.lvlUpAt > Math.floor(now / 1000)) { addFloat("Leveling up! Please wait.", "#fbbf24"); return; }
    if (duck.breedCdUntil && duck.breedCdUntil > Math.floor(now / 1000)) { addFloat(`Cooldown: ${fT(duck.breedCdUntil - Math.floor(now / 1000))}`, "#fbbf24"); return; }
    if (syringes < nR.syrCost) { addFloat(`Need ${nR.syrCost}💉`, "#ef4444"); return; }

    setSyringes(s => s - nR.syrCost);
    setBreedRes(null);
    setBreedSlot({ did: duck.id, rid: duck.rid, trid: nR.id, endsAt: Date.now() + nR.incub * 1000, total: nR.incub });
    addFloat("💉 Procedure!", "#a78bfa");
    progTask("breed");
  }, [ducks, breedSlot, syringes, now, addFloat, progTask]);

  const plantSeed = useCallback((idx, seedId) => {
    if (plots[idx] || water < 1 || (seedInv[seedId] || 0) < 1) return;
    const seed = SEEDS.find(s => s.id === seedId);
    setWater(w => w - 1);
    setSeedInv(inv => ({ ...inv, [seedId]: inv[seedId] - 1 }));
    setPlots(p => p.map((pl, i) => i === idx ? { sid: seedId, at: Date.now(), gt: seed.time * 60 * 1000, yld: seed.feed } : pl));
    addFloat(`🌱 Planted!`, "#4ade80");
    progTask("plant");
  }, [plots, water, seedInv, addFloat, progTask]);

  const harvestPlot = useCallback((idx) => {
    const plot = plots[idx];
    if (!plot || now - plot.at < plot.gt) { addFloat("Not ready!", "#ef4444"); return; }
    setFeed(f => +(f + plot.yld).toFixed(1));
    setPlots(p => p.map((pl, i) => i === idx ? null : pl));
    addFloat(`+${plot.yld}🌾`, "#4ade80");
    progTask("harvest");
  }, [plots, now, addFloat, progTask]);

  const sendMining = useCallback((duckId) => {
    const duck = ducks.find(d => d.id === duckId);
    const miningCount = ducks.filter(d => d.miningUntil && d.miningUntil > now).length;
    if (!duck || duck.lvl < 7 || duck.tired || miningCount >= MAX_MINE) return;
    if (breedSlot && breedSlot.did === duckId) { addFloat("Breeding! Please wait.", "#a78bfa"); return; }
    setDucks(d => d.map(dk => dk.id === duckId ? { ...dk, miningUntil: Date.now() + MINE_SECS * 1000 } : dk));
    addFloat("⛏️ Off to mining!", "#f0abfc");
    progTask("mine");
  }, [ducks, now, breedSlot, addFloat, progTask]);

  const claimMining = useCallback((duckId) => {
    const duck = ducks.find(d => d.id === duckId);
    if (!duck) return;
    const r = gR(duck.rid);
    const boosted = miningBoostUntil > Date.now();
    const roll = Math.random();
    const base = roll < (r?.mineRate || .7) ? r.mineBase * (0.8 + Math.random() * .4) : r.mineBase * (0.2 + Math.random() * .3);
    const reward = +(base * (boosted ? 2 : 1)).toFixed(4);
    setDuky(v => +(v + reward).toFixed(4));
    setMineCount(c => c + 1);
    setDucks(d => d.map(dk => dk.id === duckId ? { ...dk, miningUntil: null, tired: true, tiredUntil: Date.now() + 600000 } : dk));
    addFloat(`+${fD(reward)} DUKY${boosted?" 2x⚡":""}`, "#f0abfc");
    progTask("claim");
  }, [ducks, miningBoostUntil, addFloat, progTask, setMineCount]);

  const skipMining = useCallback((duckId) => {
    const cost = (skipCount + 1) * 10;
    if (coins < cost) { addFloat(`Need ${cost} coins!`, "#ef4444"); return; }
    setCoins(c => c - cost);
    setSkipCount(n => n + 1);
    setDucks(d => d.map(dk => dk.id === duckId ? { ...dk, miningUntil: Date.now() - 1 } : dk));
    addFloat(`⏩ Mining done!`, "#fbbf24");
  }, [coins, skipCount, addFloat]);

  const skipBreeding = useCallback(() => {
    if (!breedSlot) return;
    const cost = (skipCount + 1) * 10;
    if (coins < cost) { addFloat(`Need ${cost} coins!`, "#ef4444"); return; }
    setCoins(c => c - cost);
    setSkipCount(n => n + 1);
    setBreedSlot(b => b ? { ...b, endsAt: Date.now() - 1 } : null);
    addFloat(`⏩ Breeding done!`, "#a78bfa");
  }, [coins, skipCount, breedSlot, addFloat]);

  const buySlot = useCallback(() => {
    if (slots >= 8) return;
    const cost = SLOT_COSTS[slots];
    if (coins < cost) { addFloat(`Need ${cost}🪙`, "#ef4444"); return; }
    setCoins(c => c - cost);
    setSlots(s => s + 1);
    addFloat("+1 Slot!", "#4ade80");
  }, [slots, coins, addFloat]);

  const handleUseMed = useCallback((duckId, medId) => {
    if (!(meds[medId] > 0)) { addFloat("Medicine missing!", "#ef4444"); return; }
    setMeds(m => ({ ...m, [medId]: m[medId] - 1 }));
    if (medId === "recovery") {
      setDucks(d => d.map(dk => dk.id === duckId ? { ...dk, tired: false, tiredUntil: null } : dk));
      addFloat("💊 Healed!", "#4ade80");
      progTask("heal");
    } else if (medId === "breedboost") {
      setBreedBoost(true);
      addFloat("⚡ Boost active!", "#fbbf24");
    }
  }, [meds, addFloat, progTask]);

  // --- TIMERS LOGIC ---
  useEffect(() => {
    if (!cooking) return;
    if (cookTimer <= 0) {
      setCoins(c => +(c + cooking.coins).toFixed(2));
      addFloat(`+${cooking.coins} 🪙`, "#fbbf24");
      progTask("cook");
      setCooking(null);
      return;
    }
    const t = setTimeout(() => setCookTimer(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooking, cookTimer, addFloat, progTask]);

  useEffect(()=>{
    if(!breedSlot) return;
    const remaining = breedSlot.endsAt - Date.now();
    if(remaining <= 0){
      processBreedingResult();
      return;
    }
    const t = setTimeout(() => setBreedSlot(b => b ? {...b} : null), Math.min(remaining, 1000));
    return () => clearTimeout(t);
  }, [breedSlot]);

  return {
    eggs, setEggs, coins, setCoins, duky, setDuky, feed, setFeed, syringes, setSyringes,
    water, setWater, adsToday, setAdsToday, tapsToday, setTapsToday,
    totalEggs, setTotalEggs, meds, setMeds, slots, setSlots, ducks, setDucks,
    plots, setPlots, seedInv, setSeedInv, upgrades, setUpgrades,
    socialClaimed, setSocialClaimed, nextId, setNextId,
    now, dailyTasks, setDailyTasks, taskClaimed, setTaskClaimed, tData, setTData, weeklyTData, setWeeklyTData,
    pulse, eps, mult, addFloat, floats, setFloats, progTask,
    achieved, claimAchievement, mineCount, setMineCount,
    cooking, setCooking, cookTimer, setCookTimer, breedSlot, setBreedSlot, breedRes, setBreedRes, breedBoost, setBreedBoost,
    feedDuck, startBreeding, plantSeed, harvestPlot, sendMining, claimMining, buySlot, handleUseMed,
    skipMining, skipBreeding, skipCount, setSkipCount,
    loginStreak, loginReward, offlineEarnings, claimLoginReward, claimOfflineEarnings,
    adCoinsToday, setAdCoinsToday, adSyrToday, setAdSyrToday,
    miningBoostUntil, setMiningBoostUntil,
  };
}