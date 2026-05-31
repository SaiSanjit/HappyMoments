import type { ReactElement } from "react";

/* ─── 1. Music — Blue Speaker ─── */
export function IconMusic(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes mu-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes mu-wave{0%,100%{opacity:.65}50%{opacity:.18}}
        .mu-g{animation:mu-float 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 90%}
        .mu-w1{animation:mu-wave 2.2s ease-in-out infinite}
        .mu-w2{animation:mu-wave 2.2s .45s ease-in-out infinite}
        .mu-w3{animation:mu-wave 2.2s .9s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="mu-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c4d8f4"/><stop offset="100%" stopColor="#e8eeff"/></linearGradient>
        <linearGradient id="mu-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a60b0"/><stop offset="100%" stopColor="#18306a"/></linearGradient>
        <linearGradient id="mu-top-f" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#3a60b0"/><stop offset="100%" stopColor="#5a84d8"/></linearGradient>
        <linearGradient id="mu-side-f" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#182e68"/><stop offset="100%" stopColor="#0e1a40"/></linearGradient>
        <radialGradient id="mu-cone-hl" cx="36%" cy="36%" r="52%"><stop offset="0%" stopColor="#5280c8" stopOpacity=".55"/><stop offset="100%" stopColor="#0e1830" stopOpacity="0"/></radialGradient>
        <radialGradient id="mu-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a3070" stopOpacity=".30"/><stop offset="100%" stopColor="#1a3070" stopOpacity="0"/></radialGradient>
        <filter id="mu-sf"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#mu-bg)"/>
      <circle cx="52" cy="36" r="46" fill="#aac0e8" opacity=".15"/>
      <circle cx="285" cy="170" r="54" fill="#b0c4ee" opacity=".12"/>
      <ellipse cx="166" cy="180" rx="60" ry="9" fill="url(#mu-flr)" filter="url(#mu-sf)"/>
      <g className="mu-g">
        <polygon points="108,50 220,50 234,38 122,38" fill="url(#mu-top-f)"/>
        <polygon points="220,50 234,38 234,162 220,174" fill="url(#mu-side-f)"/>
        <rect x="108" y="50" width="112" height="124" rx="5" fill="url(#mu-front)"/>
        <rect x="109" y="51" width="110" height="2" rx="1" fill="white" opacity=".18"/>
        <circle cx="118" cy="61" r="3" fill="#0d1530" opacity=".6"/>
        <circle cx="211" cy="61" r="3" fill="#0d1530" opacity=".6"/>
        <circle cx="118" cy="165" r="3" fill="#0d1530" opacity=".6"/>
        <circle cx="211" cy="165" r="3" fill="#0d1530" opacity=".6"/>
        <rect x="111" y="55" width="106" height="20" rx="2" fill="#0c1428" opacity=".45"/>
        <rect x="124" y="62" width="28" height="4" rx="2" fill="#4a7ad0" opacity=".8"/>
        <circle cx="186" cy="64" r="3.2" fill="#c9a84c"/>
        <circle cx="194" cy="64" r="3.2" fill="#3860a0" opacity=".7"/>
        <circle cx="202" cy="64" r="3.2" fill="#4a80c8" opacity=".65"/>
        <circle cx="164" cy="126" r="45" fill="#080e26"/>
        <circle cx="164" cy="126" r="42" fill="#101830"/>
        <circle cx="164" cy="126" r="38" fill="none" stroke="#1c2a52" strokeWidth="1.5"/>
        <circle cx="164" cy="126" r="32" fill="none" stroke="#1c2a52" strokeWidth="1.2"/>
        <circle cx="164" cy="126" r="26" fill="none" stroke="#222e58" strokeWidth="1"/>
        <circle cx="164" cy="126" r="20" fill="none" stroke="#222e58" strokeWidth=".8"/>
        <circle cx="164" cy="126" r="38" fill="#1a2450"/>
        <circle cx="164" cy="126" r="38" fill="url(#mu-cone-hl)"/>
        <circle cx="164" cy="126" r="10" fill="#080e26"/>
        <circle cx="164" cy="126" r="7" fill="#1a2e66"/>
        <circle cx="161" cy="123" r="2.8" fill="white" opacity=".22"/>
      </g>
      <path className="mu-w1" d="M84 109 Q72 126 84 143" stroke="#4060b0" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path className="mu-w2" d="M68 94 Q46 126 68 158" stroke="#3050a0" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path className="mu-w3" d="M52 79 Q20 126 52 173" stroke="#284090" strokeWidth="2.1" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── 2. Nightlife — Disco Ball ─── */
export function IconNightlife(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes nl-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes nl-sp{0%,100%{opacity:1;r:2.5}50%{opacity:.3;r:1.5}}
        @keyframes nl-glow{0%,100%{opacity:.5}50%{opacity:.9}}
        .nl-ball{animation:nl-spin 8s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
        .nl-sp1{animation:nl-sp 1.8s ease-in-out infinite}
        .nl-sp2{animation:nl-sp 1.8s .4s ease-in-out infinite}
        .nl-sp3{animation:nl-sp 1.8s .8s ease-in-out infinite}
        .nl-sp4{animation:nl-sp 1.8s 1.2s ease-in-out infinite}
        .nl-gw{animation:nl-glow 2.5s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="nl-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a0e38"/><stop offset="55%" stopColor="#3a1860"/><stop offset="100%" stopColor="#f5e8d0"/></linearGradient>
        <radialGradient id="nl-ball-rg" cx="38%" cy="32%" r="60%"><stop offset="0%" stopColor="#fff8d0"/><stop offset="35%" stopColor="#e8c840"/><stop offset="70%" stopColor="#a07818"/><stop offset="100%" stopColor="#3a2808"/></radialGradient>
        <radialGradient id="nl-glow-rg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#e8c840" stopOpacity=".5"/><stop offset="100%" stopColor="#e8c840" stopOpacity="0"/></radialGradient>
        <radialGradient id="nl-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#e8c840" stopOpacity=".2"/><stop offset="100%" stopColor="#e8c840" stopOpacity="0"/></radialGradient>
        <clipPath id="nl-clip"><circle cx="160" cy="96" r="52"/></clipPath>
        <filter id="nl-sf"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="nl-gf"><feGaussianBlur stdDeviation="14"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#nl-bg)"/>
      {/* Stars */}
      {[[30,25],[290,18],[60,70],[280,55],[45,130],[300,100],[20,160],[305,155]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity={.4+i*.05}/>
      ))}
      {/* Hanging wire */}
      <line x1="160" y1="0" x2="160" y2="44" stroke="#c8a830" strokeWidth="1.5" opacity=".8"/>
      <rect x="156" y="40" width="8" height="6" rx="1" fill="#c8a830" opacity=".9"/>
      {/* Glow behind ball */}
      <circle cx="160" cy="96" r="68" fill="url(#nl-glow-rg)" filter="url(#nl-gf)" className="nl-gw"/>
      {/* Disco ball */}
      <circle cx="160" cy="96" r="52" fill="url(#nl-ball-rg)"/>
      <g clipPath="url(#nl-clip)" className="nl-ball">
        {/* Grid of tiles */}
        {Array.from({length:8},(_,row)=>Array.from({length:14},(_,col)=>{
          const tileW=14, tileH=13, gap=1.5;
          const x=160-98+(col*(tileW+gap))+(row%2?7:0);
          const y=96-52+(row*(tileH+gap));
          const colors=["#fff8d0","#e8c840","#c8a020","#f0e060","#d4b030","#ffe88a"];
          return <rect key={`${row}-${col}`} x={x} y={y} width={tileW} height={tileH} rx="1.5" fill={colors[(row+col)%colors.length]} opacity={.7+((row+col)%3)*.1}/>;
        }))}
      </g>
      {/* Sphere overlay for 3D look */}
      <circle cx="160" cy="96" r="52" fill="none" stroke="#c8a830" strokeWidth=".5" opacity=".3"/>
      <ellipse cx="145" cy="72" rx="18" ry="10" fill="white" opacity=".15"/>
      {/* Floor glow */}
      <ellipse cx="160" cy="182" rx="55" ry="10" fill="url(#nl-flr)" filter="url(#nl-sf)"/>
      {/* Light rays / reflections */}
      <circle className="nl-sp1" cx="72"  cy="48"  r="5" fill="#ffe840"/>
      <circle className="nl-sp2" cx="250" cy="36"  r="4" fill="#f8d830"/>
      <circle className="nl-sp3" cx="40"  cy="108" r="3.5" fill="#e8c020"/>
      <circle className="nl-sp4" cx="288" cy="92"  r="4.5" fill="#ffd820"/>
      <circle className="nl-sp1" cx="230" cy="140" r="3" fill="#ffe040"/>
      <circle className="nl-sp3" cx="85"  cy="150" r="3.5" fill="#f0d030"/>
      <circle className="nl-sp2" cx="188" cy="20"  r="2.5" fill="#ffd010"/>
    </svg>
  );
}

/* ─── 3. Comedy — Vintage Microphone ─── */
export function IconComedy(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes co-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes co-pulse{0%,100%{opacity:.7}50%{opacity:.3}}
        .co-g{animation:co-float 3.5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 90%}
        .co-gl{animation:co-pulse 2s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="co-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fff8e8"/><stop offset="100%" stopColor="#fdefd0"/></linearGradient>
        <radialGradient id="co-head-rg" cx="35%" cy="30%" r="58%"><stop offset="0%" stopColor="#ffe8a0"/><stop offset="40%" stopColor="#d4a030"/><stop offset="75%" stopColor="#9a6e10"/><stop offset="100%" stopColor="#5a3e08"/></radialGradient>
        <linearGradient id="co-neck" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#c0c0c0"/><stop offset="35%" stopColor="#f0f0f0"/><stop offset="65%" stopColor="#e0e0e0"/><stop offset="100%" stopColor="#b0b0b0"/></linearGradient>
        <linearGradient id="co-base" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8d8d8"/><stop offset="100%" stopColor="#a8a8a8"/></linearGradient>
        <radialGradient id="co-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c8a030" stopOpacity=".2"/><stop offset="100%" stopColor="#c8a030" stopOpacity="0"/></radialGradient>
        <filter id="co-sf"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="co-gf"><feGaussianBlur stdDeviation="12"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#co-bg)"/>
      <circle cx="55" cy="38" r="40" fill="#ffe8a0" opacity=".18"/>
      <circle cx="278" cy="172" r="50" fill="#fcd8a0" opacity=".15"/>
      <ellipse cx="160" cy="182" rx="44" ry="8" fill="url(#co-flr)" filter="url(#co-sf)"/>
      {/* Warm glow behind head */}
      <ellipse cx="160" cy="80" rx="52" ry="50" fill="#e8c050" opacity=".08" filter="url(#co-gf)" className="co-gl"/>
      <g className="co-g">
        {/* Mic head sphere */}
        <circle cx="160" cy="78" r="44" fill="#8a6010"/>
        <circle cx="160" cy="78" r="42" fill="url(#co-head-rg)"/>
        {/* Grid mesh on head */}
        <clipPath id="co-hclip"><circle cx="160" cy="78" r="42"/></clipPath>
        <g clipPath="url(#co-hclip)" opacity=".35">
          {Array.from({length:10},(_,i)=><line key={`hv${i}`} x1="118" y1={36+i*9} x2="202" y2={36+i*9} stroke="#5a3a08" strokeWidth=".8"/>)}
          {Array.from({length:10},(_,i)=><line key={`hh${i}`} x1={118+i*8.4} y1="36" x2={118+i*8.4} y2="120" stroke="#5a3a08" strokeWidth=".8"/>)}
        </g>
        {/* Highlight on head */}
        <ellipse cx="144" cy="60" rx="14" ry="9" fill="white" opacity=".18"/>
        {/* Neck connector ring */}
        <rect x="148" y="120" width="24" height="8" rx="3" fill="#888"/>
        <rect x="150" y="121" width="20" height="6" rx="2" fill="#e0e0e0" opacity=".6"/>
        {/* Neck/stand tube */}
        <rect x="154" y="128" width="12" height="36" rx="4" fill="url(#co-neck)"/>
        {/* Grip rings */}
        {[134,140,146,152].map((y,i)=><rect key={i} x="153" y={y} width="14" height="3" rx="1.5" fill="#ccc" opacity=".6"/>)}
        {/* Base ring */}
        <ellipse cx="160" cy="166" rx="28" ry="6" fill="url(#co-base)"/>
        <ellipse cx="160" cy="164" rx="26" ry="4" fill="#d8d8d8"/>
        <ellipse cx="160" cy="163" rx="20" ry="2.5" fill="white" opacity=".3"/>
      </g>
    </svg>
  );
}

/* ─── 4. Performances — Hand Fan ─── */
export function IconPerformances(): ReactElement {
  const segments = [
    { start: -55, end: -30, color: "#c84820", hl: "#e86040" },
    { start: -30, end: -5,  color: "#d05828", hl: "#e87048" },
    { start: -5,  end: 20,  color: "#c84020", hl: "#e06038" },
    { start: 20,  end: 45,  color: "#b83018", hl: "#d05030" },
    { start: 45,  end: 70,  color: "#c84020", hl: "#e06038" },
    { start: 70,  end: 95,  color: "#d05828", hl: "#e87048" },
    { start: 95,  end: 120, color: "#c84820", hl: "#e86040" },
  ];
  const cx = 160, cy = 160, rInner = 30, rOuter = 108;
  function polar(cx: number, cy: number, r: number, deg: number) {
    const rad = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }
  function segPath(s: number, e: number, ri: number, ro: number) {
    const [x1,y1]=polar(cx,cy,ri,s);
    const [x2,y2]=polar(cx,cy,ro,s);
    const [x3,y3]=polar(cx,cy,ro,e);
    const [x4,y4]=polar(cx,cy,ri,e);
    return `M${x1},${y1} L${x2},${y2} A${ro},${ro} 0 0,1 ${x3},${y3} L${x4},${y4} A${ri},${ri} 0 0,0 ${x1},${y1}`;
  }
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes pe-float{0%,100%{transform:rotate(0deg)}50%{transform:rotate(3deg)}}
        .pe-g{animation:pe-float 4s ease-in-out infinite;transform-box:fill-box;transform-origin:160px 160px}
      `}</style>
      <defs>
        <linearGradient id="pe-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fde8d8"/><stop offset="100%" stopColor="#fff5f0"/></linearGradient>
        <radialGradient id="pe-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c84020" stopOpacity=".18"/><stop offset="100%" stopColor="#c84020" stopOpacity="0"/></radialGradient>
        <filter id="pe-sf"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#pe-bg)"/>
      <circle cx="60" cy="38" r="42" fill="#f8c0a0" opacity=".18"/>
      <circle cx="275" cy="168" r="50" fill="#fcd0b8" opacity=".14"/>
      <ellipse cx="160" cy="182" rx="38" ry="7" fill="url(#pe-flr)" filter="url(#pe-sf)"/>
      <g className="pe-g">
        {segments.map(({start,end,color,hl},i)=>(
          <g key={i}>
            <path d={segPath(start,end,rInner,rOuter)} fill={color}/>
            <path d={segPath(start,start+(end-start)*0.45,rOuter-20,rOuter-4)} fill={hl} opacity=".4"/>
            {/* Decorative dots near top */}
            {[0.25,0.5,0.75].map((t,j)=>{
              const mid=(start+end)/2;
              const [dx,dy]=polar(cx,cy,rOuter-8-j*14,mid+(start<mid?-4:4));
              return <circle key={j} cx={dx} cy={dy} r="3" fill="white" opacity=".5"/>;
            })}
            {/* Rib lines */}
            <line x1={polar(cx,cy,rInner,end)[0]} y1={polar(cx,cy,rInner,end)[1]} x2={polar(cx,cy,rOuter,end)[0]} y2={polar(cx,cy,rOuter,end)[1]} stroke="#7a1808" strokeWidth="1" opacity=".6"/>
          </g>
        ))}
        {/* Inner pivot cap */}
        <circle cx={cx} cy={cy} r={rInner} fill="#8a2010"/>
        <circle cx={cx} cy={cy} r={rInner-4} fill="#c84020"/>
        <circle cx={cx} cy={cy} r="8" fill="#a82c14"/>
        <circle cx={cx-4} cy={cy-4} r="3" fill="white" opacity=".2"/>
        {/* Handle */}
        <rect x="155" y="158" width="10" height="30" rx="4" fill="#5a2808"/>
        <rect x="156" y="159" width="4" height="28" rx="2" fill="#8a4020" opacity=".5"/>
      </g>
    </svg>
  );
}

/* ─── 5. Food & Drinks — Cloche + Champagne ─── */
export function IconFoodDrinks(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes fd-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes fd-bubble{0%{transform:translateY(0);opacity:.8}100%{transform:translateY(-30px);opacity:0}}
        .fd-g{animation:fd-float 3.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 90%}
        .fd-b1{animation:fd-bubble 2s ease-in infinite}
        .fd-b2{animation:fd-bubble 2s .6s ease-in infinite}
        .fd-b3{animation:fd-bubble 2s 1.2s ease-in infinite}
      `}</style>
      <defs>
        <linearGradient id="fd-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f5e8d0"/><stop offset="100%" stopColor="#fdf8f0"/></linearGradient>
        <radialGradient id="fd-dome" cx="35%" cy="28%" r="62%"><stop offset="0%" stopColor="#f8f8f8"/><stop offset="45%" stopColor="#d8d8d8"/><stop offset="80%" stopColor="#b8b8b8"/><stop offset="100%" stopColor="#909090"/></radialGradient>
        <linearGradient id="fd-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#d8eef8" stopOpacity=".7"/><stop offset="50%" stopColor="#f0f8ff" stopOpacity=".9"/><stop offset="100%" stopColor="#c8e0f0" stopOpacity=".6"/></linearGradient>
        <linearGradient id="fd-champ" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0d060"/><stop offset="100%" stopColor="#c8a030"/></linearGradient>
        <radialGradient id="fd-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c8a030" stopOpacity=".2"/><stop offset="100%" stopColor="#c8a030" stopOpacity="0"/></radialGradient>
        <filter id="fd-sf"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#fd-bg)"/>
      <circle cx="55" cy="38" r="42" fill="#f0d090" opacity=".16"/>
      <circle cx="278" cy="170" r="50" fill="#fce0b0" opacity=".14"/>
      <ellipse cx="148" cy="183" rx="68" ry="9" fill="url(#fd-flr)" filter="url(#fd-sf)"/>
      <g className="fd-g">
        {/* Plate */}
        <ellipse cx="140" cy="162" rx="65" ry="9" fill="#c8c8c8"/>
        <ellipse cx="140" cy="160" rx="62" ry="7" fill="#e8e8e8"/>
        <ellipse cx="140" cy="159" rx="56" ry="5" fill="white" opacity=".5"/>
        {/* Cloche dome */}
        <path d="M84,158 Q84,88 140,82 Q196,88 196,158 Z" fill="url(#fd-dome)"/>
        <path d="M84,158 Q84,88 140,82 Q196,88 196,158" fill="none" stroke="#d0d0d0" strokeWidth="1"/>
        {/* Cloche top knob */}
        <ellipse cx="140" cy="83" rx="10" ry="5" fill="#d0d0d0"/>
        <ellipse cx="140" cy="81" rx="8" ry="4" fill="#f0f0f0"/>
        <rect x="136" y="76" width="8" height="7" rx="4" fill="#c0c0c0"/>
        <ellipse cx="140" cy="77" rx="6" ry="3" fill="#f4f4f4"/>
        {/* Cloche highlight */}
        <path d="M96,140 Q90,110 104,90" stroke="white" strokeWidth="5" fill="none" opacity=".25" strokeLinecap="round"/>
        {/* Gold rim */}
        <path d="M84,158 Q84,88 140,82 Q196,88 196,158" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity=".4"/>

        {/* Champagne flute */}
        <path d="M228,88 L244,88 L240,148 L236,148 Z" fill="url(#fd-glass)"/>
        {/* Champagne liquid */}
        <path d="M229,110 L243,110 L240,148 L236,148 Z" fill="url(#fd-champ)" opacity=".7"/>
        {/* Bubbles */}
        <circle className="fd-b1" cx="237" cy="140" r="1.5" fill="white" opacity=".8"/>
        <circle className="fd-b2" cx="235" cy="135" r="1.2" fill="white" opacity=".8"/>
        <circle className="fd-b3" cx="239" cy="130" r="1.5" fill="white" opacity=".8"/>
        {/* Glass stem */}
        <rect x="234" y="148" width="4" height="18" rx="1.5" fill="#d0e8f0" opacity=".7"/>
        {/* Glass base */}
        <ellipse cx="236" cy="166" rx="12" ry="3" fill="#c0d8e8" opacity=".6"/>
        <ellipse cx="236" cy="165" rx="10" ry="2" fill="white" opacity=".3"/>
        {/* Glass rim */}
        <rect x="227" y="86" width="18" height="3" rx="1.5" fill="#d0e8f8" opacity=".6"/>
        {/* Glass highlight */}
        <line x1="230" y1="90" x2="230" y2="145" stroke="white" strokeWidth="1.5" opacity=".35"/>
      </g>
    </svg>
  );
}

