export const S={
  root:      {fontFamily:"'Exo 2',sans-serif",background:"#06060f",height:"100dvh",color:"#e2e8f0",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",overflow:"hidden"},
  floatWrap: {position:"fixed",top:68,left:"50%",transform:"translateX(-50%)",zIndex:999,pointerEvents:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3},
  float:     {fontSize:13,fontWeight:700,animation:"floatUp 1.7s ease-out forwards",textShadow:"0 2px 8px rgba(0,0,0,0.9)",fontFamily:"'Orbitron',sans-serif"},
  header:    {background:"rgba(6,6,20,0.97)",backdropFilter:"blur(20px)",padding:"11px 13px 8px",borderBottom:"1px solid rgba(99,102,241,0.18)"},
  logo:      {fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:900,letterSpacing:3},
  statsRow:  {display:"flex",gap:4,flexWrap:"wrap"},
  chip:      {display:"flex",alignItems:"center",gap:3,background:"rgba(99,102,241,0.07)",border:"1px solid rgba(99,102,241,0.14)",padding:"3px 7px",borderRadius:8},
  tabs:      {display:"flex",background:"rgba(6,6,20,0.98)",borderBottom:"1px solid rgba(99,102,241,0.14)",position:"sticky",top:0,zIndex:10},
  tab:       {flex:1,padding:"7px 1px",background:"transparent",border:"none",color:"rgba(255,255,255,0.28)",fontSize:13,cursor:"pointer",fontFamily:"'Exo 2',sans-serif",fontWeight:600,lineHeight:1.2,transition:"all .2s"},
  tabOn:     {color:"#a78bfa",borderBottom:"2px solid #6366f1",background:"linear-gradient(180deg,rgba(99,102,241,0.18),rgba(99,102,241,0.04))"},
  content:   {padding:"11px",overflowY:"auto",flex:1},
  col:       {display:"flex",flexDirection:"column",gap:8},
  subTab:    {flex:1,padding:"7px",background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.14)",borderRadius:10,color:"rgba(255,255,255,0.35)",fontSize:12,cursor:"pointer",fontFamily:"'Exo 2',sans-serif",fontWeight:600,transition:"all .2s"},
  subOn:     {background:"rgba(99,102,241,0.11)",borderColor:"rgba(99,102,241,0.38)",color:"#a78bfa"},
  
  // Slider Styles
  duckSlider: {display:"flex",overflowX:"hidden",gap:0,paddingBottom:15,scrollbarWidth:"none",msOverflowStyle:"none",width:"100%",minWidth:0},
  duckCard:   {flex:"0 0 100%",width:"100%",scrollSnapAlign:"center",display:"flex",flexDirection:"column",gap:10,boxSizing:"border-box",padding:"0 4px",userSelect:"none"},

  slotBox:   {width:"calc(25% - 5px)",aspectRatio:"1",border:"2px solid",borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:4,transition:"all .18s",cursor:"pointer"},
  slotLocked:{width:"calc(25% - 5px)",aspectRatio:"1",background:"rgba(255,255,255,0.02)",border:"2px solid rgba(99,102,241,0.1)",borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:4,opacity:0.35,cursor:"default"},
  slotEmpty: {width:"calc(25% - 5px)",aspectRatio:"1",background:"rgba(255,255,255,0.02)",border:"2px solid rgba(99,102,241,0.15)",borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:4,cursor:"default"},
  modalBg:   {position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:100,backdropFilter:"blur(4px)"},
  btn:       {background:"linear-gradient(135deg,#312e81,#6366f1)",border:"none",borderRadius:9,padding:"6px 11px",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"'Exo 2',sans-serif",whiteSpace:"nowrap"},
  breedBtn:  {border:"none",borderRadius:11,padding:"9px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Exo 2',sans-serif",width:"100%"},
  smallBtn:  {background:"linear-gradient(135deg,#0c4a6e,#0ea5e9)",border:"none",borderRadius:8,padding:"5px 7px",color:"#fff",fontWeight:600,fontSize:10,cursor:"pointer",fontFamily:"'Exo 2',sans-serif"},
  actionBtn: {border:"none",borderRadius:9,padding:"10px 11px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'Exo 2',sans-serif",minHeight:44},
};