import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import './index.css';
import {
  BREEDS, RARITIES, DUKY_R, SEEDS, TIER_COLORS, RECIPES, MEDS, UPGRADES,
  SLOT_COSTS, SYR_COST, MAX_TAPS, MAX_WATER, MAX_ADS, MAX_MINE, MINE_SECS, CD_SECS,
  gR, gNR, gL, gLC, gBreed, fD, fT, GEN_OPP, GEN_WEEKLY_OPP, TREWARD, WEEKLY_TREWARD, ACHIEVEMENTS_TPL, STREAK_REWARDS, PRIZE_TABLE, WEEKLY_PRIZE_TABLE,
  COIN_PACKS, HATCH_EGGS, MAX_AD_COINS, MAX_AD_SYR
} from './constants';
import { S } from './styles';
import { Duck, G, B, PB, SL, Row } from './components';
import { useGameState } from './useGameState';

const CI=({s=13})=><img src="/coin.svg" alt="coin" style={{width:s,height:s,verticalAlign:"middle",display:"inline-block",marginBottom:1}}/>;
const DI=({s=13})=><img src="/duky.svg" alt="duky" style={{width:s,height:Math.round(s*1.25),verticalAlign:"middle",display:"inline-block",marginBottom:1}}/>;

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function DuckFarm(){
  const {
    eggs, setEggs, coins, setCoins, duky, setDuky, feed, setFeed, syringes, setSyringes,
    water, setWater, adsToday, setAdsToday, tapsToday, setTapsToday,
    totalEggs, setTotalEggs, meds, setMeds, slots, setSlots, ducks, setDucks,
    plots, setPlots, seedInv, setSeedInv, upgrades, setUpgrades,
    socialClaimed, setSocialClaimed, nextId, setNextId,
    now, dailyTasks, setDailyTasks, taskClaimed, setTaskClaimed, tData, setTData, weeklyTData, setWeeklyTData,
    eps, mult, addFloat, floats, setFloats, progTask,
    achieved, claimAchievement, mineCount, setMineCount,
    cooking, setCooking, cookTimer, setCookTimer, breedSlot, setBreedSlot, breedRes, setBreedRes, breedBoost, setBreedBoost,
    feedDuck, startBreeding, plantSeed, harvestPlot, sendMining, claimMining, buySlot, handleUseMed,
    skipMining, skipBreeding, mineSkips, breedSkips,
    loginStreak, loginReward, offlineEarnings, claimLoginReward, claimOfflineEarnings,
    adCoinsToday, setAdCoinsToday, adSyrToday, setAdSyrToday,
    miningBoostUntil, setMiningBoostUntil,
  } = useGameState();

  const[selSeed,  setSelSeed]  =useState(null);
  const[selDuck,  setSelDuck]  =useState(null);
  const[tab,      setTab]      =useState("farm");
  const[sortBy,   setSortBy]   =useState("id");
  const[subTab,   setSubTab]   =useState("ducks");
  const[profilTab,setProfilTab]=useState("wallet");
  const[activeTier,setActiveTier]=useState(0);
  const[duckIdx,  setDuckIdx]  =useState(0);
  const[nicknameFor,setNicknameFor]=useState(null);
  const[nickInput,setNickInput]=useState("");
  const[skipFor,  setSkipFor]  =useState(null); 
  const[refInput, setRefInput] =useState("");
  const[refApplied,setRefApplied]=useState(false);
  const sliderRef = useRef(null);
  const touchStartX    = useRef(null);
  const mouseStartX    = useRef(null);
  const isDragging     = useRef(false);
  const labSliderRef   = useRef(null);
  const labTouchStartX = useRef(null);
  const labMouseStartX = useRef(null);
  const labIsDragging  = useRef(false);
  const [labDuckIdx,   setLabDuckIdx] = useState(0);
  const [frenzyCount, setFrenzyCount] = useState(0);
  const [isFrenzy, setIsFrenzy] = useState(false);
  const frenzyTimeoutRef = useRef(null);
  const [adPlaying,   setAdPlaying]   = useState(null);
  const [adCountdown, setAdCountdown] = useState(5);
  const [labTab,      setLabTab]      = useState("breed");
  const [shopTab,     setShopTab]     = useState("store");
  const [leagueSubTab,setLeagueSubTab]= useState("daily");
  const [tutorialStep,setTutorialStep]= useState(()=>!localStorage.getItem("duky_tutorialDone")?1:0);
  const [tabTutorial, setTabTutorial] = useState(null);
  const seenTabsRef = useRef(new Set(JSON.parse(localStorage.getItem("duky_seenTabs")||"[]")));
  const [animMap,setAnimMap]=useState({});
  const prevLvlsRef=useRef({});
  const mineTimersRef=useRef({});

  const scheduleNotif=useCallback(async(duckId,duckName,miningUntil)=>{
    if(!('Notification' in window)||Notification.permission==='denied')return;
    if(Notification.permission==='default'){
      const p=await Notification.requestPermission();
      if(p!=='granted')return;
    }
    if(mineTimersRef.current[duckId])clearTimeout(mineTimersRef.current[duckId]);
    const delay=miningUntil-Date.now();
    if(delay<=0)return;
    mineTimersRef.current[duckId]=setTimeout(()=>{
      new Notification('⛏️ Mining Complete!',{
        body:`${duckName} a terminat! Deschide Duky să revendici DUKY. 🎉`,
        icon:'/gangster.png'
      });
      delete mineTimersRef.current[duckId];
    },delay);
  },[]);

  useEffect(()=>{
    if(!('Notification' in window)||Notification.permission!=='granted')return;
    ducks.forEach(d=>{
      if(d.miningUntil&&d.miningUntil>Date.now()){
        const name=d.nickname||gR(d.rid)?.name||d.id;
        if(mineTimersRef.current[d.id])clearTimeout(mineTimersRef.current[d.id]);
        const delay=d.miningUntil-Date.now();
        mineTimersRef.current[d.id]=setTimeout(()=>{
          new Notification('⛏️ Mining Complete!',{body:`${name} a terminat! Revendică DUKY.`,icon:'/gangster.png'});
          delete mineTimersRef.current[d.id];
        },delay);
      }
    });
    return()=>{Object.values(mineTimersRef.current).forEach(clearTimeout);};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const triggerAnim=useCallback((duckId,type)=>{
    setAnimMap(m=>({...m,[duckId]:type}));
    setTimeout(()=>setAnimMap(m=>{const n={...m};delete n[duckId];return n;}),1000);
  },[]);

  useEffect(()=>{
    ducks.forEach(d=>{
      if(prevLvlsRef.current[d.id]!==undefined&&prevLvlsRef.current[d.id]<d.lvl){
        triggerAnim(d.id,'lvlup');
      }
      prevLvlsRef.current[d.id]=d.lvl;
    });
  },[ducks,triggerAnim]);

  const startAd = useCallback((onDone) => {
    setAdPlaying(() => onDone);
    setAdCountdown(5);
  }, []);

  useEffect(() => {
    if (!adPlaying) return;
    if (adCountdown <= 0) { adPlaying(); setAdPlaying(null); return; }
    const t = setTimeout(() => setAdCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [adPlaying, adCountdown]);

  // EPS și Mult sunt acum calculate în hook
  const miningCount=ducks.filter(d=>d.miningUntil&&d.miningUntil>now).length;
  const tiredCount=ducks.filter(d=>d.tired).length;
  const myScore=+(eps*60).toFixed(2);
  const allPlayers=[...tData.opponents,{id:"me",name:"Tu 🦆",score:myScore,rarityId:ducks.length>0?ducks.reduce((b,d)=>{const o=["common","rare","epic","legendary","mythic"];return o.indexOf(d.rid)>o.indexOf(b)?d.rid:b;},"common"):"common",isPlayer:true}].sort((a,b)=>b.score-a.score);
  const myRank=allPlayers.findIndex(p=>p.isPlayer)+1;

  useEffect(()=>{
    if(breedRes?.newId) {
      setTimeout(()=>setNicknameFor(breedRes.newId), 600);
    }
  }, [breedRes]);

  const skipCd=duckId=>{
    const duck=ducks.find(d=>d.id===duckId);if(!duck)return;
    const cost=gL(duck.lvl-1)?.skip||50;
    if(coins<cost){addFloat(`Need ${cost}🪙`,"#ef4444");return;}
    setCoins(c=>c-cost);setDucks(d=>d.map(dk=>dk.id===duckId?{...dk,lvlUpAt:null}:dk));
    addFloat("⏩ Skipped!","#4ade80");setSkipFor(null);
  };

  const claimTask=tid=>{
    const task=dailyTasks.find(t=>t.id===tid);
    if(!task||!task.done||taskClaimed[tid])return;
    const rw=task.rw;
    if(rw.t==="syr"){setSyringes(s=>s+rw.q);addFloat(`+${rw.q}💉`,"#a78bfa");}
    else if(rw.t==="med"){setMeds(m=>({...m,[rw.id]:(m[rw.id]||0)+rw.q}));addFloat(`+${rw.q}${rw.icon}`,"#4ade80");}
    else if(rw.t==="both"){setSyringes(s=>s+rw.syr);setMeds(m=>({...m,[rw.mid]:(m[rw.mid]||0)+rw.mq}));addFloat(`🎁 Reward!`,"#fbbf24");}
    else if(rw.t==="coins"){setCoins(c=>c+rw.q);addFloat(`+${rw.q}🪙`,"#fbbf24");}
    setTaskClaimed(prev=>({...prev,[tid]:true}));
  };

  const claimSocial=platform=>{
    if(socialClaimed[platform])return;
    setSocialClaimed(s=>({...s,[platform]:true}));
    if(platform==="instagram"){setSlots(s=>Math.min(s+1,8));addFloat("📸 +1 Slot!","#e1306c");}
    else if(platform==="youtube"){setMeds(m=>({...m,recovery:(m.recovery||0)+3,breedboost:(m.breedboost||0)+1}));addFloat("▶️ +3💊+1⚡","#ff0000");}
    else if(platform==="twitter"){setCoins(c=>c+500);addFloat("🐦 +500🪙","#1d9bf0");}
    else if(platform==="tiktok"){setCoins(c=>c+300);addFloat("🎵 +300🪙","#fe2c55");}
  };

  const completedCount=dailyTasks.filter(t=>t.done).length;
  const claimedCount=dailyTasks.filter(t=>taskClaimed[t.id]).length;
  
  const displayDucks = useMemo(() => {
    return [...ducks].sort((a, b) => {
      if (sortBy === "rarity") {
        const rIdx = r => RARITIES.findIndex(x => x.id === r);
        return rIdx(b.rid) - rIdx(a.rid);
      }
      if (sortBy === "lvl") return b.lvl - a.lvl;
      return 0;
    });
  }, [ducks, sortBy]);

  const handleSliderScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    if (width > 0) {
      const newIdx = Math.round(scrollLeft / width);
      if (newIdx !== duckIdx) setDuckIdx(newIdx);
    }
  };

  const scrollToIdx = (idx) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: idx * sliderRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const totalCards = displayDucks.length + (slots < 8 ? 1 : 0);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) scrollToIdx(Math.min(duckIdx + 1, totalCards - 1));
    else           scrollToIdx(Math.max(duckIdx - 1, 0));
  };

  const handleMouseDown = (e) => { mouseStartX.current = e.clientX; isDragging.current = true; };
  const handleMouseMove = (e) => { if (isDragging.current) e.preventDefault(); };
  const handleMouseUp   = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (mouseStartX.current === null) return;
    const delta = mouseStartX.current - e.clientX;
    mouseStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) scrollToIdx(Math.min(duckIdx + 1, totalCards - 1));
    else           scrollToIdx(Math.max(duckIdx - 1, 0));
  };
  const handleMouseLeave = () => { isDragging.current = false; mouseStartX.current = null; };

  const labScrollToIdx = (idx) => {
    if (labSliderRef.current)
      labSliderRef.current.scrollTo({ left: idx * labSliderRef.current.clientWidth, behavior:"smooth" });
  };
  const handleLabScroll = (e) => {
    const idx = Math.round(e.target.scrollLeft / e.target.clientWidth);
    if (idx !== labDuckIdx) { setLabDuckIdx(idx); setSelDuck(ducks[idx] || null); }
  };
  const handleLabTouchStart  = (e) => { labTouchStartX.current = e.touches[0].clientX; };
  const handleLabTouchEnd    = (e) => {
    if (labTouchStartX.current === null) return;
    const delta = labTouchStartX.current - e.changedTouches[0].clientX;
    labTouchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    const next = delta > 0 ? Math.min(labDuckIdx+1, ducks.length-1) : Math.max(labDuckIdx-1, 0);
    labScrollToIdx(next); setLabDuckIdx(next); setSelDuck(ducks[next]||null);
  };
  const handleLabMouseDown   = (e) => { labMouseStartX.current = e.clientX; labIsDragging.current = true; };
  const handleLabMouseMove   = (e) => { if (labIsDragging.current) e.preventDefault(); };
  const handleLabMouseUp     = (e) => {
    if (!labIsDragging.current) return;
    labIsDragging.current = false;
    const delta = labMouseStartX.current - e.clientX;
    labMouseStartX.current = null;
    if (Math.abs(delta) < 40) return;
    const next = delta > 0 ? Math.min(labDuckIdx+1, ducks.length-1) : Math.max(labDuckIdx-1, 0);
    labScrollToIdx(next); setLabDuckIdx(next); setSelDuck(ducks[next]||null);
  };
  const handleLabMouseLeave  = () => { labIsDragging.current = false; labMouseStartX.current = null; };

  const TABS=[
    {id:"farm",  icon:"🌾",label:"Farm"},
    {id:"lab",   icon:"🧬",label:"Lab"},
    {id:"cook",  icon:"🍳",label:"Kitchen"},
    {id:"shop",  icon:"🏪",label:"Shop"},
    {id:"league",icon:"🏆",label:"League"},
  ];

  const TAB_TUTORIALS={
    farm:{icon:"🌾",title:"Farm",tips:[
      "This is where your ducks live — feed them 🌾 to gain XP and level up.",
      "Ducks produce eggs automatically based on their rarity and level.",
      "Plant seeds 🌱 in your plots to generate feed over time.",
      "Send level 7 ducks to mining ⛏️ to earn DUKY tokens.",
      "The DUKY sub-tab lets you tap for bonus eggs with a multiplier.",
    ]},
    lab:{icon:"🧬",title:"Lab",tips:[
      "Breed two ducks together to try to get a rarer one.",
      "Each breeding procedure costs syringes 💉 — stock up in the Shop.",
      "The rarer the duck, the lower the chance of upgrading its rarity.",
      "A duck in breeding cannot produce eggs or go mining.",
      "The Clinic heals tired ducks instantly using Recovery Pills 💊.",
    ]},
    cook:{icon:"🍳",title:"Kitchen",tips:[
      "Cook recipes using eggs to earn Coins 🪙.",
      "Higher tier recipes consume more eggs but reward more coins.",
      "Only one recipe can be cooked at a time — plan carefully!",
      "Tier 4 (Royal) recipes are the most valuable in the game.",
    ]},
    shop:{icon:"🏪",title:"Shop",tips:[
      "Buy syringes 💉, medicines 💊 and seeds 🌱 using Coins.",
      "Unlock new duck slots to expand your farm.",
      "Premium Boosts double DUKY from mining or breeding success chance.",
      "Hatch Eggs lets you get rare ducks directly, without breeding RNG.",
      "Watch free ads daily to earn bonus Coins and Syringes.",
    ]},
    league:{icon:"🏆",title:"League",tips:[
      "Daily tournaments reward syringes, medicines and seeds.",
      "The Weekly tournament is the big event — 1st place wins a Mythic duck! 🦆",
      "Your score is based on the eggs your ducks produce during the period.",
      "The rarer and higher level your ducks, the higher your score.",
    ]},
  };

  const handleTabChange = (id) => {
    setTab(id);
    if(!seenTabsRef.current.has(id)){
      seenTabsRef.current.add(id);
      localStorage.setItem("duky_seenTabs", JSON.stringify([...seenTabsRef.current]));
      setTabTutorial(id);
    }
  };


  const renderLoginModal = () => {
    if (!loginReward) return null;
    const dayIdx = (loginReward.streakCount - 1) % 7;
    return (
      <div style={S.modalBg}>
        <div style={{position:"relative",top:"12%",width:320,margin:"auto",padding:"0 12px"}}>
          <G glow="#fbbf24" style={{borderColor:"rgba(251,191,36,0.45)"}}>
            <div style={{textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:34}}>🔥</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:700,color:"#fbbf24",marginTop:4}}>
                DAY {loginReward.streakCount} STREAK
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:3}}>Come back daily for bigger rewards!</div>
            </div>

            {/* Grila 7 zile */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:14}}>
              {STREAK_REWARDS.map((r,i)=>{
                const isCurrent=i===dayIdx;
                const isPast=i<dayIdx;
                return(
                  <div key={i} style={{
                    background:isCurrent?"rgba(251,191,36,0.18)":isPast?"rgba(74,222,128,0.1)":"rgba(99,102,241,0.07)",
                    border:`2px solid ${isCurrent?"#fbbf24":isPast?"#4ade80":"rgba(99,102,241,0.2)"}`,
                    borderRadius:10,padding:"6px 2px",textAlign:"center",
                    boxShadow:isCurrent?"0 0 12px rgba(251,191,36,0.35)":"none"
                  }}>
                    <div style={{fontSize:isCurrent?17:13,lineHeight:1}}>{isPast?"✅":r.icon}</div>
                    <div style={{fontSize:7,color:isCurrent?"#fbbf24":isPast?"#4ade80":"rgba(255,255,255,0.35)",marginTop:3,fontWeight:700}}>D{i+1}</div>
                  </div>
                );
              })}
            </div>

            {/* Recompensa de azi */}
            <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:12,padding:"12px",textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:4}}>Today's reward</div>
              <div style={{fontSize:28,margin:"4px 0"}}>{loginReward.icon}</div>
              <div style={{fontWeight:700,color:"#fbbf24",fontSize:13}}>{loginReward.label}</div>
            </div>

            <button style={{...S.btn,width:"100%",background:"linear-gradient(135deg,#78350f,#fbbf24)",fontSize:13,padding:"10px"}}
              onClick={claimLoginReward}>
              🎁 Claim Reward
            </button>
          </G>
        </div>
      </div>
    );
  };

  const renderOfflineModal = () => {
    if (!offlineEarnings || loginReward) return null;
    const h=Math.floor(offlineEarnings.seconds/3600);
    const m=Math.floor((offlineEarnings.seconds%3600)/60);
    const timeStr=h>0?`${h}h ${m}m`:`${m}m`;
    return (
      <div style={S.modalBg}>
        <div style={{position:"relative",top:"22%",width:290,margin:"auto",padding:"0 12px"}}>
          <G glow="#4ade80" style={{borderColor:"rgba(74,222,128,0.4)"}}>
            <div style={{textAlign:"center",marginBottom:10}}>
              <div style={{fontSize:36}}>💤</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,color:"#4ade80",marginTop:5}}>WELCOME BACK!</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:4}}>
                You were away for <b style={{color:"#fbbf24"}}>{timeStr}</b>
              </div>
            </div>

            <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:12,padding:"14px",textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:6}}>Your ducks worked hard!</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:28,fontWeight:700,color:"#4ade80"}}>
                +{offlineEarnings.eggs} 🥚
              </div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:5}}>Capped at 4 hours max offline production</div>
            </div>

            <button style={{...S.btn,width:"100%",background:"linear-gradient(135deg,#166534,#4ade80)",fontSize:13,padding:"10px"}}
              onClick={claimOfflineEarnings}>
              🥚 Collect Eggs
            </button>
          </G>
        </div>
      </div>
    );
  };

  const renderNicknameModal = () => {
    if (!nicknameFor) return null;
    const duck = ducks.find(d => d.id === nicknameFor);
    if (!duck) return null;
    const r = gR(duck.rid);
    return (
      <div style={S.modalBg} onClick={() => setNicknameFor(null)}>
        <div style={{position:"relative",top:"25%",width:300,margin:"auto"}} onClick={e => e.stopPropagation()}>
          <G glow={r.glow}>
            <div style={{textAlign:"center",marginBottom:10}}>
              <Duck breedId={duck.bid} duckId={duck.id} size={88} lvl={duck.lvl} animType={animMap[duck.id]}/>
              <div style={{fontWeight:700,fontSize:14,color:r.color,marginTop:6}}>Give a nickname!</div>
            </div>
            <input autoFocus value={nickInput} onChange={e => setNickInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && nickInput.trim()) {
                  setDucks(d => d.map(dk => dk.id === nicknameFor ? {...dk, nickname: nickInput.trim()} : dk));
                  addFloat(`🦆 "${nickInput.trim()}" set!`, "#4ade80");
                  setNicknameFor(null); setNickInput("");
                }
              }}
              placeholder="Ex: Lucky Duck..." maxLength={20}
              style={{width:"100%",background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:10,padding:"9px 11px",color:"#e2e8f0",fontFamily:"'Exo 2',sans-serif",fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:9}}/>
            <div style={{display:"flex",gap:8}}>
              <button style={{...S.btn,flex:1,background:"linear-gradient(135deg,#166534,#4ade80)"}} onClick={() => {
                if (nickInput.trim()) {
                  setDucks(d => d.map(dk => dk.id === nicknameFor ? {...dk, nickname: nickInput.trim()} : dk));
                  addFloat("🦆 Saved!", "#4ade80");
                  setNicknameFor(null); setNickInput("");
                }
              }}>✅ Save</button>
              <button style={{...S.btn,flex:1,background:"rgba(99,102,241,0.15)"}} onClick={() => setNicknameFor(null)}>Cancel</button>
            </div>
          </G>
        </div>
      </div>
    );
  };;
  const renderSkipModal = () => {
    if (!skipFor) return null;
    const duck = ducks.find(d => d.id === skipFor);
    if (!duck) return null;
    const rem = duck.lvlUpAt ? Math.max(0, duck.lvlUpAt - Math.floor(now/1000)) : 0;
    const cost = gL(Math.max(duck.lvl - 1, 1))?.skip || 50;
    return (
      <div style={S.modalBg} onClick={() => setSkipFor(null)}>
        <div style={{position:"relative",top:"30%",width:280,margin:"auto"}} onClick={e => e.stopPropagation()}>
          <G>
            <div style={{fontWeight:700,fontSize:14,color:"#a78bfa",marginBottom:8}}>⏳ Cooldown</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:12}}>
              Time left: <b style={{color:"#fbbf24"}}>{fT(rem)}</b>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{...S.btn,flex:1,opacity:coins>=cost?1:0.4}} onClick={() => skipCd(skipFor)}><CI/> {cost} Skip</button>
              <button style={{...S.btn,flex:1,background:"rgba(99,102,241,0.15)"}} onClick={() => setSkipFor(null)}>Wait</button>
            </div>
          </G>
        </div>
      </div>
    );
  };;
  const renderBreedPanel = () => {
    if (!selDuck) return null;
    const duck = ducks.find(d => d.id === selDuck.id);
    if (!duck) return null;
    const r = gR(duck.rid);
    const nR = gNR(duck.rid);
    if (!nR) return (
      <G><div style={{textAlign:"center",color:"#f0abfc",fontSize:12}}>🌟 Max rarity reached!</div></G>
    );
    if (duck.tired) return (
      <G><div style={{textAlign:"center",color:"#ef4444",fontSize:12}}>😴 Take the duck to Clinic first!</div></G>
    );
    if (duck.miningUntil && duck.miningUntil > now) return (
      <G><div style={{textAlign:"center",color:"#f0abfc",fontSize:12}}>⛏️ Mining! Please wait.</div></G>
    );
    if (duck.lvlUpAt && duck.lvlUpAt > Math.floor(now/1000)) return (
      <G><div style={{textAlign:"center",color:"#fbbf24",fontSize:12}}>⭐ Leveling up! {fT(duck.lvlUpAt-Math.floor(now/1000))}</div></G>
    );
    if (duck.breedCdUntil && duck.breedCdUntil > Math.floor(now/1000)) return (
      <G><div style={{textAlign:"center",color:"#fbbf24",fontSize:12}}>⏳ Cooldown: {fT(duck.breedCdUntil-Math.floor(now/1000))}</div></G>
    );
    const pct = r.breedChance * (breedBoost ? 2 : 1) * 100;
    const pc = pct>=50 ? "#4ade80" : pct>=10 ? "#fbbf24" : "#ef4444";
    return (
      <G style={{borderColor:`${r.color}44`}} glow={r.glow}>
        <div style={{fontWeight:700,color:r.color,marginBottom:7,fontSize:13}}>{r.name} → {nR.name}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:9}}>
          {[["🎯 Chance",`${Math.min(pct,100).toFixed(0)}%`,pc],["💉 Cost",`${nR.syrCost} syr.`,"#a78bfa"],["⏱ Incub.",`${nR.incub}s`,"#38bdf8"],["💉 Own",syringes,syringes>=nR.syrCost?"#4ade80":"#ef4444"]].map(([l,v,c])=>(
            <div key={l} style={{background:"rgba(99,102,241,0.07)",borderRadius:8,padding:"5px 8px"}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>{l}</div>
              <div style={{color:c,fontWeight:700,fontFamily:"'Orbitron',sans-serif",fontSize:12}}>{v}</div>
            </div>
          ))}
        </div>
        <button style={{...S.breedBtn,opacity:!breedSlot&&syringes>=nR.syrCost?1:0.4,background:`linear-gradient(135deg,#4c1d95,${nR.color})`}} onClick={()=>{startBreeding(duck.id);setSelDuck(null);}}>💉 Start Breeding</button>
      </G>
    );
  };

  const renderTournamentReward = () => {
    const reward = TREWARD(myRank);
    const ended = tData.endTime <= now;
    const hasSeed = reward.seeds && (reward.seeds.legendary+reward.seeds.medium+reward.seeds.basic)>0;
    const seedLabel = reward.seeds
      ? [reward.seeds.legendary>0&&`${reward.seeds.legendary}🌻`,reward.seeds.medium>0&&`${reward.seeds.medium}🌽`,reward.seeds.basic>0&&`${reward.seeds.basic}🌾`].filter(Boolean).join(" ")
      : "";
    const hasReward = reward.duky>0||reward.syr>0||reward.med>0||hasSeed;
    return (
      <G style={{borderColor:`${reward.color}44`,background:`${reward.color}08`}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:30}}>{myRank===1?"🥇":myRank<=3?"🥇":myRank<=10?"🥈":myRank<=25?"🥉":myRank<=50?"😅":"💪"}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13,color:reward.color}}>{reward.label} — Rank #{myRank}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>
              {reward.duky>0&&<span style={{display:"inline-flex",alignItems:"center",gap:3}}><DI s={13}/> {reward.duky} DUKY  </span>}
              {reward.syr>0&&<span>💉×{reward.syr}  </span>}
              {reward.med>0&&<span>💊×{reward.med}  </span>}
              {hasSeed&&<span>🌱 {seedLabel}</span>}
              {!hasReward&&<span>Participation</span>}
            </div>
          </div>
          {ended && !tData.claimed && hasReward && (
            <button style={{...S.btn,background:`linear-gradient(135deg,#78350f,${reward.color})`}} onClick={()=>{
              if(reward.duky>0){setDuky(v=>+(v+reward.duky).toFixed(4));addFloat(`+${reward.duky}💎 DUKY`,"#f0abfc");}
              if(reward.syr>0){setSyringes(s=>s+reward.syr);addFloat(`+${reward.syr}💉`,"#a78bfa");}
              if(reward.med>0){setMeds(m=>({...m,recovery:(m.recovery||0)+reward.med}));addFloat(`+${reward.med}💊`,"#4ade80");}
              if(hasSeed){
                setSeedInv(inv=>({
                  ...inv,
                  legendary:(inv.legendary||0)+(reward.seeds.legendary||0),
                  medium:(inv.medium||0)+(reward.seeds.medium||0),
                  basic:(inv.basic||0)+(reward.seeds.basic||0),
                }));
                addFloat(`🌱 ${seedLabel}`,"#4ade80");
              }
              setTData(t=>({...t,claimed:true}));
              addFloat(`🏆 Rank ${myRank}!`,"#fbbf24");
            }}>🎁 Claim</button>
          )}
          {tData.claimed && <B color="#4ade80" size={10}>✅</B>}
          {!ended && <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>At the end</div>}
        </div>
      </G>
    );
  };

  const renderWatchTask = () => {
    const wt=dailyTasks.find(t=>t.type==="watch");
    if(!wt||taskClaimed[wt.id])return null;
    const vw=wt.progress||0;
    return(
              <G style={{borderColor:"rgba(251,191,36,0.3)",background:"rgba(251,191,36,0.04)"}}>
                <div style={{fontWeight:700,fontSize:12,color:"#fbbf24",marginBottom:3}}>📺 Watch Videos</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:6}}>{vw}/10 · +1<CI/> per ad</div>
                <PB pct={(vw/10)*100} color="linear-gradient(90deg,#78350f,#fbbf24)" h={5}/>
                <button style={{...S.btn,width:"100%",marginTop:7,background:"linear-gradient(135deg,#78350f,#fbbf24)",opacity:vw<10?1:0.4}}
                  onClick={()=>{if(vw>=10)return;startAd(()=>{progTask("watch",1);setCoins(c=>c+1);addFloat("+1🪙 Video!","#fbbf24");});}}>
                  📺 Watch Ad (+1<CI/>)
                </button>
              </G>
            );
  };

  const renderAdModal = () => {
    if (!adPlaying) return null;
    const pct = ((5 - adCountdown) / 5) * 100;
    return (
      <div style={S.modalBg}>
        <div style={{position:"relative",top:"25%",width:300,margin:"auto",padding:"0 14px"}}>
          <div style={{background:"rgba(6,6,15,0.98)",border:"1px solid rgba(99,102,241,0.35)",borderRadius:18,padding:"28px 20px",textAlign:"center",boxShadow:"0 0 40px rgba(0,0,0,0.6)"}}>
            <div style={{fontSize:44,marginBottom:10}}>📺</div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,color:"#a78bfa",marginBottom:6}}>AD PLAYING</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:16}}>Please wait — your reward is coming!</div>
            <div style={{background:"rgba(99,102,241,0.08)",borderRadius:12,height:8,overflow:"hidden",marginBottom:12}}>
              <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#6366f1,#a78bfa)",borderRadius:12,transition:"width 0.9s linear"}}/>
            </div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:28,fontWeight:900,color:adCountdown<=2?"#4ade80":"#fbbf24"}}>
              {adCountdown > 0 ? `${adCountdown}s` : "✅"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTutorial = () => {
    if(tutorialStep===0)return null;
    const steps=[
      {icon:"🦆",title:"Welcome to DUCKFARM!",    text:"Your ducks produce eggs automatically — even while you're offline! The rarer the duck, the more it produces."},
      {icon:"🌾",title:"Feed & Level Up",          text:"Feed your ducks to gain XP and reach Level 7. Every level up earns DUKY tokens!"},
      {icon:"🧬",title:"Breed Rarer Ducks",        text:"In the Lab, use syringes to breed ducks into rarer ones — Common → Rare → Epic → Legendary → Mythic!"},
      {icon:"⛏️",title:"Mine DUKY Tokens",         text:"Level 7 ducks can mine DUKY — the game's crypto token. Accumulate as much as possible before the airdrop!"},
    ];
    const step=steps[tutorialStep-1];
    const isLast=tutorialStep===steps.length;
    return(
      <div style={S.modalBg}>
        <div style={{position:"relative",top:"12%",width:310,margin:"auto",padding:"0 14px"}}>
          <div style={{background:"rgba(6,6,15,0.97)",border:"1px solid rgba(99,102,241,0.45)",borderRadius:18,padding:"22px 18px",boxShadow:"0 0 40px rgba(99,102,241,0.2)"}}>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
              <button style={{background:"none",border:"none",color:"rgba(255,255,255,0.25)",cursor:"pointer",fontSize:11,fontFamily:"'Exo 2',sans-serif"}}
                onClick={()=>{setTutorialStep(0);localStorage.setItem("duky_tutorialDone","1");}}>Skip</button>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:52,marginBottom:12}}>{step.icon}</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:700,color:"#a78bfa",marginBottom:10}}>{step.title}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.75,marginBottom:18}}>{step.text}</div>
              <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:18}}>
                {steps.map((_,i)=>(
                  <div key={i} style={{width:i===tutorialStep-1?22:7,height:7,borderRadius:99,background:i===tutorialStep-1?"#a78bfa":i<tutorialStep-1?"#4ade80":"rgba(255,255,255,0.15)",transition:"all .3s"}}/>
                ))}
              </div>
              <button style={{...S.btn,width:"100%",background:"linear-gradient(135deg,#312e81,#6366f1)",fontSize:14,padding:"12px"}}
                onClick={()=>{if(isLast){setTutorialStep(0);localStorage.setItem("duky_tutorialDone","1");}else setTutorialStep(s=>s+1);}}>
                {isLast?"🎮 Let's Play!":"Next →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    return (
      <div style={S.col}>
        <G style={{borderColor:"rgba(240,171,252,0.25)",background:"linear-gradient(135deg,rgba(76,29,149,0.1),rgba(6,6,20,0.5))"}}>
           <div style={{fontWeight:700,fontSize:13,color:"#f0abfc",fontFamily:"'Orbitron',sans-serif",marginBottom:5}}>🏆 ACHIEVEMENTS</div>
           <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Complete milestones to earn DUKY rewards.</div>
        </G>
        {ACHIEVEMENTS_TPL.map(ach => {
          const claimed = !!achieved[ach.id];
          // Logica de progres pentru fiecare tip
          let current = 0;
          if (ach.id.startsWith("eggs")) current = totalEggs;
          if (ach.id.startsWith("ducks")) current = ducks.length;
          if (ach.id === "lvl_max") current = ducks.some(d => d.lvl >= 7) ? 1 : 0;
          if (ach.id === "mine_pro") current = mineCount;
          if (ach.id === "breed_epic") current = ducks.some(d => d.rid === "epic" || d.rid === "legendary" || d.rid === "mythic") ? 1 : 0;

          const isDone = current >= ach.target;
          return (
            <G key={ach.id} style={{opacity: claimed ? 0.6 : 1, borderColor: isDone && !claimed ? "#fbbf24" : "rgba(99,102,241,0.1)"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:24,filter: isDone ? "none" : "grayscale(1)"}}>{ach.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:12,color: isDone ? "#e2e8f0" : "rgba(226,232,240,0.5)"}}>{ach.title}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{ach.desc}</div>
                  {!claimed && <PB pct={Math.min((current/ach.target)*100, 100)} color={isDone ? "#fbbf24" : "#6366f1"} h={3} style={{marginTop:4}} />}
                </div>
                <button style={{...S.btn, padding: "5px 10px", background: claimed ? "rgba(255,255,255,0.1)" : isDone ? "linear-gradient(135deg,#78350f,#fbbf24)" : "rgba(99,102,241,0.1)", opacity: isDone || claimed ? 1 : 0.4}} 
                        onClick={() => isDone && !claimed && claimAchievement(ach.id)}>{claimed ? "✅" : <><DI s={11}/> {ach.reward}</>}</button>
              </div>
            </G>
          );
        })}
      </div>
    );
  };

  return(
    <div style={S.root}>

      {/* Scanline */}
      <div style={{position:"fixed",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(99,102,241,0.012) 2px,rgba(99,102,241,0.012) 4px)",pointerEvents:"none",zIndex:1}}></div>
      {/* Background depth glow */}
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 90% 45% at 50% 0%,rgba(99,102,241,0.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}></div>

      {/* Floats */}
      <div style={S.floatWrap}>{floats.map(f=><div key={f.id} style={{...S.float,color:f.color}}>{f.text}</div>)}</div>

      {/* Ad modal */}
      {renderAdModal()}

      {/* Tutorial — prima deschidere */}
      {renderTutorial()}

      {/* Tab tutorial overlay */}
      {tabTutorial&&TAB_TUTORIALS[tabTutorial]&&(()=>{const t=TAB_TUTORIALS[tabTutorial];return(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"rgba(10,10,28,0.98)",border:"1px solid rgba(99,102,241,0.4)",borderRadius:20,padding:"24px 20px",maxWidth:340,width:"100%",boxShadow:"0 0 40px rgba(99,102,241,0.25)"}}>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:36,marginBottom:6}}>{t.icon}</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:16,fontWeight:900,color:"#a78bfa",letterSpacing:2}}>{t.title}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
              {t.tips.map((tip,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:20,height:20,borderRadius:99,background:"rgba(99,102,241,0.2)",border:"1px solid rgba(99,102,241,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#a78bfa",flexShrink:0,marginTop:1}}>{i+1}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.8)",lineHeight:1.5}}>{tip}</div>
                </div>
              ))}
            </div>
            <button style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#6366f1,#a78bfa)",border:"none",borderRadius:12,color:"#fff",fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:1}}
              onClick={()=>setTabTutorial(null)}>Am înțeles! 👍</button>
          </div>
        </div>
      );})()}

      {/* Login streak modal */}
      {renderLoginModal()}

      {/* Offline earnings modal */}
      {renderOfflineModal()}

      {/* Nickname modal */}
      {renderNicknameModal()}

      {/* Skip modal */}
      {renderSkipModal()}

      {/* Header */}
      <div style={S.header}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
          <div style={S.logo}><span style={{color:"#6366f1"}}>DUCK</span><span style={{color:"#a78bfa"}}>FARM</span></div>
          <div style={{fontSize:11,color:"rgba(99,102,241,0.6)",fontFamily:"'Exo 2',sans-serif"}}>⚡ {(eps*60).toFixed(2)} eggs/min</div>
        </div>
        <div style={S.statsRow}>
          {[
            {e:"🥚",v:Math.floor(eggs),c:"#fbbf24"},
            {e:null,img:"/coin.svg",v:Math.floor(coins),c:"#ffd700"},
            {e:null,img:"/duky.svg",v:fD(duky),c:"#f0abfc"},
            {e:"🌾",v:Math.floor(feed),c:"#4ade80"},
          ].map(({e,img,v,c})=>(
            <div key={img||e} style={{...S.chip,borderColor:`${c}28`,background:`${c}0d`}}>
              {img?<img src={img} alt="coin" style={{width:15,height:15,display:"block"}}/>:<span style={{fontSize:12}}>{e}</span>}
              <span style={{fontSize:11,fontWeight:700,color:c,fontFamily:"'Orbitron',sans-serif"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {TABS.map(t=>(
          <button key={t.id} style={{...S.tab,...(tab===t.id?S.tabOn:{})}} onClick={()=>handleTabChange(t.id)}>
            <div style={{fontSize:14,position:"relative",filter:tab===t.id?"drop-shadow(0 0 5px #a78bfa)":"none",transition:"filter .25s"}}>
              {t.icon}
              {t.id==="lab"&&tiredCount>0&&<span style={{position:"absolute",top:-5,right:-7,background:"#ef4444",color:"#fff",fontSize:7,borderRadius:99,padding:"1px 3px",fontWeight:700}}>{tiredCount}</span>}
              {t.id==="shop"&&completedCount>claimedCount&&<span style={{position:"absolute",top:-5,right:-7,background:"#fbbf24",color:"#000",fontSize:7,borderRadius:99,padding:"1px 3px",fontWeight:700}}>{completedCount-claimedCount}</span>}
            </div>
            <div style={{fontSize:8}}>{t.label}</div>
          </button>
        ))}
      </div>

      <div style={S.content}>

        {/* ═══ FARM ═══ */}
        {tab==="farm"&&(
          <div style={S.col}>
            <div style={{display:"flex",gap:7}}>
              {[["ducks","🦆 Ducks"],["plants","🌱 Crops"],["tap","🐣 DUKY"]].map(([st,lb])=>(
                <button key={st} style={{...S.subTab,...(subTab===st?S.subOn:{})}} onClick={()=>setSubTab(st)}>{lb}</button>
              ))}
            </div>

            {subTab==="ducks"&&(
              <div style={S.col}>
                {/* Sorting Controls */}
                <div style={{display:"flex", gap:6, alignItems:"center", marginBottom:4, justifyContent:"center"}}>
                  {[["id","🆕"],["rarity","💎"],["lvl","⭐"]].map(([mode,icon])=>(
                    <button key={mode} onClick={()=>setSortBy(mode)} style={{...S.smallBtn, background:sortBy===mode?"#6366f1":"rgba(99,102,241,0.1)", border:sortBy===mode?"1px solid #a78bfa":"1px solid rgba(99,102,241,0.2)"}}>{icon}</button>
                  ))}
                </div>

                <div ref={sliderRef} style={{...S.duckSlider,cursor:isDragging.current?"grabbing":"grab"}} onScroll={handleSliderScroll} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
                  {displayDucks.length === 0 && (
                    <div style={{...S.duckCard, padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)"}}>
                      No ducks yet. Use the Lab!
                    </div>
                  )}
                  {displayDucks.map((duck) => {
                    const r=gR(duck.rid);
                    const mining=duck.miningUntil&&duck.miningUntil>now;
                    const mDone=duck.miningUntil&&duck.miningUntil<=now;
                    const onCd=duck.lvlUpAt&&duck.lvlUpAt>Math.floor(now/1000);
                    const isBreeding=breedSlot&&breedSlot.did===duck.id;
                    return (
                      <div key={duck.id} style={S.duckCard}>
                        <G style={{background:`linear-gradient(160deg,${r.color}1a,rgba(6,6,20,0.97))`,borderColor:`${r.color}35`,padding:"16px"}} glow={r.glow}>
                          <div style={{textAlign:"center", marginBottom:10}}>
                            <div style={{fontWeight:700,color:r.color,fontSize:14}}>{duck.nickname||r.name}</div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Lvl {duck.lvl} · {r.name}</div>
                            {isBreeding&&<div style={{marginTop:4,fontSize:9,color:"#a78bfa",fontWeight:700,letterSpacing:1}}>🧬 BREEDING — {fT(Math.max(0,Math.ceil((breedSlot.endsAt-now)/1000)))}</div>}
                          </div>
                          <div style={{display:"flex", justifyContent:"center"}}>
                            <Duck breedId={duck.bid} duckId={duck.id} size={190} tired={duck.tired} mining={!!mining} cooldown={!!onCd} lvl={duck.lvl} animType={animMap[duck.id]}/>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginTop:10}}>
                            {[["🥚/min",((r?.eggRate||0)*(duck.tired?0.4:1)*mult*60).toFixed(2)],["🌾/feed",gL(duck.lvl).fpf||"—"],["$/lvl",fD(DUKY_R[duck.rid]||0.001)]].map(([l,v])=>(
                              <div key={l} style={{background:"rgba(99,102,241,0.08)",borderRadius:10,padding:"7px 5px",textAlign:"center"}}>
                                <div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>{l}</div>
                                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700}}>{v}</div>
                              </div>
                            ))}
                          </div>
                          {duck.lvl<7&&!onCd&&(
                            <div style={{width:"100%", marginTop:10}}>
                              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"rgba(255,255,255,0.35)",marginBottom:3}}>
                                <span>XP  Lvl {duck.lvl} → {duck.lvl+1}</span>
                                <span style={{color:gLC(duck.lvl),fontWeight:700}}>{duck.xp} / {gL(duck.lvl).xp}</span>
                              </div>
                              <PB pct={(duck.xp/gL(duck.lvl).xp)*100} color={`linear-gradient(90deg,${gLC(duck.lvl)},${gLC(Math.min(duck.lvl+1,7))})`} h={6}/>
                            </div>
                          )}
                          {onCd&&(
                            <div style={{marginTop:10,textAlign:"center",background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.18)",borderRadius:12,padding:"10px 8px"}}>
                              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:4}}>⭐ Lvl {duck.lvl} unlock cooldown</div>
                              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:"#fbbf24",letterSpacing:2}}>{fT(duck.lvlUpAt-Math.floor(now/1000))}</div>
                              <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",marginTop:4}}>Producing eggs · Cannot breed</div>
                            </div>
                          )}
                          <div style={{display:"flex",gap:7,marginTop:10}}>
                            {!duck.tired&&!mining&&!onCd&&duck.lvl<7&&<button style={{...S.actionBtn,flex:1,background:"linear-gradient(135deg,#14532d,#4ade80)",opacity:feed>=gL(duck.lvl).fpf?1:0.4}} onClick={()=>{triggerAnim(duck.id,'feed');feedDuck(duck.id);}}>🌾 Feed ({gL(duck.lvl).fpf})</button>}
                            {duck.tired&&(meds.recovery>0)&&<button style={{...S.actionBtn,flex:1,background:"linear-gradient(135deg,#7f1d1d,#ef4444)"}} onClick={()=>{triggerAnim(duck.id,'heal');handleUseMed(duck.id,"recovery");setSelDuck(null);}}>💊 Treat</button>}
                            {mDone&&<button style={{...S.actionBtn,flex:1,background:"linear-gradient(135deg,#78350f,#fbbf24)"}} onClick={()=>claimMining(duck.id)}>🎁 Claim</button>}
                            {mining&&!mDone&&<button style={{...S.actionBtn,flex:1,background:"rgba(251,191,36,0.15)",border:"1px solid rgba(251,191,36,0.4)",fontSize:10}} onClick={()=>skipMining(duck.id)}>⏩ Skip <CI s={10}/>{(mineSkips+1)*10}</button>}
                            {duck.lvl===7&&!duck.tired&&!mining&&miningCount<MAX_MINE&&breedSlot?.did!==duck.id&&<button style={{...S.actionBtn,flex:1,background:"linear-gradient(135deg,#4c1d95,#f0abfc)"}} onClick={()=>{sendMining(duck.id);scheduleNotif(duck.id,duck.nickname||r.name,Date.now()+MINE_SECS*1000);setSelDuck(null);}}>⛏️ Mine</button>}
                            <button style={{...S.actionBtn,background:"rgba(99,102,241,0.2)",padding:"7px 10px"}} onClick={()=>{setNicknameFor(duck.id);setNickInput(duck.nickname||"");}}>✏️</button>
                          </div>
                        </G>
                      </div>
                    )
                  })}
                  {slots < 8 && (
                    <div style={{...S.duckCard, justifyContent:"center"}}>
                      <G style={{background:"rgba(99,102,241,0.05)", border:"2px dashed rgba(99,102,241,0.3)", padding:40, textAlign:"center", cursor:"pointer"}} onClick={buySlot}>
                        <div style={{fontSize:40, marginBottom:10}}>🔓</div>
                        <div style={{fontWeight:700, color:"#a78bfa"}}>Buy Slot {slots+1}</div>
                        <div style={{fontSize:12, color:"#fbbf24", marginTop:5}}><CI/> {SLOT_COSTS[slots]}</div>
                      </G>
                    </div>
                  )}
                </div>

                {ducks.length > 0 && (
                  <div style={{display:"flex",gap:5,justifyContent:"center", marginTop:-5}}>
                    {Array.from({length: ducks.length + (slots<8?1:0)}).map((_,i)=>(
                      <div key={i} onClick={() => scrollToIdx(i)} style={{width:i===duckIdx?16:6,height:6,borderRadius:99,background:i===duckIdx?"#a78bfa":"rgba(255,255,255,0.2)",transition:"all .3s",cursor:"pointer"}}/>
                    ))}
                  </div>
                )}

                {/* Mining bar */}
                {miningCount>0&&(
                  <G style={{borderColor:"rgba(240,171,252,0.2)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:12,color:"#f0abfc",fontWeight:700}}>⛏️ Active Mining</span>
                      <B color="#f0abfc">{miningCount}/{MAX_MINE}</B>
                    </div>
                    {ducks.filter(d=>d.miningUntil).map(d=>{
                      const r=gR(d.rid);const done=d.miningUntil<=now;
                      return(
                        <div key={d.id} style={{marginBottom:5}}>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,marginBottom:2}}>
                            <span style={{color:r.color}}>{BREEDS.find(b=>b.id===d.bid)?.name} · {r.name}</span>
                            <span style={{color:done?"#4ade80":"#f0abfc"}}>{done?"✅ Done!":fT(Math.ceil((d.miningUntil-now)/1000))}</span>
                          </div>
                          <PB pct={Math.min(((MINE_SECS*1000-(d.miningUntil-now))/(MINE_SECS*1000))*100,100)} color={done?"linear-gradient(90deg,#4ade80,#86efac)":"linear-gradient(90deg,#7c3aed,#f0abfc)"} h={4}/>
                        </div>
                      );
                    })}
                  </G>
                )}
              </div>
            )}

            {subTab==="tap"&&(
              <div style={{...S.col, alignItems:"center", padding: "20px 0"}}>
                <G style={{width:"100%", textAlign:"center", background: "linear-gradient(180deg, rgba(99,102,241,0.1), rgba(6,6,20,0.5))"}}>
                  <div style={{fontWeight:700, fontSize:15, color:"#a78bfa", fontFamily:"'Orbitron',sans-serif", marginBottom:5}}>DUKY CENTER</div>
                  <div style={{fontSize:11, color:"rgba(255,255,255,0.4)"}}>Tap on DUKY to generate bonus eggs!</div>
                </G>

                <div style={{cursor:"pointer", transition: "transform 0.1s active", margin: "40px 0", userSelect:"none", WebkitTapHighlightColor:"transparent"}}
                    onClick={() => {
                      if(tapsToday>=MAX_TAPS){addFloat("Daily limit reached!","#ef4444");return;}
                      
                      let fMult = 1;
                      if (isFrenzy) {
                        fMult = 2;
                      } else {
                        const next = frenzyCount + 1;
                        setFrenzyCount(next);
                        if (next >= 20) {
                          setIsFrenzy(true);
                          addFloat("🔥 FRENZY MODE!", "#ff4500");
                          setTimeout(() => { setIsFrenzy(false); setFrenzyCount(0); }, 8000);
                        }
                        if (frenzyTimeoutRef.current) clearTimeout(frenzyTimeoutRef.current);
                        frenzyTimeoutRef.current = setTimeout(() => { if(!isFrenzy) setFrenzyCount(0); }, 1200);
                      }

                      const g=+(1*mult*fMult).toFixed(2);
                      setEggs(e=>+(e+g).toFixed(2));setTotalEggs(t=>+(t+g).toFixed(2));
                      setTapsToday(t=>t+1);progTask("tap");
                      addFloat(`+${g}🥚`, isFrenzy ? "#ff4500" : "#fbbf24");
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                    onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <Duck breedId="royal" size={275} anim={true} />
                </div>

                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8, width:"100%"}}>
                  <div style={{fontSize:12,color:"#a78bfa", fontWeight:900, fontFamily:"'Orbitron',sans-serif"}}>{tapsToday.toLocaleString()} / {MAX_TAPS.toLocaleString()} TAPS</div>
                  <div style={{width:"220px"}}><PB pct={(tapsToday/MAX_TAPS)*100} color="linear-gradient(90deg,#6366f1,#a78bfa)" h={6}/></div>
                  
                  {/* Frenzy Combo UI */}
                  {!isFrenzy && frenzyCount > 0 && (
                    <div style={{width: 140, marginTop: 5}}>
                      <div style={{fontSize: 8, color: "#ff4500", textAlign: "center", marginBottom: 2, fontWeight: 700}}>COMBO: {frenzyCount}/20</div>
                      <PB pct={(frenzyCount/20)*100} color="#ff4500" h={4} />
                    </div>
                  )}
                  {isFrenzy && <div style={{color: "#ff4500", fontWeight: 900, fontSize: 13, animation: "glow 0.8s infinite", marginTop: 5}}>🔥 FRENZY ACTIVE (2x) 🔥</div>}
                  
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.35)", marginTop: 5}}>Current Multiplier: <span style={{color:isFrenzy?"#ff4500":"#4ade80"}}>×{(mult * (isFrenzy?2:1)).toFixed(1)}</span></div>
                </div>
              </div>
            )}

            {subTab==="plants"&&(
              <div style={S.col}>
                <G>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontWeight:700,fontSize:12,color:"#38bdf8"}}>💧 Water Tank</span>
                    <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:"#38bdf8"}}>{water}/{MAX_WATER}</span>
                  </div>
                  <PB pct={(water/MAX_WATER)*100} color="linear-gradient(90deg,#0369a1,#38bdf8)" h={5}/>
                  <div style={{display:"flex",gap:7,marginTop:8}}>
                    <button style={{...S.smallBtn,flex:1,opacity:adsToday<MAX_ADS&&water<MAX_WATER?1:0.4}} onClick={()=>{if(adsToday>=MAX_ADS||water>=MAX_WATER)return;setAdsToday(a=>a+1);setWater(w=>Math.min(MAX_WATER,w+3));addFloat("+3💧","#38bdf8");}}>📺 Ad (+3💧) {adsToday}/{MAX_ADS}</button>
                    <button style={{...S.smallBtn,flex:1,background:"linear-gradient(135deg,#78350f,#fbbf24)",opacity:coins>=50&&water<MAX_WATER?1:0.4}} onClick={()=>{if(coins<50||water>=MAX_WATER)return;setCoins(c=>c-50);setWater(w=>Math.min(MAX_WATER,w+10));addFloat("+10💧 -50🪙","#38bdf8");}}><CI/>50 → +10💧</button>
                  </div>
                </G>
                <SL>Seeds</SL>
                <div style={{display:"flex",gap:7}}>
                  {SEEDS.map(seed=>(
                    <div key={seed.id} onClick={()=>setSelSeed(selSeed===seed.id?null:seed.id)}
                      style={{flex:1,background:selSeed===seed.id?`${seed.color}20`:"rgba(255,255,255,0.03)",border:`2px solid ${selSeed===seed.id?seed.color:"rgba(255,255,255,0.08)"}`,borderRadius:12,padding:"8px 4px",textAlign:"center",cursor:"pointer",boxShadow:selSeed===seed.id?`0 0 10px ${seed.color}55`:"none"}}>
                      <div style={{fontSize:20}}>{seed.emoji}</div>
                      <div style={{fontSize:10,fontWeight:700,color:seed.color}}>{seed.name}</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>own: ×{seedInv[seed.id]||0}</div>
                      <div style={{fontSize:9,color:"#4ade80"}}>+{seed.feed}🌾</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>⏱{seed.time}m</div>
                    </div>
                  ))}
                </div>
                <SL>8 Plots</SL>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {plots.map((plot,i)=>{
                    const seed=plot?SEEDS.find(s=>s.id===plot.sid):null; 
                    const elapsed=plot?now-plot.at:0;
                    const pct=plot?Math.min((elapsed/plot.gt)*100,100):0;
                    const ready=plot&&pct>=100;
                    return( 
                      <div key={i} onClick={()=>plot?harvestPlot(i):plantSeed(i, selSeed)}
                        style={{aspectRatio:"1",borderRadius:12,border:`2px solid ${ready?"#4ade80":plot?"rgba(99,102,241,0.25)":"rgba(255,255,255,0.06)"}`,background:ready?"rgba(74,222,128,0.07)":plot?"rgba(99,102,241,0.04)":"rgba(120,80,40,0.1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:5,boxShadow:ready?"0 0 12px rgba(74,222,128,0.25)":"none"}}>
                        {!plot&&<><div style={{fontSize:18,opacity:0.3}}>🟫</div><div style={{fontSize:8,color:"rgba(255,255,255,0.2)"}}>Tap</div></>}
                        {plot&&!ready&&(
                          <div style={{textAlign:"center",width:"100%"}} onClick={e=>e.stopPropagation()}>
                            <div style={{fontSize:18}}>{seed?.emoji}</div>
                            <PB pct={pct} color="linear-gradient(90deg,#166534,#4ade80)" h={3}/>
                            <div style={{fontSize:8,color:"rgba(255,255,255,0.35)",marginTop:1}}>{Math.max(0,Math.ceil((plot.gt-elapsed)/60000))}m</div>
                            <div onClick={e=>{e.stopPropagation();const sc=seed?.skip||5;if(coins<sc){addFloat(`Trebuie ${sc}🪙`,"#ef4444");return;}setCoins(c=>c-sc);setPlots(p=>p.map((pl,pi)=>pi===i?{...pl,at:Date.now()-pl.gt}:pl));addFloat(`⏩ -${sc}🪙`,"#fbbf24");}}
                              style={{marginTop:2,background:"rgba(251,191,36,0.15)",border:"1px solid rgba(251,191,36,0.35)",borderRadius:6,padding:"2px 4px",fontSize:7,color:"#fbbf24",cursor:"pointer",fontWeight:700}}>⏩ {seed?.skip}<CI s={9}/></div>
                          </div>
                        )}
                        {ready&&<><div style={{fontSize:20}}>✨{seed?.emoji}</div><div style={{fontSize:8,color:"#4ade80",fontWeight:700}}>Harvest!</div></>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ LAB + CLINIC ═══ */}
        {tab==="lab"&&(
          <div style={S.col}>
            <div style={{display:"flex",gap:7}}>
              {[["breed","🧬 Breed"],["clinic","🏥 Clinic"]].map(([lt,lb])=>(
                <button key={lt} style={{...S.subTab,...(labTab===lt?S.subOn:{}),...(lt==="clinic"&&tiredCount>0?{borderColor:"rgba(239,68,68,0.5)",color:labTab===lt?"#ef4444":"rgba(239,68,68,0.6)"}:{})}} onClick={()=>setLabTab(lt)}>
                  {lb}{lt==="clinic"&&tiredCount>0?` (${tiredCount})`:""}
                </button>
              ))}
            </div>

            {labTab==="breed"&&(
              <div style={S.col}>
                <G style={{borderColor:"rgba(167,139,250,0.2)"}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#a78bfa",fontFamily:"'Orbitron',sans-serif",marginBottom:3}}>🧬 BREEDING LAB</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>Use syringes to evolve ducks. Failure returns an egg.</div>
                  {breedBoost&&<div style={{marginTop:5,color:"#fbbf24",fontWeight:700,fontSize:11}}>⚡ BOOST ACTIVE — double chance!</div>}
                </G>
                {breedSlot&&(
                  <G style={{textAlign:"center",borderColor:"rgba(167,139,250,0.35)"}} glow="#7c3aed">
                    <div style={{fontSize:28}}>🧫</div>
                    <div style={{color:"#a78bfa",fontWeight:700,fontSize:12,marginTop:4}}>Incubating...</div>
                    <div style={{color:gR(breedSlot.trid)?.color,fontSize:11,marginTop:2}}>Target: {gR(breedSlot.trid)?.name}</div>
                    <div style={{color:"#fbbf24",fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:700,margin:"5px 0"}}>⏱ {fT(Math.max(0,Math.ceil((breedSlot.endsAt-now)/1000)))}</div>
                    <PB pct={Math.min(100,((breedSlot.total*1000-(breedSlot.endsAt-now))/(breedSlot.total*1000))*100)} color={`linear-gradient(90deg,#7c3aed,${gR(breedSlot.trid)?.color})`} h={5}/>
                    <button style={{...S.btn,marginTop:10,width:"100%",background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.35)",fontSize:11}} onClick={skipBreeding}>⏩ Skip <CI s={11}/>{(breedSkips+1)*10}</button>
                  </G>
                )}
                {breedRes&&!breedSlot&&(
                  <G style={{textAlign:"center",borderColor:breedRes.ok?"rgba(74,222,128,0.35)":"rgba(239,68,68,0.35)"}}>
                    {breedRes.ok&&!breedRes.noSlot&&<Duck breedId={breedRes.bid||"mallard"} size={76} lvl={1}/>}
                    <div style={{fontWeight:700,color:breedRes.ok?"#4ade80":"#ef4444",marginTop:4,fontSize:13}}>
                      {breedRes.noSlot?"⚠️ Success but no slots!":breedRes.ok?`🎉 ${breedRes.rarity.name} obtained!`:"💔 Failure — you got an egg"}
                    </div>
                  </G>
                )}
                {ducks.length===0
                  ? <G><div style={{textAlign:"center",color:"rgba(255,255,255,0.3)",fontSize:12}}>No ducks yet — hatch one in the Shop!</div></G>
                  : <>
                    {/* Slider rațe Lab */}
                    <div ref={labSliderRef}
                      style={{display:"flex",overflowX:"hidden",width:"100%",cursor:labIsDragging.current?"grabbing":"grab"}}
                      onScroll={handleLabScroll}
                      onTouchStart={handleLabTouchStart} onTouchEnd={handleLabTouchEnd}
                      onMouseDown={handleLabMouseDown} onMouseMove={handleLabMouseMove}
                      onMouseUp={handleLabMouseUp} onMouseLeave={handleLabMouseLeave}>
                      {ducks.map((duck)=>{
                        const r=gR(duck.rid); const nR=gNR(duck.rid);
                        const isSel=selDuck?.id===duck.id;
                        const pct=(r.breedChance*100).toFixed(0);
                        const pc=r.breedChance>=0.2?"#4ade80":r.breedChance>=0.08?"#fbbf24":"#ef4444";
                        return(
                          <div key={duck.id} style={{flex:"0 0 100%",width:"100%",boxSizing:"border-box",padding:"0 2px"}}>
                            <div style={{background:`linear-gradient(180deg,${r.color}14,rgba(6,6,20,0.9))`,border:`2px solid ${isSel?r.color:r.color+"2a"}`,borderRadius:18,padding:"18px 14px",textAlign:"center",transition:"all .2s",boxShadow:isSel?`0 0 24px ${r.glow}44`:"none",opacity:duck.tired?0.65:1}}>
                              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,color:r.color,marginBottom:2}}>{duck.nickname||r.name}</div>
                              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:12}}>
                                Lvl {duck.lvl} · {r.name}{duck.tired?" · 😴 Tired":""}
                              </div>
                              <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
                                <Duck breedId={duck.bid} duckId={duck.id} size={175} tired={duck.tired} lvl={duck.lvl} animType={animMap[duck.id]}/>
                              </div>
                              {nR?(
                                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                                  {[["🎯 Chance",`${pct}%`,pc],["💉 Cost",`${nR.syrCost} syr`,syringes>=nR.syrCost?"#4ade80":"#ef4444"],["⏱ Incub.",`${nR.incub}s`,"#38bdf8"],["➡️ Target",nR.name,nR.color]].map(([l,v,c])=>(
                                    <div key={l} style={{background:"rgba(99,102,241,0.08)",borderRadius:10,padding:"7px 6px"}}>
                                      <div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>{l}</div>
                                      <div style={{color:c,fontWeight:700,fontFamily:"'Orbitron',sans-serif",fontSize:11}}>{v}</div>
                                    </div>
                                  ))}
                                </div>
                              ):<div style={{color:"#f0abfc",fontSize:12,fontWeight:700,marginBottom:12}}>🌟 Max rarity reached!</div>}
                              {!duck.tired&&nR&&(
                                <button style={{...S.btn,width:"100%",background:isSel?`linear-gradient(135deg,#166534,#4ade80)`:`linear-gradient(135deg,#4c1d95,${r.color})`,fontSize:12,padding:"10px"}}
                                  onClick={(e)=>{e.stopPropagation();setSelDuck(isSel?null:duck);}}>
                                  {isSel?"✅ Selected — Start below":"🧬 Select for Breeding"}
                                </button>
                              )}
                              {duck.tired&&<div style={{fontSize:11,color:"#ef4444",fontWeight:700}}>😴 Go to Clinic first</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Dots */}
                    {ducks.length>1&&(
                      <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:2}}>
                        {ducks.map((_,i)=>(
                          <div key={i} onClick={()=>{labScrollToIdx(i);setLabDuckIdx(i);setSelDuck(ducks[i]||null);}}
                            style={{width:i===labDuckIdx?18:6,height:6,borderRadius:99,background:i===labDuckIdx?"#a78bfa":"rgba(255,255,255,0.2)",transition:"all .3s",cursor:"pointer"}}/>
                        ))}
                      </div>
                    )}
                    {renderBreedPanel()}
                  </>
                }
              </div>
            )}

            {labTab==="clinic"&&(
              <div style={S.col}>
                <G style={{borderColor:"rgba(74,222,128,0.2)"}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#4ade80",fontFamily:"'Orbitron',sans-serif"}}>🏥 VETERINARY CLINIC</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:3}}>Heal ducks tired after breeding or mining. Auto-recovers in 10 min.</div>
                </G>
                <SL>Ducks in need of care</SL>
                {ducks.filter(d=>d.tired).length===0
                  ?<G><div style={{textAlign:"center",color:"#4ade80",fontSize:12,padding:4}}>✅ All ducks are healthy!</div></G>
                  :ducks.filter(d=>d.tired).map(duck=>{
                    const r=gR(duck.rid);
                    const secLeft=duck.tiredUntil?Math.max(0,Math.ceil((duck.tiredUntil-now)/1000)):null;
                    return(
                      <G key={duck.id} style={{borderColor:"rgba(239,68,68,0.25)"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <Duck breedId={duck.bid} duckId={duck.id} size={54} tired lvl={duck.lvl} animType={animMap[duck.id]}/>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:700,color:r.color,fontSize:12}}>{r.name} · Lvl {duck.lvl}</div>
                            <div style={{fontSize:10,color:"#ef4444"}}>😴 Tired · -60% eggs</div>
                            {secLeft&&<div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginTop:2}}>Auto-recovery in {fT(secLeft)}</div>}
                          </div>
                          <button style={{...S.btn,background:"linear-gradient(135deg,#7f1d1d,#ef4444)",opacity:(meds.recovery||0)>0?1:0.4}} onClick={()=>{triggerAnim(duck.id,'heal');handleUseMed(duck.id,"recovery");}}>💊 Heal now</button>
                        </div>
                      </G>
                    );
                  })
                }
                <SL>Medicines & Boosters</SL>
                {MEDS.map(med=>(
                  <G key={med.id}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:26}}>{med.emoji}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:12}}>{med.name}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{med.desc}</div>
                        <div style={{fontSize:9,color:"rgba(99,102,241,0.5)",marginTop:2}}>Stock: {meds[med.id]||0}</div>
                      </div>
                      <button style={{...S.btn,opacity:coins>=med.cost?1:0.4}} onClick={()=>{if(coins<med.cost)return;setCoins(c=>c-med.cost);setMeds(m=>({...m,[med.id]:(m[med.id]||0)+1}));addFloat(`+1${med.emoji}`,"#4ade80");}}><CI/>{med.cost}</button>
                    </div>
                  </G>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ BUCĂTĂRIE ═══ */}
        {tab==="cook"&&(
          <div style={S.col}>
            {cooking&&(
              <G style={{textAlign:"center",borderColor:"rgba(251,146,60,0.4)"}} glow="#ea580c">
                <div style={{fontSize:32}}>{cooking.emoji}</div>
                <div style={{fontWeight:700,fontSize:14}}>{cooking.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:4}}>→ <CI/> {cooking.coins} Coins</div>
                <div style={{color:"#fbbf24",fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:700}}>⏱ {fT(cookTimer)}</div>
                <PB pct={((cooking.time-cookTimer)/cooking.time)*100} color="linear-gradient(90deg,#ea580c,#fbbf24)" h={5}/>
              </G>
            )}
            <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4}}>
              {["Tier 1 — Basic","Tier 2 — Medium","Tier 3 — Pro","Tier 4 — Royal"].map((name,i)=>(
                <button key={i} onClick={()=>setActiveTier(i)}
                  style={{...S.subTab,flex:"none",padding:"5px 9px",fontSize:10,whiteSpace:"nowrap",
                    ...(activeTier===i
                      ? {...S.subOn,borderColor:TIER_COLORS[i],color:TIER_COLORS[i],background:`${TIER_COLORS[i]}15`}
                      : {color:`${TIER_COLORS[i]}70`,borderColor:`${TIER_COLORS[i]}25`}
                    )}}>
                  {name}
                </button>
              ))}
            </div>
            {RECIPES.filter(r=>r.tier===activeTier).map(recipe=>{
              const tc=TIER_COLORS[recipe.tier];const can=!cooking&&eggs>=recipe.eggs;
              const ts=recipe.time<60?`${recipe.time}s`:recipe.time<3600?`${Math.floor(recipe.time/60)}m`:recipe.time<86400?`${Math.floor(recipe.time/3600)}h`:`${Math.floor(recipe.time/86400)}d`;
              return(
                <G key={recipe.id} style={{borderColor:can?`${tc}44`:"rgba(99,102,241,0.1)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:42,height:42,borderRadius:10,background:`${tc}15`,border:`1px solid ${tc}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{recipe.emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:12,color:can?"#e2e8f0":"rgba(255,255,255,0.5)"}}>{recipe.name}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>🥚 {recipe.eggs.toLocaleString()} · ⏱ {ts}</div>
                      <div style={{fontSize:10,color:tc,fontWeight:700}}><CI/> +{recipe.coins} Coins</div>
                    </div>
                    <button style={{...S.btn,background:can?`linear-gradient(135deg,#ea580c,${tc})`:"rgba(99,102,241,0.1)",opacity:can?1:0.4}}
                      onClick={()=>{if(!can)return;setEggs(e=>e-recipe.eggs);setCooking(recipe);setCookTimer(recipe.time);addFloat(`-${recipe.eggs.toLocaleString()}🥚`,"#ef4444");}}>Cook</button>
                  </div>
                </G>
              );
            })}
            <G style={{borderColor:"rgba(99,102,241,0.1)"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
                <span style={{color:"rgba(255,255,255,0.4)"}}>🥚 Available</span>
                <span style={{fontFamily:"'Orbitron',sans-serif",color:"#fbbf24",fontWeight:700}}>{Math.floor(eggs).toLocaleString()}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginTop:3}}>
                <span style={{color:"rgba(255,255,255,0.4)"}}>⚡ Passive production</span>
                <span style={{fontFamily:"'Orbitron',sans-serif",color:"#4ade80",fontWeight:700}}>{(eps*60).toFixed(2)}/min</span>
              </div>
            </G>
          </div>
        )}

        {/* ═══ SHOP ═══ */}
        {tab==="shop"&&(
          <div style={S.col}>
            <div style={{display:"flex",gap:7}}>
              {[["store","🏪 Store"],["tasks","✅ Tasks"]].map(([st,lb])=>(
                <button key={st} style={{...S.subTab,...(shopTab===st?S.subOn:{}),...(st==="tasks"&&completedCount>claimedCount?{borderColor:"rgba(251,191,36,0.5)",color:shopTab===st?"#fbbf24":"rgba(251,191,36,0.6)"}:{})}} onClick={()=>setShopTab(st)}>
                  {lb}{st==="tasks"&&completedCount>claimedCount?` (${completedCount-claimedCount})`:""}
                </button>
              ))}
            </div>

            {shopTab==="tasks"&&(
              <div style={S.col}>
                <G style={{background:"linear-gradient(135deg,rgba(34,197,94,0.12),rgba(99,102,241,0.1))",borderColor:"rgba(34,197,94,0.25)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,color:"#4ade80"}}>✅ DAILY TASKS</div>
                    <B color="#4ade80" size={10}>{claimedCount}/5</B>
                  </div>
                  <PB pct={(claimedCount/5)*100} color="linear-gradient(90deg,#166534,#4ade80)" h={5}/>
                </G>
                <G style={{borderColor:"rgba(251,191,36,0.3)",background:"rgba(251,191,36,0.05)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:26}}>🏆</div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#fbbf24"}}>Completion Bonus</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Complete all 5 → 💉×5 + 💊×2</div></div>
                    {claimedCount===5?<B color="#4ade80" size={10}>✅</B>:<div style={{fontSize:11,fontFamily:"'Orbitron',sans-serif",color:"#fbbf24"}}>{5-claimedCount} left</div>}
                  </div>
                  {claimedCount===5&&<button style={{...S.btn,width:"100%",marginTop:8,background:"linear-gradient(135deg,#78350f,#fbbf24)"}} onClick={()=>{setSyringes(s=>s+5);setMeds(m=>({...m,recovery:(m.recovery||0)+2}));addFloat("🏆 +5💉+2💊","#fbbf24");}}>🎁 Claim Bonus</button>}
                </G>
                {renderWatchTask()}
                {dailyTasks.map(task=>{
                  const claimed=!!taskClaimed[task.id];
                  const catC={"🌾":"#4ade80","🌱":"#86efac","🍳":"#fb923c","🧬":"#a78bfa","🏥":"#f87171","⛏️":"#f0abfc","⭐":"#fbbf24","📺":"#fbbf24"}[task.cat]||"#6366f1";
                  return(
                    <G key={task.id} style={{borderColor:claimed?"rgba(74,222,128,0.4)":task.done?"rgba(251,191,36,0.35)":"rgba(99,102,241,0.15)",opacity:claimed?0.65:1}}>
                      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                        <div style={{width:38,height:38,borderRadius:10,background:`${catC}18`,border:`1px solid ${catC}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{task.cat}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                            <div style={{fontWeight:700,fontSize:12,color:claimed?"#4ade80":task.done?"#fbbf24":"#e2e8f0"}}>{task.title}</div>
                            <div style={{textAlign:"right",flexShrink:0,marginLeft:6}}>
                              <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>Reward</div>
                              <div style={{fontSize:10,fontWeight:700,color:"#a78bfa"}}>{task.rw.label}</div>
                            </div>
                          </div>
                          <PB pct={Math.min(((task.progress||0)/task.target)*100,100)} color={claimed?"linear-gradient(90deg,#166534,#4ade80)":task.done?"linear-gradient(90deg,#78350f,#fbbf24)":"linear-gradient(90deg,#312e81,#6366f1)"} h={4}/>
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:2,fontSize:9,color:"rgba(255,255,255,0.35)"}}>
                            <span>{task.progress||0}/{task.target}</span>
                            <span>{claimed?"✅ Claimed":task.done?"🎁 Ready!":"In progress..."}</span>
                          </div>
                          {task.done&&!claimed&&<button style={{...S.btn,width:"100%",marginTop:5,background:"linear-gradient(135deg,#78350f,#fbbf24)",fontSize:11,padding:"6px"}} onClick={()=>claimTask(task.id)}>🎁 Claim</button>}
                        </div>
                      </div>
                    </G>
                  );
                })}
              </div>
            )}

            {shopTab==="store"&&(<div style={S.col}>

            {/* === GRATIS — Reclame zilnice === */}
            <G style={{borderColor:"rgba(74,222,128,0.3)",background:"rgba(74,222,128,0.04)"}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:"#4ade80",marginBottom:8}}>🆓 FREE DAILY REWARDS</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {/* Ad → Coins */}
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <img src="/coin.svg" alt="coin" style={{width:28,height:28}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:700}}>+5 Coins per ad</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>Daily limit: {adCoinsToday}/{MAX_AD_COINS}</div>
                    <PB pct={(adCoinsToday/MAX_AD_COINS)*100} color="linear-gradient(90deg,#78350f,#fbbf24)" h={3}/>
                  </div>
                  <button style={{...S.btn,opacity:adCoinsToday<MAX_AD_COINS?1:0.35}} onClick={()=>{
                    if(adCoinsToday>=MAX_AD_COINS)return;
                    startAd(()=>{setAdCoinsToday(n=>n+1);setCoins(c=>c+5);addFloat("+5🪙 Ad!","#fbbf24");});
                  }}>📺 Watch</button>
                </div>
                {/* Ad → Syringe */}
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:20}}>💉</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:700}}>+1 Syringe per ad</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>Daily limit: {adSyrToday}/{MAX_AD_SYR}</div>
                    <PB pct={(adSyrToday/MAX_AD_SYR)*100} color="linear-gradient(90deg,#4c1d95,#a78bfa)" h={3}/>
                  </div>
                  <button style={{...S.btn,background:"linear-gradient(135deg,#4c1d95,#a78bfa)",opacity:adSyrToday<MAX_AD_SYR?1:0.35}} onClick={()=>{
                    if(adSyrToday>=MAX_AD_SYR)return;
                    startAd(()=>{setAdSyrToday(n=>n+1);setSyringes(s=>s+1);addFloat("+1💉 Ad!","#a78bfa");});
                  }}>📺 Watch</button>
                </div>
              </div>
            </G>

            {/* === CUMPĂRĂ COINS (bani reali) === */}
            <G style={{borderColor:"rgba(251,191,36,0.4)"}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:"#fbbf24",marginBottom:3,display:"flex",alignItems:"center",gap:5}}><img src="/coin.svg" alt="coin" style={{width:16,height:16}}/> BUY COINS</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginBottom:10}}>Apple Pay · Google Pay · Card — Accelerează-ți progresul</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {COIN_PACKS.map(pkg=>(
                  <div key={pkg.n} style={{background:`${pkg.c}10`,border:`2px solid ${pkg.c}44`,borderRadius:13,padding:"10px 8px",cursor:"pointer",textAlign:"center",position:"relative"}}
                    onClick={()=>addFloat("🔜 Coming soon!","#fbbf24")}>
                    {pkg.n==="Pro ⭐"&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",borderRadius:99,padding:"2px 8px",fontSize:8,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>POPULAR</div>}
                    <div style={{fontSize:22,marginBottom:2}}>{pkg.e}</div>
                    <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:pkg.c}}>{pkg.n}</div>
                    <div style={{fontSize:12,fontWeight:900,color:"#fbbf24",margin:"3px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><CI/> {pkg.coins.toLocaleString()}</div>
                    {pkg.desc&&<div style={{fontSize:8,color:pkg.c,marginBottom:5}}>{pkg.desc}</div>}
                    <div style={{background:`linear-gradient(135deg,${pkg.c}88,${pkg.c})`,borderRadius:8,padding:"5px",fontSize:12,fontWeight:700,color:"#fff"}}>{pkg.p}</div>
                  </div>
                ))}
              </div>
            </G>

            {/* === LUCKY HATCH — Rațe garantate === */}
            <G style={{borderColor:"rgba(240,171,252,0.35)",background:"rgba(240,171,252,0.04)"}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:"#f0abfc",marginBottom:3}}>🥚 LUCKY HATCH</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginBottom:8}}>Rată garantată — fără RNG, fără seringi.</div>
              {HATCH_EGGS.map(h=>{
                const can=coins>=h.coins&&ducks.length<slots;
                const r=gR(h.rid);
                return(
                  <div key={h.rid} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,padding:"8px 10px",borderRadius:11,background:`${h.color}09`,border:`1px solid ${h.color}33`}}>
                    <span style={{fontSize:22}}>{h.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:12,color:h.color}}>{h.name} Duck</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>{h.desc}</div>
                      <div style={{fontSize:9,color:"#4ade80",marginTop:1}}>🥚/s ×{(r.eggRate*9).toFixed(2)} cu max upgrades</div>
                    </div>
                    <button style={{...S.btn,background:can?`linear-gradient(135deg,#7c3aed,${h.color})`:"rgba(99,102,241,0.1)",opacity:can?1:0.45,flexShrink:0}}
                      onClick={()=>{
                        if(!can)return;
                        if(ducks.length>=slots){addFloat("No slots!","#ef4444");return;}
                        setCoins(c=>c-h.coins);
                        const nd={id:"d"+nextId,rid:h.rid,bid:gBreed(h.rid),lvl:1,xp:0,tired:false,lvlUpAt:null,miningUntil:null,breedCdUntil:null,nickname:""};
                        setNextId(n=>n+1);setDucks(d=>[...d,nd]);
                        addFloat(`🎉 ${h.name} Hatched!`,h.color);
                      }}><CI/>{h.coins.toLocaleString()}</button>
                  </div>
                );
              })}
              {ducks.length>=slots&&<div style={{fontSize:9,color:"#ef4444",textAlign:"center",marginTop:3}}>⚠️ Cumpără un slot înainte de a hatch.</div>}
            </G>

            {/* === BOOSTURI PREMIUM === */}
            <G style={{borderColor:"rgba(251,146,60,0.3)",background:"rgba(251,146,60,0.04)"}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:"#fb923c",marginBottom:8}}>⚡ PREMIUM BOOSTS</div>
              {/* Mining Boost */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:22}}>⛏️</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:12}}>Mining Boost <span style={{color:"#fb923c"}}>×2 DUKY</span></div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>24h — toate mining-urile dau dublu DUKY</div>
                  {miningBoostUntil>now&&<div style={{fontSize:9,color:"#fb923c",fontWeight:700,marginTop:2}}>⚡ ACTIV — {fT(Math.ceil((miningBoostUntil-now)/1000))} rămas</div>}
                </div>
                <button style={{...S.btn,background:coins>=150?"linear-gradient(135deg,#92400e,#fb923c)":"rgba(99,102,241,0.1)",opacity:coins>=150?1:0.45,flexShrink:0}}
                  onClick={()=>{
                    if(coins<150)return;
                    setCoins(c=>c-150);
                    setMiningBoostUntil(Date.now()+24*3600*1000);
                    addFloat("⚡ Mining 2x activ!","#fb923c");
                  }}><CI/>150</button>
              </div>
              {/* Breed Boost (suplimentar față de cel din Clinic) */}
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>🧬</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:12}}>Breed Boost <span style={{color:"#a78bfa"}}>×2 șansă</span></div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>O singură utilizare la următorul breeding</div>
                </div>
                <button style={{...S.btn,background:coins>=35?"linear-gradient(135deg,#4c1d95,#a78bfa)":"rgba(99,102,241,0.1)",opacity:coins>=35?1:0.45,flexShrink:0}}
                  onClick={()=>{if(coins<35)return;setCoins(c=>c-35);setMeds(m=>({...m,breedboost:(m.breedboost||0)+1}));addFloat("+1⚡ Boost!","#a78bfa");}}><CI/>35</button>
              </div>
            </G>

            {/* === RESURSE DE BAZĂ === */}
            <SL>🔓 Slots ({slots}/8)</SL>
            {slots<8
              ?<G><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>🔓</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:12}}>Slot {slots+1}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Loc nou pentru o rață</div></div><button style={{...S.btn,opacity:coins>=SLOT_COSTS[slots]?1:0.4}} onClick={buySlot}><CI/>{SLOT_COSTS[slots]}</button></div></G>
              :<G><div style={{textAlign:"center",color:"#4ade80",fontSize:12}}>✅ All slots unlocked!</div></G>
            }
            <SL>💉 Syringes</SL>
            {[1,5,10].map(qty=>(
              <G key={qty}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>💉</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:12}}>×{qty} {qty===1?"Syringe":"Syringes"}</div></div><button style={{...S.btn,opacity:coins>=qty*SYR_COST?1:0.4}} onClick={()=>{if(coins<qty*SYR_COST)return;setCoins(c=>c-qty*SYR_COST);setSyringes(s=>s+qty);addFloat(`+${qty}💉`,"#a78bfa");}}><CI/>{qty*SYR_COST}</button></div></G>
            ))}
            <SL>🌱 Seeds (×3 pack)</SL>
            {SEEDS.map(seed=>(
              <G key={seed.id}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>{seed.emoji}</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:seed.color}}>{seed.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{seed.desc} · +{seed.feed}🌾 · ⏱{seed.time}m</div><div style={{fontSize:9,color:"rgba(99,102,241,0.5)"}}>Own: ×{seedInv[seed.id]||0}</div></div><button style={{...S.btn,opacity:coins>=seed.cost?1:0.4}} onClick={()=>{if(coins<seed.cost)return;setCoins(c=>c-seed.cost);setSeedInv(inv=>({...inv,[seed.id]:(inv[seed.id]||0)+3}));addFloat(`+3${seed.emoji}`,"#4ade80");}}><CI/>{seed.cost}</button></div></G>
            ))}
            <SL>⬆️ Farm Upgrades</SL>
            {UPGRADES.map(u=>(
              <G key={u.id} style={{opacity:upgrades[u.id]?0.5:1}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>{u.emoji}</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:"#4ade80"}}>{u.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{u.desc}</div></div><button style={{...S.btn,opacity:!upgrades[u.id]&&coins>=u.cost?1:0.4}} onClick={()=>{if(upgrades[u.id]||coins<u.cost)return;setCoins(c=>c-u.cost);setUpgrades(p=>({...p,[u.id]:true}));addFloat(`${u.emoji} Activated!`,"#4ade80");}}>{upgrades[u.id]?"✅":<><CI/>{u.cost}</>}</button></div></G>
            ))}
            </div>
            )}
          </div>
        )}

        {/* ═══ LEAGUE + PROFIL ═══ */}
        {tab==="league"&&(
          <div style={{display:"flex",gap:7,padding:"0 0 8px"}}>
            {[["daily","🌅 Zilnic"],["weekly","🏆 Săptămânal"],["profile","👤 Profile"]].map(([lt,lb])=>(
              <button key={lt} style={{...S.subTab,...(leagueSubTab===lt?S.subOn:{})}} onClick={()=>setLeagueSubTab(lt)}>{lb}</button>
            ))}
          </div>
        )}
        {tab==="league"&&leagueSubTab==="daily"&&(
          <div style={S.col}>

            {/* DUKY Hunt banner */}
            <G style={{background:"linear-gradient(135deg,rgba(240,171,252,0.12),rgba(99,102,241,0.1))",borderColor:"rgba(240,171,252,0.35)",textAlign:"center"}} glow="#d946ef">
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:900,color:"#f0abfc",marginBottom:4,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><DI s={18}/> DUKY HUNT</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>
                Acumulează cât mai mult <b style={{color:"#f0abfc"}}>DUKY</b> înainte de airdrop!<br/>
                Câștigă turnee zilnice → primești DUKY bonus direct în portofel.
              </div>
              <div style={{marginTop:8,display:"flex",justifyContent:"center",gap:14}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>DUKY tău</div>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:16,fontWeight:700,color:"#f0abfc"}}>{fD(duky)}</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>Score curent</div>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:16,fontWeight:700,color:"#4ade80"}}>{myScore}🥚</div>
                </div>
              </div>
            </G>

            <G style={{background:"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(251,146,60,0.1))",borderColor:"rgba(251,191,36,0.35)",textAlign:"center"}} glow="#fbbf24">
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:900,color:"#fbbf24",marginBottom:4}}>🏆 ACTIVE LEAGUE</div>
              <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:8}}>
                {[["⏱ Time",tData.endTime<=now?"FINISHED":fT(Math.max(0,Math.floor((tData.endTime-now)/1000))),tData.endTime<=now?"#ef4444":"#fbbf24"],["# Rank",`#${myRank}`,myRank<=3?"#fbbf24":myRank<=10?"#94a3b8":"#e2e8f0"],["🥚/min",myScore,"#4ade80"]].map(([l,v,c])=>(
                  <div key={l} style={{background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"7px 12px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>{l}</div>
                    <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:15,fontWeight:700,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <PB pct={Math.max(0,((24*3600-Math.max(0,Math.floor((tData.endTime-now)/1000)))/(24*3600))*100)} color="linear-gradient(90deg,#78350f,#fbbf24)" h={4}/>
            </G>

            {renderTournamentReward()}

            {/* Tabel premii 24h */}
            <G style={{borderColor:"rgba(99,102,241,0.2)"}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,color:"#a78bfa",marginBottom:8,letterSpacing:1}}>🎁 PREMII 24H</div>
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {PRIZE_TABLE.map((row,i)=>{
                  const isMyTier=(myRank===1&&i===0)||(myRank<=3&&myRank>1&&i===1)||(myRank<=10&&myRank>3&&i===2)||(myRank<=25&&myRank>10&&i===3)||(myRank<=50&&myRank>25&&i===4)||(myRank>50&&i===5);
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",borderRadius:8,background:isMyTier?`${row.color}18`:"rgba(255,255,255,0.02)",border:`1px solid ${isMyTier?row.color:"rgba(99,102,241,0.1)"}`}}>
                      <div style={{fontSize:13,flexShrink:0}}>{row.icon}</div>
                      <div style={{fontSize:10,fontWeight:700,color:row.color,width:68,flexShrink:0}}>{row.rank}</div>
                      <div style={{flex:1,display:"flex",gap:6,flexWrap:"wrap"}}>
                        {row.duky>0&&<span style={{fontSize:9,color:"#f0abfc",fontWeight:700,display:"inline-flex",alignItems:"center",gap:2}}><DI s={10}/>{row.duky}</span>}
                        {row.syr>0&&<span style={{fontSize:9,color:"#a78bfa"}}>💉×{row.syr}</span>}
                        {row.med>0&&<span style={{fontSize:9,color:"#4ade80"}}>💊×{row.med}</span>}
                        <span style={{fontSize:9,color:"#86efac"}}>{row.seedLabel}</span>
                      </div>
                      {isMyTier&&<B color={row.color} size={8}>← tu</B>}
                    </div>
                  );
                })}
              </div>
            </G>

            <G>
              <SL>Live Leaderboard</SL>
              <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6,maxHeight:380,overflowY:"auto"}}>
                {allPlayers.slice(0,20).map((player,i)=>{
                  const rank=i+1;const rc=rank<=3?"#fbbf24":rank<=10?"#94a3b8":rank<=25?"#fb923c":"rgba(255,255,255,0.5)";
                  const r=gR(player.rarityId);
                  return(
                    <div key={player.id} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 9px",borderRadius:9,background:player.isPlayer?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.02)",border:player.isPlayer?"1px solid rgba(99,102,241,0.4)":"1px solid transparent"}}>
                      <div style={{width:26,textAlign:"center",fontFamily:"'Orbitron',sans-serif",fontSize:rank<=3?13:10,fontWeight:700,color:rc,flexShrink:0}}>{rank<=3?["🥇","🥈","🥉"][rank-1]:rank}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:player.isPlayer?700:400,fontSize:11,color:player.isPlayer?"#a78bfa":"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{player.name}</div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>🦆 <span style={{color:r?.color}}>{r?.name}</span></div>
                      </div>
                      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,color:"#4ade80",flexShrink:0}}>{player.score}🥚</div>
                    </div>
                  );
                })}
              </div>
              {myRank>20&&<div style={{marginTop:6,padding:"6px 9px",borderRadius:9,background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.4)",display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:26,textAlign:"center",fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,color:"#a78bfa"}}>#{myRank}</div>
                <div style={{flex:1,fontSize:11,color:"#a78bfa",fontWeight:700}}>You 🦆</div>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,color:"#4ade80"}}>{myScore}🥚</div>
              </div>}
            </G>

            {tData.endTime<=now&&(
              <G style={{textAlign:"center"}}><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:7}}>Turneul zilnic s-a încheiat!</div>
                <button style={{...S.btn,background:"linear-gradient(135deg,#312e81,#6366f1)"}} onClick={()=>{setTData({opponents:GEN_OPP(),endTime:Date.now()+24*3600*1000,claimed:false});addFloat("🌅 New Daily!","#fbbf24");}}>🔄 Start Zilnic Nou</button>
              </G>
            )}
          </div>
        )}

        {tab==="league"&&leagueSubTab==="weekly"&&(()=>{
          const wEnded=weeklyTData.endTime<=now;
          const wOpp=weeklyTData.opponents;
          const wAll=[...wOpp,{id:"me",name:"Tu 🦆",score:myScore,rarityId:ducks.length>0?ducks.reduce((b,d)=>{const o=["common","rare","epic","legendary","mythic"];return o.indexOf(d.rid)>o.indexOf(b)?d.rid:b;},"common"):"common",isPlayer:true}].sort((a,b)=>b.score-a.score);
          const wRank=wAll.findIndex(p=>p.isPlayer)+1;
          const wRew=WEEKLY_TREWARD(wRank);
          const wHasSeed=wRew.seeds&&(wRew.seeds.legendary+wRew.seeds.medium+wRew.seeds.basic)>0;
          const wSeedLabel=wRew.seeds?[wRew.seeds.legendary>0&&`${wRew.seeds.legendary}🌻`,wRew.seeds.medium>0&&`${wRew.seeds.medium}🌽`,wRew.seeds.basic>0&&`${wRew.seeds.basic}🌾`].filter(Boolean).join(" "):"";
          const wHasReward=wRew.mythic||wRew.duky>0||wRew.syr>0||wRew.med>0||wHasSeed;
          return(
          <div style={S.col}>
            {/* Banner săptămânal */}
            <G style={{background:"linear-gradient(135deg,rgba(240,171,252,0.18),rgba(99,102,241,0.12))",borderColor:"rgba(240,171,252,0.5)",textAlign:"center"}} glow="#d946ef">
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:15,fontWeight:900,color:"#f0abfc",marginBottom:4}}>🏆 WEEKLY CHAMPIONSHIP</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.6,marginBottom:8}}>Locul #1 câștigă o <b style={{color:"#f0abfc"}}>rață Mythic</b> 🦆✨</div>
              <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                {[["⏱ Timp",wEnded?"ENDED":fT(Math.max(0,Math.floor((weeklyTData.endTime-now)/1000))),wEnded?"#ef4444":"#f0abfc"],["# Rank",`#${wRank}`,wRank===1?"#f0abfc":wRank<=3?"#fbbf24":"#e2e8f0"],["🥚/min",myScore,"#4ade80"]].map(([l,v,c])=>(
                  <div key={l} style={{background:"rgba(0,0,0,0.35)",borderRadius:10,padding:"7px 12px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>{l}</div>
                    <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:700,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:8}}><PB pct={Math.max(0,((7*24*3600-Math.max(0,Math.floor((weeklyTData.endTime-now)/1000)))/(7*24*3600))*100)} color="linear-gradient(90deg,#7c3aed,#f0abfc)" h={5}/></div>
            </G>

            {/* Premiul jucătorului */}
            <G style={{borderColor:`${wRew.color}44`,background:wRew.mythic?"linear-gradient(135deg,rgba(240,171,252,0.15),rgba(99,102,241,0.08))":` ${wRew.color}08`}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:wRew.mythic?36:28}}>{wRew.mythic?"🦆✨":wRank<=3?"🥇":wRank<=10?"🥈":wRank<=25?"🥉":"💪"}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:wRew.color}}>{wRew.label} — Rank #{wRank}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",lineHeight:1.8,marginTop:2}}>
                    {wRew.mythic&&<span style={{color:"#f0abfc",fontWeight:700}}>🦆 Rată Mythic Lvl1  </span>}
                    {wRew.duky>0&&<span>💎 {wRew.duky} DUKY  </span>}
                    {wRew.syr>0&&<span>💉×{wRew.syr}  </span>}
                    {wRew.med>0&&<span>💊×{wRew.med}  </span>}
                    {wHasSeed&&<span>🌱 {wSeedLabel}</span>}
                  </div>
                </div>
                {wEnded&&!weeklyTData.claimed&&wHasReward&&(
                  <button style={{...S.btn,background:`linear-gradient(135deg,#4c1d95,${wRew.color})`}} onClick={()=>{
                    if(wRew.mythic){
                      const nid="d"+nextId;
                      const nb={id:nid,rid:"mythic",bid:gBreed("mythic")||"cosmic",lvl:1,xp:0,tired:false,lvlUpAt:null,miningUntil:null,breedCdUntil:null,nickname:"Champion 🏆"};
                      setDucks(d=>[...d,nb]);setNextId(n=>n+1);
                      if(ducks.length>=slots)setSlots(s=>s+1);
                      addFloat("🦆✨ MYTHIC DUCK!","#f0abfc");
                    }
                    if(wRew.duky>0){setDuky(v=>+(v+wRew.duky).toFixed(4));addFloat(`+${wRew.duky}💎`,"#f0abfc");}
                    if(wRew.syr>0){setSyringes(s=>s+wRew.syr);addFloat(`+${wRew.syr}💉`,"#a78bfa");}
                    if(wRew.med>0){setMeds(m=>({...m,recovery:(m.recovery||0)+wRew.med}));addFloat(`+${wRew.med}💊`,"#4ade80");}
                    if(wHasSeed){setSeedInv(inv=>({...inv,legendary:(inv.legendary||0)+(wRew.seeds.legendary||0),medium:(inv.medium||0)+(wRew.seeds.medium||0),basic:(inv.basic||0)+(wRew.seeds.basic||0)}));addFloat(`🌱 ${wSeedLabel}`,"#4ade80");}
                    setWeeklyTData(t=>({...t,claimed:true}));
                    addFloat(`🏆 Weekly Rank ${wRank}!`,"#fbbf24");
                  }}>🎁 Claim</button>
                )}
                {weeklyTData.claimed&&<B color="#4ade80" size={10}>✅</B>}
                {!wEnded&&<div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>La final</div>}
              </div>
            </G>

            {/* Tabel premii săptămânale */}
            <G style={{borderColor:"rgba(240,171,252,0.2)"}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,color:"#f0abfc",marginBottom:8,letterSpacing:1}}>🎁 PREMII SĂPTĂMÂNALE</div>
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {WEEKLY_PRIZE_TABLE.map((row,i)=>{
                  const isMyTier=(wRank===1&&i===0)||(wRank<=3&&wRank>1&&i===1)||(wRank<=10&&wRank>3&&i===2)||(wRank<=25&&wRank>10&&i===3)||(wRank<=50&&wRank>25&&i===4)||(wRank>50&&i===5);
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",borderRadius:8,background:isMyTier?`${row.color}18`:"rgba(255,255,255,0.02)",border:`1px solid ${isMyTier?row.color:"rgba(240,171,252,0.1)"}`}}>
                      <div style={{fontSize:13,flexShrink:0}}>{row.icon}</div>
                      <div style={{fontSize:10,fontWeight:700,color:row.color,width:72,flexShrink:0}}>{row.rank}</div>
                      <div style={{flex:1,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                        {row.mythic&&<span style={{fontSize:9,color:"#f0abfc",fontWeight:700}}>🦆 Mythic Duck</span>}
                        {row.duky>0&&<span style={{fontSize:9,color:"#f0abfc",fontWeight:700,display:"inline-flex",alignItems:"center",gap:2}}><DI s={10}/>{row.duky}</span>}
                        {row.syr>0&&<span style={{fontSize:9,color:"#a78bfa"}}>💉×{row.syr}</span>}
                        {row.med>0&&<span style={{fontSize:9,color:"#4ade80"}}>💊×{row.med}</span>}
                        <span style={{fontSize:9,color:"#86efac"}}>{row.seedLabel}</span>
                      </div>
                      {isMyTier&&<B color={row.color} size={8}>← tu</B>}
                    </div>
                  );
                })}
              </div>
            </G>

            {/* Leaderboard săptămânal */}
            <G>
              <SL>Weekly Leaderboard</SL>
              <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6,maxHeight:380,overflowY:"auto"}}>
                {wAll.slice(0,20).map((player,i)=>{
                  const rank=i+1;const rc=rank===1?"#f0abfc":rank<=3?"#fbbf24":rank<=10?"#94a3b8":"rgba(255,255,255,0.5)";
                  const r=gR(player.rarityId);
                  return(
                    <div key={player.id} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 9px",borderRadius:9,background:player.isPlayer?"rgba(240,171,252,0.12)":"rgba(255,255,255,0.02)",border:player.isPlayer?"1px solid rgba(240,171,252,0.4)":"1px solid transparent"}}>
                      <div style={{width:26,textAlign:"center",fontFamily:"'Orbitron',sans-serif",fontSize:rank<=3?13:10,fontWeight:700,color:rc,flexShrink:0}}>{rank===1?"👑":rank<=3?["","🥈","🥉"][rank-1]:rank}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:player.isPlayer?700:400,fontSize:11,color:player.isPlayer?"#f0abfc":"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{player.name}</div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>🦆 <span style={{color:r?.color}}>{r?.name}</span></div>
                      </div>
                      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,color:"#4ade80",flexShrink:0}}>{player.score}🥚</div>
                    </div>
                  );
                })}
              </div>
              {wRank>20&&<div style={{marginTop:6,padding:"6px 9px",borderRadius:9,background:"rgba(240,171,252,0.12)",border:"1px solid rgba(240,171,252,0.4)",display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:26,textAlign:"center",fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,color:"#f0abfc"}}>#{wRank}</div>
                <div style={{flex:1,fontSize:11,color:"#f0abfc",fontWeight:700}}>Tu 🦆</div>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,color:"#4ade80"}}>{myScore}🥚</div>
              </div>}
            </G>

            {wEnded&&(
              <G style={{textAlign:"center"}}><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:7}}>Turneul săptămânal s-a încheiat!</div>
                <button style={{...S.btn,background:"linear-gradient(135deg,#4c1d95,#f0abfc)"}} onClick={()=>{setWeeklyTData({opponents:GEN_WEEKLY_OPP(),endTime:Date.now()+7*24*3600*1000,claimed:false});addFloat("🏆 New Weekly!","#f0abfc");}}>🔄 Start Săptămânal Nou</button>
              </G>
            )}
          </div>
          );
        })()}

        {tab==="league"&&leagueSubTab==="profile"&&(
          <div style={S.col}>
            <div style={{display:"flex",gap:7}}>
              {[["wallet","$ Wallet"],["achievements","🏆 Medals"],["referral","🤝 Referral"],["social","📱 Social"]].map(([pt,lb])=>(
                <button key={pt} style={{...S.subTab,...(profilTab===pt?S.subOn:{})}} onClick={()=>setProfilTab(pt)}>{lb}</button>
              ))}
            </div>

            {profilTab==="wallet"&&(
              <div style={S.col}>
                <div style={{display:"flex",gap:8}}>
                  <G style={{flex:1,textAlign:"center"}} glow="#fbbf24"><div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginBottom:3,display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><img src="/coin.svg" alt="coin" style={{width:11,height:11}}/> COINS</div><div style={{fontSize:26,fontWeight:900,color:"#fbbf24",fontFamily:"'Orbitron',sans-serif"}}>{Math.floor(coins)}</div></G>
                  <G style={{flex:1,textAlign:"center"}} glow="#f0abfc"><div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginBottom:3,display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><img src="/duky.svg" alt="duky" style={{width:11,height:14}}/> DUKY</div><div style={{fontSize:22,fontWeight:900,color:"#f0abfc",fontFamily:"'Orbitron',sans-serif"}}>{fD(duky)}</div></G>
                </div>
                <G>
                  <SL>Statistics</SL>
                  <div style={{marginTop:4}}>
                    {[["Total Eggs",`🥚 ${Math.floor(totalEggs).toLocaleString()}`],["Eggs/min",`⚡ ${(eps*60).toFixed(2)}`],["Ducks",`🦆 ${ducks.length}/${slots}`],["Feed",`🌾 ${Math.floor(feed)}`],["Mining",`⛏️ ${miningCount}/${MAX_MINE}`],["Taps left",`👆 ${(MAX_TAPS-tapsToday).toLocaleString()}`],["Multiplier",`✨ ×${mult.toFixed(1)}`],["Syringes",`💉 ${syringes}`]].map(([l,v])=><Row key={l} l={l} v={v}/>)}
                  </div>
                </G>
                <G><SL>Collection</SL><div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:6,justifyContent:"center"}}>{ducks.map(d=><div key={d.id} style={{textAlign:"center"}}><Duck breedId={d.bid} duckId={d.id} size={46} lvl={d.lvl} animType={animMap[d.id]}/><div style={{marginTop:1}}><B color={gLC(d.lvl)} size={7}>Lvl {d.lvl}</B></div></div>)}</div></G>
                <G style={{borderColor:"rgba(167,139,250,0.25)",background:"linear-gradient(135deg,rgba(76,29,149,0.25),rgba(10,10,28,0.85))"}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#a78bfa",fontFamily:"'Orbitron',sans-serif",marginBottom:5}}>🔗 WEB3 · DUKY</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.6,marginBottom:10}}>DUKY earned from: level up · mining · leagues · tasks<br/>Connect wallet to transfer on blockchain!</div>
                  <button style={{...S.breedBtn,background:"linear-gradient(135deg,#4c1d95,#2563eb)"}}>🦊 Connect Wallet</button>
                </G>
              </div>
            )}

            {profilTab==="achievements" && renderAchievements()}

            {profilTab==="referral"&&(
              <div style={S.col}>
                <G style={{background:"linear-gradient(135deg,rgba(76,29,149,0.35),rgba(37,99,235,0.2))",borderColor:"rgba(167,139,250,0.3)",textAlign:"center"}} glow="#7c3aed">
                  <div style={{fontSize:28,marginBottom:4}}>🤝</div>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:700,color:"#a78bfa",marginBottom:5}}>REFERRAL PROGRAM</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>Invite friends → <b style={{color:"#f0abfc"}}>10% DUKY</b> from their earnings.<br/>Sub-referrals → <b style={{color:"#38bdf8"}}>2.5% DUKY</b></div>
                </G>
                <G>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{flex:1,background:"rgba(240,171,252,0.08)",border:"1px solid rgba(240,171,252,0.2)",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                      <div style={{fontSize:18,marginBottom:2}}>👤</div><div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>LEVEL 1</div>
                      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:700,color:"#f0abfc"}}>10%</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",color:"rgba(99,102,241,0.4)",fontSize:16}}>→</div>
                    <div style={{flex:1,background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                      <div style={{fontSize:18,marginBottom:2}}>👥</div><div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>LEVEL 2</div>
                      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:700,color:"#38bdf8"}}>2.5%</div>
                    </div>
                  </div>
                </G>
                <G style={{borderColor:"rgba(251,191,36,0.25)"}}>
                  <SL>Your Code</SL>
                  <div style={{display:"flex",gap:8,marginTop:5,alignItems:"center"}}>
                    <div style={{flex:1,background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:10,padding:"9px 11px",fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,color:"#fbbf24",letterSpacing:2}}>DUCK-X7K9</div>
                    <button style={{...S.btn,padding:"9px 13px"}} onClick={()=>addFloat("📋 Copied!","#4ade80")}>📋</button>
                  </div>
                  <div style={{display:"flex",gap:7,marginTop:7}}>
                    <button style={{...S.smallBtn,flex:1}} onClick={()=>addFloat("Telegram…","#38bdf8")}>✈️ Telegram</button>
                    <button style={{...S.smallBtn,flex:1,background:"linear-gradient(135deg,#1d1d1d,#1a8917)"}} onClick={()=>addFloat("WhatsApp…","#4ade80")}>📱 WhatsApp</button>
                  </div>
                </G>
                {!refApplied&&(
                  <G>
                    <SL>Have a code?</SL>
                    <div style={{display:"flex",gap:8,marginTop:5}}>
                      <input value={refInput} onChange={e=>setRefInput(e.target.value.toUpperCase())} placeholder="DUCK-XXXXXX"
                        style={{flex:1,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:9,padding:"7px 10px",color:"#e2e8f0",fontFamily:"'Orbitron',sans-serif",fontSize:11,outline:"none"}}/>
                      <button style={S.btn} onClick={()=>{if(refInput.startsWith("DUCK-")&&refInput.length>=10){setRefApplied(true);addFloat("🤝 Activated!","#4ade80");}else addFloat("Invalid code","#ef4444");}}>Apply</button>
                    </div>
                  </G>
                )}
              </div>
            )}

            {profilTab==="social"&&(
              <div style={S.col}>
                <G style={{textAlign:"center",borderColor:"rgba(167,139,250,0.25)"}}>
                  <div style={{fontSize:24,marginBottom:3}}>🦆</div>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:700,color:"#a78bfa",marginBottom:3}}>DUCKFARM COMMUNITY</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>Follow for news, tournaments, and airdrops!</div>
                </G>
                {[
                  {id:"instagram",name:"Instagram",  handle:"@duckfarm.official",icon:"📸",color:"#e1306c",grad:"linear-gradient(135deg,#833ab4,#e1306c,#f77737)",reward:"🔓 +1 Slot"},
                  {id:"youtube",  name:"YouTube",     handle:"DuckFarm Official", icon:"▶️",color:"#ff0000",grad:"linear-gradient(135deg,#1a0000,#ff0000)",         reward:"💊×3 + 1⚡"},
                  {id:"twitter",  name:"Twitter / X", handle:"@DuckFarmGame",     icon:"🐦",color:"#1d9bf0",grad:"linear-gradient(135deg,#0f0f0f,#1d9bf0)",         reward:"🪙 +500 Coins"},
                  {id:"tiktok",   name:"TikTok",      handle:"@duckfarmgame",     icon:"🎵",color:"#fe2c55",grad:"linear-gradient(135deg,#010101,#fe2c55,#25f4ee)",  reward:"🪙 +300 Coins"},
                ].map(soc=>{
                  const claimed=socialClaimed[soc.id];
                  return(
                    <G key={soc.id} style={{borderColor:`${soc.color}${claimed?"22":"44"}`,padding:0,overflow:"hidden",opacity:claimed?0.7:1}}>
                      <div style={{background:soc.grad,padding:"2px 0",opacity:0.6}}></div>
                      <div style={{padding:"10px 13px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:claimed?0:7}}>
                          <div style={{width:38,height:38,borderRadius:11,background:`${soc.color}22`,border:`2px solid ${soc.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{soc.icon}</div>
                          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12}}>{soc.name}</div><div style={{fontSize:10,color:soc.color,fontWeight:600}}>{soc.handle}</div></div>
                        </div>
                        {!claimed&&(
                          <div style={{background:"rgba(0,0,0,0.2)",borderRadius:9,padding:"7px 9px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <div><div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>Reward:</div><div style={{fontSize:11,fontWeight:700,color:soc.color}}>{soc.reward}</div></div>
                            <button style={{...S.btn,background:soc.grad,fontSize:11,padding:"6px 12px"}} onClick={()=>{claimSocial(soc.id);addFloat(`${soc.icon} Follow!`,soc.color);}}>Follow & Claim</button>
                          </div>
                        )}
                        {claimed&&<div style={{fontSize:11,color:"#4ade80",textAlign:"center",padding:"3px 0"}}>✅ Thanks for following us!</div>}
                      </div>
                    </G>
                  );
                })}
                <G style={{background:"linear-gradient(135deg,rgba(240,171,252,0.1),rgba(99,102,241,0.1))",borderColor:"rgba(240,171,252,0.3)",textAlign:"center"}} glow="#d946ef">
                  <div style={{fontSize:22,marginBottom:3}}>🪂</div>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:700,color:"#f0abfc",marginBottom:4}}>AIRDROP · SEASON 1</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.6,marginBottom:9}}>Social media snapshot coming soon.<br/><b style={{color:"#fbbf24"}}>Accumulate DUKY now!</b></div>
                  <button style={{...S.btn,background:"linear-gradient(135deg,#4c1d95,#d946ef)",fontSize:11}} onClick={()=>addFloat("Follow us!","#f0abfc")}>📸 Follow</button>
                </G>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