/* ─── 6. Fests & Fairs — Carnival Tent ─── */
export function IconFestsFairs(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes ff-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes ff-flag{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
        .ff-g{animation:ff-float 3.5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 90%}
        .ff-flag{animation:ff-flag 2s ease-in-out infinite;transform-box:fill-box;transform-origin:0% 50%}
      `}</style>
      <defs>
        <linearGradient id="ff-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fde8f0"/><stop offset="100%" stopColor="#fff5f8"/></linearGradient>
        <linearGradient id="ff-stripe1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e83878"/><stop offset="100%" stopColor="#c82860"/></linearGradient>
        <linearGradient id="ff-top1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e83878"/><stop offset="100%" stopColor="#c02060"/></linearGradient>
        <linearGradient id="ff-top2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8f0e8"/><stop offset="100%" stopColor="#e8d8c8"/></linearGradient>
        <radialGradient id="ff-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#e83878" stopOpacity=".18"/><stop offset="100%" stopColor="#e83878" stopOpacity="0"/></radialGradient>
        <filter id="ff-sf"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#ff-bg)"/>
      <circle cx="58" cy="38" r="44" fill="#f8b0cc" opacity=".18"/>
      <circle cx="280" cy="168" r="52" fill="#fcc0d8" opacity=".14"/>
      <ellipse cx="160" cy="183" rx="64" ry="9" fill="url(#ff-flr)" filter="url(#ff-sf)"/>
      <g className="ff-g">
        {/* Tent body with stripes */}
        {[0,1,2,3,4,5].map(i=>(
          <rect key={i} x={104+i*19} y="110" width="19" height="62" fill={i%2===0?"url(#ff-stripe1)":"#fef0e8"}/>
        ))}
        {/* Side walls shadow */}
        <rect x="104" y="110" width="114" height="62" fill="none" stroke="#c02060" strokeWidth="1" opacity=".3"/>
        {/* Entrance arch */}
        <path d="M140,172 L140,138 Q160,124 180,138 L180,172 Z" fill="#3a0820" opacity=".85"/>
        <path d="M140,138 Q160,124 180,138" stroke="#e83878" strokeWidth="2" fill="none"/>
        {/* Scalloped top edge */}
        {[0,1,2,3,4,5,6].map(i=>(
          <path key={i} d={`M${104+i*19},110 Q${113+i*19},100 ${123+i*19},110`} fill={i%2===0?"url(#ff-top1)":"url(#ff-top2)"} stroke="#c02060" strokeWidth=".5"/>
        ))}
        {/* Peaked roof peaks */}
        {[0,1,2].map(i=>(
          <polygon key={i} points={`${114+i*38},110 ${133+i*38},110 ${123.5+i*38},70`} fill={i%2===0?"url(#ff-top1)":"url(#ff-top2)"} stroke="#b01850" strokeWidth=".8"/>
        ))}
        {/* Center main peak */}
        <polygon points="137,110 183,110 160,52" fill="url(#ff-top1)" stroke="#a01848" strokeWidth="1"/>
        {/* Flag pole */}
        <line x1="160" y1="52" x2="160" y2="28" stroke="#8a5030" strokeWidth="2.5"/>
        {/* Flag */}
        <path className="ff-flag" d="M160,28 L190,36 L160,44 Z" fill="#4a28a0"/>
        <circle cx="160" cy="27" r="2.5" fill="#c8a030"/>
        {/* Highlight on front stripe */}
        <rect x="104" y="110" width="4" height="62" fill="white" opacity=".1"/>
      </g>
    </svg>
  );
}

/* ─── 7. Social Mixers — Champagne Glasses ─── */
export function IconSocialMixers(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes sm-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes sm-bubble{0%{transform:translateY(0);opacity:.8}100%{transform:translateY(-28px);opacity:0}}
        @keyframes sm-sparkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.2;transform:scale(.5)}}
        .sm-g{animation:sm-float 3.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 90%}
        .sm-b1{animation:sm-bubble 2.2s ease-in infinite}
        .sm-b2{animation:sm-bubble 2.2s .5s ease-in infinite}
        .sm-b3{animation:sm-bubble 2.2s 1s ease-in infinite}
        .sm-b4{animation:sm-bubble 2.2s .8s ease-in infinite}
        .sm-sp{animation:sm-sparkle 1.5s ease-in-out infinite}
        .sm-sp2{animation:sm-sparkle 1.5s .5s ease-in-out infinite}
        .sm-sp3{animation:sm-sparkle 1.5s 1s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="sm-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef0d8"/><stop offset="100%" stopColor="#fff8f0"/></linearGradient>
        <linearGradient id="sm-gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#d8eef8" stopOpacity=".7"/><stop offset="50%" stopColor="#f4f8ff" stopOpacity=".9"/><stop offset="100%" stopColor="#c8e0f0" stopOpacity=".6"/></linearGradient>
        <linearGradient id="sm-liq" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0d868"/><stop offset="100%" stopColor="#c89828"/></linearGradient>
        <radialGradient id="sm-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d0a030" stopOpacity=".22"/><stop offset="100%" stopColor="#d0a030" stopOpacity="0"/></radialGradient>
        <filter id="sm-sf"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#sm-bg)"/>
      <circle cx="58" cy="36" r="44" fill="#f0d090" opacity=".17"/>
      <circle cx="278" cy="170" r="52" fill="#fce0a0" opacity=".14"/>
      <ellipse cx="160" cy="184" rx="60" ry="8" fill="url(#sm-flr)" filter="url(#sm-sf)"/>
      <g className="sm-g">
        {/* Left glass — tilted right */}
        <g transform="rotate(12,128,92)">
          <path d="M112,60 L144,60 L138,128 L118,128 Z" fill="url(#sm-gl)"/>
          <path d="M113,90 L143,90 L138,128 L118,128 Z" fill="url(#sm-liq)" opacity=".7"/>
          <circle className="sm-b1" cx="128" cy="122" r="1.5" fill="white" opacity=".8"/>
          <circle className="sm-b2" cx="124" cy="115" r="1.2" fill="white" opacity=".7"/>
          <rect x="121" y="128" width="14" height="16" rx="2" fill="#d0e8f0" opacity=".6"/>
          <ellipse cx="128" cy="144" rx="18" ry="3.5" fill="#c0d8e8" opacity=".6"/>
          <rect x="110" y="57" width="36" height="5" rx="2.5" fill="#d8eef8" opacity=".7"/>
          <line x1="118" y1="64" x2="115" y2="125" stroke="white" strokeWidth="2" opacity=".3"/>
        </g>
        {/* Right glass — tilted left */}
        <g transform="rotate(-12,192,92)">
          <path d="M176,60 L208,60 L202,128 L182,128 Z" fill="url(#sm-gl)"/>
          <path d="M177,90 L207,90 L202,128 L182,128 Z" fill="url(#sm-liq)" opacity=".7"/>
          <circle className="sm-b3" cx="192" cy="120" r="1.5" fill="white" opacity=".8"/>
          <circle className="sm-b4" cx="196" cy="113" r="1.2" fill="white" opacity=".7"/>
          <rect x="185" y="128" width="14" height="16" rx="2" fill="#d0e8f0" opacity=".6"/>
          <ellipse cx="192" cy="144" rx="18" ry="3.5" fill="#c0d8e8" opacity=".6"/>
          <rect x="174" y="57" width="36" height="5" rx="2.5" fill="#d8eef8" opacity=".7"/>
          <line x1="200" y1="64" x2="203" y2="125" stroke="white" strokeWidth="2" opacity=".3"/>
        </g>
        {/* Clink sparkle at top */}
        <circle className="sm-sp" cx="160" cy="58" r="4" fill="#f8d840"/>
        <line className="sm-sp2" x1="154" y1="52" x2="148" y2="46" stroke="#f8d840" strokeWidth="2" strokeLinecap="round"/>
        <line className="sm-sp2" x1="166" y1="52" x2="172" y2="46" stroke="#f8d840" strokeWidth="2" strokeLinecap="round"/>
        <line className="sm-sp3" x1="160" y1="50" x2="160" y2="42" stroke="#f8d840" strokeWidth="2" strokeLinecap="round"/>
        <line className="sm-sp3" x1="155" y1="55" x2="148" y2="58" stroke="#f8d840" strokeWidth="2" strokeLinecap="round"/>
        <line className="sm-sp3" x1="165" y1="55" x2="172" y2="58" stroke="#f8d840" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

/* ─── 8. Screenings — Film Projector ─── */
export function IconScreenings(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes sc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes sc-beam{0%,100%{opacity:.25}50%{opacity:.12}}
        @keyframes sc-reel{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .sc-g{animation:sc-float 3.5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 90%}
        .sc-beam{animation:sc-beam 2s ease-in-out infinite}
        .sc-reel{animation:sc-reel 4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
      `}</style>
      <defs>
        <linearGradient id="sc-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e8eef8"/><stop offset="100%" stopColor="#f5f8ff"/></linearGradient>
        <linearGradient id="sc-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#505870"/><stop offset="100%" stopColor="#303048"/></linearGradient>
        <linearGradient id="sc-lens" cx="35%" cy="32%" r="55%"><stop offset="0%" stopColor="#c8e0f8"/><stop offset="50%" stopColor="#7090b8"/><stop offset="100%" stopColor="#304060"/></linearGradient>
        <radialGradient id="sc-lens-rg" cx="35%" cy="32%" r="55%"><stop offset="0%" stopColor="#c8e0f8"/><stop offset="50%" stopColor="#6080b0"/><stop offset="100%" stopColor="#283850"/></radialGradient>
        <radialGradient id="sc-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#5060a0" stopOpacity=".2"/><stop offset="100%" stopColor="#5060a0" stopOpacity="0"/></radialGradient>
        <filter id="sc-sf"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#sc-bg)"/>
      <circle cx="56" cy="36" r="44" fill="#b0c4e8" opacity=".16"/>
      <circle cx="282" cy="170" r="52" fill="#c0cef0" opacity=".13"/>
      <ellipse cx="160" cy="183" rx="64" ry="9" fill="url(#sc-flr)" filter="url(#sc-sf)"/>
      {/* Light beam */}
      <path className="sc-beam" d="M108,104 L30,68 L30,140 Z" fill="#f8f4d0"/>
      <g className="sc-g">
        {/* Projector body */}
        <rect x="108" y="86" width="114" height="56" rx="8" fill="url(#sc-body)"/>
        {/* Body highlight */}
        <rect x="109" y="87" width="112" height="3" rx="2" fill="white" opacity=".15"/>
        {/* Body rivets */}
        <circle cx="118" cy="96" r="2.5" fill="#606880" opacity=".7"/>
        <circle cx="214" cy="96" r="2.5" fill="#606880" opacity=".7"/>
        <circle cx="118" cy="132" r="2.5" fill="#606880" opacity=".7"/>
        <circle cx="214" cy="132" r="2.5" fill="#606880" opacity=".7"/>
        {/* Lens housing ring */}
        <circle cx="108" cy="114" r="22" fill="#404258"/>
        <circle cx="108" cy="114" r="19" fill="url(#sc-lens-rg)"/>
        <circle cx="108" cy="114" r="14" fill="#283850"/>
        <circle cx="108" cy="114" r="10" fill="#304868"/>
        <circle cx="104" cy="110" r="3.5" fill="white" opacity=".2"/>
        {/* Lens rings */}
        <circle cx="108" cy="114" r="17" fill="none" stroke="#6080a8" strokeWidth="1"/>
        <circle cx="108" cy="114" r="13" fill="none" stroke="#4868a0" strokeWidth=".8"/>
        {/* Film reel top */}
        <circle className="sc-reel" cx="172" cy="78" r="20" fill="#3a3c52"/>
        <circle cx="172" cy="78" r="20" fill="none" stroke="#505268" strokeWidth="2"/>
        {[0,60,120,180,240,300].map((deg,i)=>{
          const rad=deg*Math.PI/180;
          return <line key={i} x1={172} y1={78} x2={172+16*Math.cos(rad)} y2={78+16*Math.sin(rad)} stroke="#606278" strokeWidth="1.5"/>;
        })}
        <circle cx="172" cy="78" r="5" fill="#606278"/>
        <circle cx="172" cy="78" r="3" fill="#808498"/>
        {/* Reel hub */}
        <circle cx="172" cy="78" r="8" fill="none" stroke="#505268" strokeWidth="1.5"/>
        {/* Film strip out of reel */}
        <path d="M156,86 Q148,96 148,106 L108,106" stroke="#3a3c52" strokeWidth="4" fill="none"/>
        <path d="M156,86 Q148,96 148,106 L108,106" stroke="#505268" strokeWidth="2" fill="none"/>
        {/* Control knob */}
        <circle cx="200" cy="90" r="7" fill="#404258"/>
        <circle cx="200" cy="90" r="5" fill="#606880"/>
        <circle cx="198" cy="88" r="2" fill="white" opacity=".2"/>
        {/* Legs */}
        <rect x="130" y="142" width="10" height="24" rx="3" fill="#404258"/>
        <rect x="182" y="142" width="10" height="24" rx="3" fill="#404258"/>
        <rect x="124" y="163" width="22" height="5" rx="2" fill="#383850"/>
        <rect x="176" y="163" width="22" height="5" rx="2" fill="#383850"/>
      </g>
    </svg>
  );
}

/* ─── 9. Fitness — Dumbbell ─── */
export function IconFitness(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes fi-float{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-6px) rotate(-8deg)}}
        .fi-g{animation:fi-float 3.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 60%}
      `}</style>
      <defs>
        <linearGradient id="fi-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e8d8f8"/><stop offset="100%" stopColor="#f5f0ff"/></linearGradient>
        <linearGradient id="fi-disc-l" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4a2878"/><stop offset="40%" stopColor="#7a48b0"/><stop offset="100%" stopColor="#3a2068"/></linearGradient>
        <linearGradient id="fi-disc-r" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3a2068"/><stop offset="60%" stopColor="#6a3ca0"/><stop offset="100%" stopColor="#4a2878"/></linearGradient>
        <linearGradient id="fi-bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8c8e8"/><stop offset="40%" stopColor="#f0e8f8"/><stop offset="100%" stopColor="#b8a8d0"/></linearGradient>
        <radialGradient id="fi-disc-hl-l" cx="30%" cy="30%" r="55%"><stop offset="0%" stopColor="#b090d8" stopOpacity=".6"/><stop offset="100%" stopColor="#3a2068" stopOpacity="0"/></radialGradient>
        <radialGradient id="fi-disc-hl-r" cx="70%" cy="30%" r="55%"><stop offset="0%" stopColor="#9070c0" stopOpacity=".5"/><stop offset="100%" stopColor="#3a2068" stopOpacity="0"/></radialGradient>
        <radialGradient id="fi-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#5030a0" stopOpacity=".22"/><stop offset="100%" stopColor="#5030a0" stopOpacity="0"/></radialGradient>
        <filter id="fi-sf"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#fi-bg)"/>
      <circle cx="56" cy="36" r="46" fill="#c8a8e8" opacity=".17"/>
      <circle cx="282" cy="170" r="54" fill="#d0b8f0" opacity=".13"/>
      <ellipse cx="155" cy="182" rx="68" ry="10" fill="url(#fi-flr)" filter="url(#fi-sf)"/>
      <g className="fi-g">
        {/* Left disc outer */}
        <rect x="68" y="78" width="44" height="56" rx="10" fill="url(#fi-disc-l)"/>
        <rect x="68" y="78" width="44" height="56" rx="10" fill="url(#fi-disc-hl-l)"/>
        {/* Left disc inner collar */}
        <rect x="100" y="89" width="14" height="34" rx="5" fill="#2a1858"/>
        <rect x="102" y="91" width="10" height="30" rx="4" fill="#4a2878"/>
        {/* Bar */}
        <rect x="114" y="95" width="92" height="22" rx="7" fill="url(#fi-bar)"/>
        <rect x="115" y="96" width="90" height="5" rx="3" fill="white" opacity=".3"/>
        {/* Right disc inner collar */}
        <rect x="206" y="89" width="14" height="34" rx="5" fill="#2a1858"/>
        <rect x="208" y="91" width="10" height="30" rx="4" fill="#4a2878"/>
        {/* Right disc outer */}
        <rect x="208" y="78" width="44" height="56" rx="10" fill="url(#fi-disc-r)"/>
        <rect x="208" y="78" width="44" height="56" rx="10" fill="url(#fi-disc-hl-r)"/>
        {/* Left disc detail rings */}
        <rect x="72" y="85" width="36" height="2" rx="1" fill="white" opacity=".1"/>
        <rect x="72" y="125" width="36" height="2" rx="1" fill="white" opacity=".08"/>
        <circle cx="90" cy="106" r="8" fill="#3a2068" opacity=".5"/>
        <circle cx="90" cy="106" r="5" fill="#2a1858" opacity=".6"/>
        {/* Right disc detail rings */}
        <rect x="212" y="85" width="36" height="2" rx="1" fill="white" opacity=".1"/>
        <rect x="212" y="125" width="36" height="2" rx="1" fill="white" opacity=".08"/>
        <circle cx="230" cy="106" r="8" fill="#3a2068" opacity=".5"/>
        <circle cx="230" cy="106" r="5" fill="#2a1858" opacity=".6"/>
      </g>
    </svg>
  );
}

/* ─── 10. Art Exhibitions — Framed Painting ─── */
export function IconArtExhibitions(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes ae-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .ae-g{animation:ae-float 4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
      `}</style>
      <defs>
        <linearGradient id="ae-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f5e8d0"/><stop offset="100%" stopColor="#fdf8f0"/></linearGradient>
        <linearGradient id="ae-frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e8c060"/><stop offset="35%" stopColor="#c9a040"/><stop offset="70%" stopColor="#a87828"/><stop offset="100%" stopColor="#c9a040"/></linearGradient>
        <linearGradient id="ae-canvas" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8e0d8"/><stop offset="100%" stopColor="#d8cec4"/></linearGradient>
        <radialGradient id="ae-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c8a030" stopOpacity=".18"/><stop offset="100%" stopColor="#c8a030" stopOpacity="0"/></radialGradient>
        <filter id="ae-sf"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="ae-gf"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="320" height="200" fill="url(#ae-bg)"/>
      <circle cx="56" cy="36" r="44" fill="#f0d090" opacity=".16"/>
      <circle cx="280" cy="170" r="52" fill="#fce0a0" opacity=".14"/>
      <ellipse cx="160" cy="183" rx="56" ry="8" fill="url(#ae-flr)" filter="url(#ae-sf)"/>
      <g className="ae-g">
        {/* Frame shadow */}
        <rect x="97" y="36" width="126" height="110" rx="4" fill="#8a6020" opacity=".18" filter="url(#ae-sf)"/>
        {/* Outer frame */}
        <rect x="92" y="30" width="136" height="116" rx="6" fill="url(#ae-frame)"/>
        {/* Frame bevel inner */}
        <rect x="97" y="35" width="126" height="106" rx="4" fill="#b88830"/>
        {/* Canvas */}
        <rect x="104" y="42" width="112" height="92" rx="2" fill="url(#ae-canvas)"/>
        {/* Painting — abstract landscape */}
        {/* Sky */}
        <rect x="104" y="42" width="112" height="44" rx="2" fill="#8ab0d8"/>
        <rect x="104" y="42" width="112" height="20" fill="#a0c0e8"/>
        {/* Sun */}
        <circle cx="182" cy="56" r="12" fill="#f0d060" opacity=".9" filter="url(#ae-gf)"/>
        {/* Clouds */}
        <ellipse cx="130" cy="54" rx="18" ry="7" fill="white" opacity=".7"/>
        <ellipse cx="144" cy="51" rx="12" ry="6" fill="white" opacity=".8"/>
        {/* Ground */}
        <rect x="104" y="86" width="112" height="48" rx="0" fill="#7a9840"/>
        {/* Hills */}
        <ellipse cx="130" cy="88" rx="30" ry="16" fill="#5a7828"/>
        <ellipse cx="185" cy="90" rx="28" ry="14" fill="#6a8832"/>
        {/* Trees silhouettes */}
        <rect x="115" y="76" width="5" height="18" fill="#3a5018" opacity=".7"/>
        <ellipse cx="117" cy="75" rx="8" ry="10" fill="#3a5018" opacity=".7"/>
        <rect x="200" y="78" width="5" height="16" fill="#3a5018" opacity=".7"/>
        <ellipse cx="202" cy="77" rx="7" ry="9" fill="#3a5018" opacity=".7"/>
        {/* Path */}
        <path d="M148,134 Q155,110 162,100 Q168,110 172,134" fill="#c8b070" opacity=".6"/>
        {/* Frame corner ornaments */}
        <circle cx="92" cy="30" r="5" fill="#e8c860"/>
        <circle cx="228" cy="30" r="5" fill="#e8c860"/>
        <circle cx="92" cy="146" r="5" fill="#e8c860"/>
        <circle cx="228" cy="146" r="5" fill="#e8c860"/>
        {/* Frame highlight */}
        <rect x="93" y="31" width="134" height="3" rx="1" fill="white" opacity=".2"/>
        <rect x="93" y="31" width="3" height="114" rx="1" fill="white" opacity=".15"/>
      </g>
      {/* Stanchion left */}
      <rect x="110" y="152" width="5" height="36" rx="2" fill="#b8a080"/>
      <ellipse cx="112" cy="186" rx="14" ry="4" fill="#a08860"/>
      <ellipse cx="112" cy="153" rx="6" ry="2" fill="#c8b080"/>
      {/* Stanchion right */}
      <rect x="205" y="152" width="5" height="36" rx="2" fill="#b8a080"/>
      <ellipse cx="207" cy="186" rx="14" ry="4" fill="#a08860"/>
      <ellipse cx="207" cy="153" rx="6" ry="2" fill="#c8b080"/>
      {/* Rope */}
      <path d="M112,156 Q160,168 207,156" stroke="#800020" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M112,156 Q160,168 207,156" stroke="#a00028" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5"/>
    </svg>
  );
}

/* ─── 11. Conferences — Podium ─── */
export function IconConferences(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes cf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes cf-pulse{0%,100%{opacity:.7}50%{opacity:.3}}
        .cf-g{animation:cf-float 3.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 90%}
        .cf-ml{animation:cf-pulse 2s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="cf-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#deeef0"/><stop offset="100%" stopColor="#f0f5f8"/></linearGradient>
        <linearGradient id="cf-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a8090"/><stop offset="100%" stopColor="#2a5060"/></linearGradient>
        <linearGradient id="cf-top-f" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#4a8090"/><stop offset="100%" stopColor="#60a0b0"/></linearGradient>
        <linearGradient id="cf-side-f" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#285060"/><stop offset="100%" stopColor="#1a3840"/></linearGradient>
        <linearGradient id="cf-lectern" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5090a0"/><stop offset="100%" stopColor="#306070"/></linearGradient>
        <radialGradient id="cf-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#2a6070" stopOpacity=".22"/><stop offset="100%" stopColor="#2a6070" stopOpacity="0"/></radialGradient>
        <filter id="cf-sf"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#cf-bg)"/>
      <circle cx="56" cy="36" r="44" fill="#a8ccd8" opacity=".17"/>
      <circle cx="282" cy="170" r="52" fill="#b8d4e0" opacity=".14"/>
      <ellipse cx="160" cy="184" rx="62" ry="9" fill="url(#cf-flr)" filter="url(#cf-sf)"/>
      <g className="cf-g">
        {/* Podium 3D — top face */}
        <polygon points="112,88 208,88 218,78 122,78" fill="url(#cf-top-f)"/>
        {/* Podium 3D — right face */}
        <polygon points="208,88 218,78 218,168 208,178" fill="url(#cf-side-f)"/>
        {/* Podium front face */}
        <rect x="112" y="88" width="96" height="90" rx="4" fill="url(#cf-front)"/>
        {/* Front face highlight */}
        <rect x="113" y="89" width="94" height="2" rx="1" fill="white" opacity=".2"/>
        {/* Lectern top angled face */}
        <polygon points="118,88 202,88 218,68 102,68" fill="url(#cf-lectern)"/>
        <polygon points="118,88 102,68 102,88" fill="#285060"/>
        <polygon points="202,88 218,68 218,88" fill="#1a3840"/>
        {/* Lectern top surface */}
        <rect x="104" y="68" width="112" height="4" rx="2" fill="#70b0c0"/>
        <rect x="105" y="69" width="110" height="2" rx="1" fill="white" opacity=".2"/>
        {/* Papers/notes on lectern */}
        <rect x="118" y="72" width="64" height="16" rx="2" fill="white" opacity=".85"/>
        <line x1="122" y1="76" x2="178" y2="76" stroke="#808080" strokeWidth="1" opacity=".5"/>
        <line x1="122" y1="79" x2="170" y2="79" stroke="#808080" strokeWidth="1" opacity=".5"/>
        <line x1="122" y1="82" x2="175" y2="82" stroke="#808080" strokeWidth="1" opacity=".5"/>
        {/* Mic stand on lectern */}
        <rect x="157" y="58" width="6" height="14" rx="2" fill="#506070"/>
        <rect x="155" y="56" width="10" height="5" rx="2" fill="#608090"/>
        {/* Mic head */}
        <ellipse cx="160" cy="54" rx="7" ry="5" fill="#404858"/>
        <ellipse cx="160" cy="52" rx="6" ry="4" fill="#5a6878"/>
        <circle className="cf-ml" cx="160" cy="50" r="2.5" fill="#80c0d0"/>
        {/* Logo badge on front */}
        <rect x="142" y="110" width="36" height="24" rx="4" fill="#2a5060" opacity=".5"/>
        <rect x="144" y="112" width="32" height="20" rx="3" fill="#3a7080" opacity=".4"/>
        <line x1="148" y1="118" x2="172" y2="118" stroke="white" strokeWidth="1.5" opacity=".4"/>
        <line x1="150" y1="122" x2="170" y2="122" stroke="white" strokeWidth="1" opacity=".3"/>
        <line x1="148" y1="126" x2="172" y2="126" stroke="white" strokeWidth="1.5" opacity=".4"/>
        {/* Bottom edge highlight */}
        <rect x="113" y="176" width="94" height="2" rx="1" fill="white" opacity=".12"/>
      </g>
    </svg>
  );
}

/* ─── 12. Open Mics — Handheld Mic ─── */
export function IconOpenMics(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes om-float{0%,100%{transform:rotate(-12deg) translateY(0)}50%{transform:rotate(-12deg) translateY(-6px)}}
        @keyframes om-sp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.2;transform:scale(.4)}}
        @keyframes om-note{0%{transform:translate(0,0);opacity:1}100%{transform:translate(10px,-25px);opacity:0}}
        @keyframes om-glow{0%,100%{opacity:.5}50%{opacity:.9}}
        .om-g{animation:om-float 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 70%}
        .om-sp1{animation:om-sp 1.6s ease-in-out infinite}
        .om-sp2{animation:om-sp 1.6s .4s ease-in-out infinite}
        .om-sp3{animation:om-sp 1.6s .8s ease-in-out infinite}
        .om-sp4{animation:om-sp 1.6s 1.2s ease-in-out infinite}
        .om-n1{animation:om-note 2s ease-out infinite}
        .om-n2{animation:om-note 2s .7s ease-out infinite}
        .om-gw{animation:om-glow 2.5s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="om-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e8d8ff"/><stop offset="100%" stopColor="#f5f0ff"/></linearGradient>
        <radialGradient id="om-head-rg" cx="35%" cy="28%" r="60%"><stop offset="0%" stopColor="#c0a0f8"/><stop offset="35%" stopColor="#7848d8"/><stop offset="75%" stopColor="#4820a0"/><stop offset="100%" stopColor="#220860"/></radialGradient>
        <linearGradient id="om-handle" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3820a0"/><stop offset="30%" stopColor="#6040c0"/><stop offset="60%" stopColor="#5030b0"/><stop offset="100%" stopColor="#2818a0"/></linearGradient>
        <linearGradient id="om-grip" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#c0b8d0"/><stop offset="50%" stopColor="#e8e0f4"/><stop offset="100%" stopColor="#b0a8c8"/></linearGradient>
        <radialGradient id="om-glow-rg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8050e0" stopOpacity=".5"/><stop offset="100%" stopColor="#8050e0" stopOpacity="0"/></radialGradient>
        <radialGradient id="om-flr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#5030b0" stopOpacity=".22"/><stop offset="100%" stopColor="#5030b0" stopOpacity="0"/></radialGradient>
        <clipPath id="om-hclip"><circle cx="160" cy="82" r="40"/></clipPath>
        <filter id="om-sf"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="om-gf"><feGaussianBlur stdDeviation="16"/></filter>
      </defs>
      <rect width="320" height="200" fill="url(#om-bg)"/>
      <circle cx="56" cy="36" r="46" fill="#c8a8f0" opacity=".17"/>
      <circle cx="282" cy="170" r="54" fill="#d0b8f8" opacity=".13"/>
      <ellipse cx="160" cy="184" rx="44" ry="8" fill="url(#om-flr)" filter="url(#om-sf)"/>
      {/* Glow behind mic */}
      <circle cx="160" cy="82" r="58" fill="url(#om-glow-rg)" filter="url(#om-gf)" className="om-gw"/>
      <g className="om-g">
        {/* Handle */}
        <rect x="148" y="122" width="24" height="60" rx="12" fill="url(#om-handle)"/>
        {/* Handle highlight */}
        <rect x="151" y="123" width="8" height="58" rx="4" fill="white" opacity=".12"/>
        {/* Grip rings */}
        {[130,137,144,151,158].map((y,i)=>(
          <rect key={i} x="147" y={y} width="26" height="3.5" rx="1.5" fill="url(#om-grip)" opacity=".4"/>
        ))}
        {/* Connector ring */}
        <rect x="147" y="120" width="26" height="6" rx="3" fill="#2818a0"/>
        <rect x="149" y="121" width="22" height="4" rx="2" fill="#5040b0" opacity=".6"/>
        {/* Mic head sphere */}
        <circle cx="160" cy="82" r="42" fill="#220860"/>
        <circle cx="160" cy="82" r="40" fill="url(#om-head-rg)"/>
        {/* Grid mesh */}
        <g clipPath="url(#om-hclip)" opacity=".28">
          {Array.from({length:9},(_,i)=><line key={`hv${i}`} x1="120" y1={42+i*9} x2="200" y2={42+i*9} stroke="#1a0840" strokeWidth=".9"/>)}
          {Array.from({length:9},(_,i)=><line key={`hh${i}`} x1={120+i*10} y1="42" x2={120+i*10} y2="122" stroke="#1a0840" strokeWidth=".9"/>)}
        </g>
        {/* Head highlight */}
        <ellipse cx="145" cy="62" rx="14" ry="10" fill="white" opacity=".18"/>
        {/* Center glow dot */}
        <circle cx="160" cy="82" r="8" fill="#a080f0" opacity=".3"/>
      </g>
      {/* Sparkles */}
      <circle className="om-sp1" cx="70"  cy="68"  r="5"   fill="#f0d840"/>
      <circle className="om-sp2" cx="258" cy="52"  r="4"   fill="#c080f0"/>
      <circle className="om-sp3" cx="50"  cy="128" r="3.5" fill="#f0a840"/>
      <circle className="om-sp4" cx="275" cy="110" r="4.5" fill="#80c0f8"/>
      <circle className="om-sp1" cx="240" cy="155" r="3"   fill="#f0d840"/>
      {/* Floating music notes */}
      <text className="om-n1" x="72" y="105" fill="#8050d0" fontSize="18" opacity=".7">♪</text>
      <text className="om-n2" x="238" y="88" fill="#9060e0" fontSize="14" opacity=".6">♫</text>
    </svg>
  );
}
