/*
  Premium scene-illustration SVGs — Apple iOS designer quality.
  Rich gradient skies, depth layering, bokeh, glow filters, material textures.
  viewBox="0 0 320 200" landscape scenes for card headers.
*/
import type { ReactElement } from "react";

/* ─── 1. Photography — Dusk Ceremony ──────────────────────────── */
export function IconPhotography(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes ph-bokeh { 0%,100%{opacity:.8} 50%{opacity:.2} }
        @keyframes ph-petal  { 0%{transform:translate(0,0) rotate(0deg);opacity:.9} 100%{transform:translate(8px,28px) rotate(200deg);opacity:0} }
        @keyframes ph-string { 0%,100%{opacity:.9} 50%{opacity:.5} }
        @keyframes ph-sway   { 0%,100%{transform:rotate(-1deg)} 50%{transform:rotate(1.5deg)} }
        .ph-b1{animation:ph-bokeh 2.3s ease-in-out infinite}
        .ph-b2{animation:ph-bokeh 2.3s .6s ease-in-out infinite}
        .ph-b3{animation:ph-bokeh 2.3s 1.1s ease-in-out infinite}
        .ph-b4{animation:ph-bokeh 2.3s 1.7s ease-in-out infinite}
        .ph-b5{animation:ph-bokeh 2.3s 0.9s ease-in-out infinite}
        .ph-p1{transform-box:fill-box;transform-origin:50% 0%;animation:ph-petal 4s ease-in infinite}
        .ph-p2{transform-box:fill-box;transform-origin:50% 0%;animation:ph-petal 4s .9s ease-in infinite}
        .ph-p3{transform-box:fill-box;transform-origin:50% 0%;animation:ph-petal 4s 1.9s ease-in infinite}
        .ph-sl{animation:ph-string 1.8s ease-in-out infinite}
        .ph-sway{transform-box:fill-box;transform-origin:50% 0%;animation:ph-sway 4s ease-in-out infinite}
      `}</style>
      <defs>
        {/* Rich dusk sky */}
        <linearGradient id="ph-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0c0618"/>
          <stop offset="22%"  stopColor="#38100c"/>
          <stop offset="48%"  stopColor="#8a3018"/>
          <stop offset="72%"  stopColor="#c86028"/>
          <stop offset="100%" stopColor="#f0a848"/>
        </linearGradient>
        {/* Ground */}
        <linearGradient id="ph-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0e06"/>
          <stop offset="100%" stopColor="#0a0804"/>
        </linearGradient>
        {/* Arch glow */}
        <radialGradient id="ph-archglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f0c060" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#f0c060" stopOpacity="0"/>
        </radialGradient>
        {/* Bokeh blur */}
        <filter id="ph-blur-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5"/>
        </filter>
        <filter id="ph-blur-lg" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7"/>
        </filter>
        {/* Glow merge for arch lights */}
        <filter id="ph-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Horizon haze */}
        <radialGradient id="ph-haze" cx="50%" cy="100%" r="60%">
          <stop offset="0%"   stopColor="#f09030" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#f09030" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="320" height="200" fill="url(#ph-sky)"/>

      {/* Horizon haze glow */}
      <ellipse cx="160" cy="135" rx="180" ry="55" fill="url(#ph-haze)"/>

      {/* Distant tree silhouettes */}
      <ellipse cx="18"  cy="108" rx="16" ry="28" fill="#0d0408" opacity="0.9"/>
      <rect x="15"   y="108" width="6"  height="22" fill="#0d0408" opacity="0.9"/>
      <ellipse cx="38"  cy="102" rx="14" ry="32" fill="#0d0408" opacity="0.9"/>
      <rect x="35"   y="102" width="6"  height="28" fill="#0d0408" opacity="0.9"/>
      <ellipse cx="272" cy="106" rx="15" ry="30" fill="#0d0408" opacity="0.9"/>
      <rect x="269"  y="106" width="6"  height="24" fill="#0d0408" opacity="0.9"/>
      <ellipse cx="295" cy="100" rx="18" ry="35" fill="#0d0408" opacity="0.9"/>
      <rect x="292"  y="100" width="7"  height="30" fill="#0d0408" opacity="0.9"/>

      {/* Background bokeh (blurred) */}
      <circle className="ph-b1" cx="60"  cy="75"  r="10" fill="#f8b040" opacity="0.22" filter="url(#ph-blur-lg)"/>
      <circle className="ph-b2" cx="250" cy="60"  r="14" fill="#e87030" opacity="0.18" filter="url(#ph-blur-lg)"/>
      <circle className="ph-b3" cx="100" cy="50"  r="8"  fill="#f0d080" opacity="0.15" filter="url(#ph-blur-lg)"/>
      <circle className="ph-b4" cx="220" cy="85"  r="11" fill="#f8b040" opacity="0.2"  filter="url(#ph-blur-lg)"/>
      <circle className="ph-b5" cx="160" cy="40"  r="7"  fill="#ffd080" opacity="0.12" filter="url(#ph-blur-lg)"/>

      {/* Floral arch — left post */}
      <rect x="95" y="78" width="7" height="62" fill="#1a0c06" rx="2"/>
      {/* Floral arch — right post */}
      <rect x="218" y="78" width="7" height="62" fill="#1a0c06" rx="2"/>
      {/* Arch curve */}
      <path d="M95 108 Q160 55 225 108" stroke="#2a1808" strokeWidth="7" fill="none"/>
      {/* Gold arch trim */}
      <path d="M96 108 Q160 57 224 108" stroke="#c9a84c" strokeWidth="2" fill="none" opacity="0.8"/>

      {/* Arch glow backdrop */}
      <ellipse cx="160" cy="108" rx="80" ry="45" fill="url(#ph-archglow)"/>

      {/* Rose clusters on arch */}
      {/* Left cluster */}
      <ellipse cx="108" cy="90" rx="8" ry="6" fill="#8b1a38" opacity="0.9"/>
      <ellipse cx="104" cy="87" rx="5" ry="4" fill="#c0365a" opacity="0.85"/>
      <ellipse cx="113" cy="86" rx="6" ry="4" fill="#a02448" opacity="0.9"/>
      <ellipse cx="108" cy="83" rx="5" ry="4" fill="#d04868" opacity="0.8"/>
      {/* Right cluster */}
      <ellipse cx="211" cy="88" rx="8" ry="6" fill="#8b1a38" opacity="0.9"/>
      <ellipse cx="207" cy="85" rx="5" ry="4" fill="#c0365a" opacity="0.85"/>
      <ellipse cx="216" cy="84" rx="6" ry="4" fill="#a02448" opacity="0.9"/>
      <ellipse cx="211" cy="81" rx="5" ry="4" fill="#d04868" opacity="0.8"/>
      {/* Top arch cluster */}
      <ellipse cx="160" cy="60" rx="10" ry="7" fill="#8b1a38" opacity="0.9"/>
      <ellipse cx="153" cy="57" rx="6" ry="5" fill="#c0365a" opacity="0.85"/>
      <ellipse cx="167" cy="56" rx="7" ry="5" fill="#a02448" opacity="0.9"/>
      <ellipse cx="160" cy="53" rx="6" ry="5" fill="#d04868" opacity="0.8"/>

      {/* Falling petals */}
      <ellipse className="ph-p1" cx="138" cy="75" rx="3" ry="2" fill="#e8708a" opacity="0.85" transform="rotate(20,138,75)"/>
      <ellipse className="ph-p2" cx="172" cy="68" rx="3" ry="2" fill="#f090a8" opacity="0.8" transform="rotate(-15,172,68)"/>
      <ellipse className="ph-p3" cx="155" cy="80" rx="2.5" ry="2" fill="#c8506e" opacity="0.85" transform="rotate(35,155,80)"/>

      {/* String lights */}
      <path d="M90 80 Q107 94 125 82 Q143 94 160 82 Q177 94 195 82 Q213 94 230 80"
            stroke="#f8d060" strokeWidth="0.8" fill="none" opacity="0.6"/>
      {[107,125,143,160,177,195,213].map((x,i) => (
        <g key={x} filter="url(#ph-glow)">
          <circle className="ph-sl" cx={x} cy={i%2===0?94:82} r="2.5" fill="#fff8c0"
                  style={{animationDelay:`${i*0.28}s`}} opacity="0.95"/>
        </g>
      ))}

      {/* Ground plane */}
      <rect x="0" y="140" width="320" height="60" fill="url(#ph-ground)"/>
      {/* Aisle path */}
      <path d="M148 200 L152 140 L168 140 L172 200 Z" fill="#2a1a0a" opacity="0.7"/>

      {/* Guests silhouettes (sides) */}
      {/* Left guests */}
      <ellipse cx="75"  cy="152" rx="8"  ry="4"  fill="#0d0408" opacity="0.85"/>
      <rect x="72"  y="136" width="6" height="17" fill="#0d0408" rx="2" opacity="0.85"/>
      <circle cx="75"  cy="133" r="5" fill="#0d0408" opacity="0.85"/>
      <ellipse cx="92"  cy="154" rx="7"  ry="4"  fill="#0d0408" opacity="0.8"/>
      <rect x="89"  y="140" width="6" height="15" fill="#0d0408" rx="2" opacity="0.8"/>
      <circle cx="92"  cy="137" r="4.5" fill="#0d0408" opacity="0.8"/>
      {/* Right guests */}
      <ellipse cx="245" cy="152" rx="8"  ry="4"  fill="#0d0408" opacity="0.85"/>
      <rect x="242" y="136" width="6" height="17" fill="#0d0408" rx="2" opacity="0.85"/>
      <circle cx="245" cy="133" r="5" fill="#0d0408" opacity="0.85"/>
      <ellipse cx="228" cy="154" rx="7"  ry="4"  fill="#0d0408" opacity="0.8"/>
      <rect x="225" y="140" width="6" height="15" fill="#0d0408" rx="2" opacity="0.8"/>
      <circle cx="228" cy="137" r="4.5" fill="#0d0408" opacity="0.8"/>

      {/* Groom silhouette */}
      <rect x="153" y="118" width="9" height="23" fill="#0a0406" rx="2"/>
      <circle cx="157" cy="115" r="6" fill="#0a0406"/>
      {/* Bride silhouette — flowing A-line */}
      <path d="M163 118 L162 141 Q170 148 178 141 L174 118 Z" fill="#0a0406"/>
      <circle cx="168" cy="115" r="5.5" fill="#0a0406"/>

      {/* Photographer silhouette */}
      <rect x="54" y="132" width="8" height="18" fill="#100608" rx="2" opacity="0.9"/>
      <circle cx="58" cy="129" r="5" fill="#100608" opacity="0.9"/>
      {/* Camera body */}
      <rect x="50" y="126" width="14" height="9" fill="#1a0c08" rx="2" opacity="0.9"/>
      <rect x="54" y="122" width="6"  height="5" fill="#1a0c08" rx="1" opacity="0.9"/>
      {/* Camera lens rim light */}
      <circle cx="57" cy="130" r="3.5" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7"/>

      {/* Foreground light flare */}
      <ellipse cx="160" cy="140" rx="40" ry="6" fill="#f0a030" opacity="0.08" filter="url(#ph-blur-sm)"/>
    </svg>
  );
}

/* ─── 2. Venues — Blue-Hour Grand Estate ──────────────────────── */
export function IconVenues(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes ve-win { 0%,100%{opacity:.85} 50%{opacity:.5} }
        @keyframes ve-ref { 0%,100%{opacity:.55} 50%{opacity:.25} }
        @keyframes ve-lamp { 0%,100%{opacity:1} 50%{opacity:.6} }
        .ve-w1{animation:ve-win 2.8s ease-in-out infinite}
        .ve-w2{animation:ve-win 2.8s .5s ease-in-out infinite}
        .ve-w3{animation:ve-win 2.8s 1.1s ease-in-out infinite}
        .ve-r1{animation:ve-ref 2.8s ease-in-out infinite}
        .ve-l1{animation:ve-lamp 1.9s ease-in-out infinite}
        .ve-l2{animation:ve-lamp 1.9s .7s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="ve-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#040814"/>
          <stop offset="30%"  stopColor="#091430"/>
          <stop offset="65%"  stopColor="#142850"/>
          <stop offset="100%" stopColor="#2a4878"/>
        </linearGradient>
        <linearGradient id="ve-facade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1c1408"/>
          <stop offset="100%" stopColor="#0e0c06"/>
        </linearGradient>
        <linearGradient id="ve-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0a1020"/>
          <stop offset="100%" stopColor="#040810"/>
        </linearGradient>
        <radialGradient id="ve-winlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f0c060" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#c88030" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="ve-lampglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f8e080" stopOpacity="1"/>
          <stop offset="60%"  stopColor="#f0c040" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#e09020" stopOpacity="0"/>
        </radialGradient>
        <filter id="ve-blur">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <filter id="ve-glow">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="ve-moonglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c8d8f0" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#6080b0" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="320" height="200" fill="url(#ve-sky)"/>

      {/* Moon */}
      <circle cx="268" cy="32" r="14" fill="url(#ve-moonglow)" filter="url(#ve-blur)"/>
      <circle cx="268" cy="32" r="9" fill="#d8e8f8" opacity="0.95"/>

      {/* Stars */}
      {[[30,18],[60,12],[90,22],[130,8],[190,15],[220,10],[50,35],[240,28],[280,18]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="0.8" fill="#c8d8f0" opacity="0.7"/>
      ))}

      {/* Side topiaries */}
      <ellipse cx="42"  cy="118" rx="16" ry="20" fill="#0e1c0a" opacity="0.95"/>
      <rect x="39"   y="118" width="6"  height="18" fill="#0a1408" opacity="0.95"/>
      <ellipse cx="278" cy="118" rx="16" ry="20" fill="#0e1c0a" opacity="0.95"/>
      <rect x="275"  y="118" width="6"  height="18" fill="#0a1408" opacity="0.95"/>

      {/* Main building facade */}
      <rect x="68" y="80" width="184" height="80" fill="url(#ve-facade)" rx="2"/>
      {/* Neoclassical cornice */}
      <rect x="62" y="76" width="196" height="8" fill="#241c0c" rx="1"/>
      {/* Pediment triangle */}
      <polygon points="160,52 98,78 222,78" fill="#1c1408"/>
      <polygon points="160,56 104,78 216,78" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.6"/>

      {/* Columns */}
      {[90,120,150,180,210].map((x,i)=>(
        <g key={i}>
          <rect x={x} y="78" width="6" height="82" fill="#2a2010" rx="1" opacity="0.9"/>
          {/* Column highlight */}
          <rect x={x+1} y="78" width="1.5" height="82" fill="#c9a84c" opacity="0.2" rx="0.5"/>
        </g>
      ))}

      {/* Arched windows — upper level */}
      {[98, 134, 170, 206].map((x, i) => (
        <g key={i}>
          {/* Window glow behind */}
          <ellipse cx={x+10} cy={100} rx={10} ry={12} fill="url(#ve-winlight)" filter="url(#ve-blur)"
                   className={i%2===0?"ve-w1":"ve-w2"}/>
          {/* Window frame */}
          <path d={`M${x},110 L${x},96 A10,10 0 0,1 ${x+20},96 L${x+20},110 Z`}
                fill="#f0c060" opacity="0.2" className={i%2===0?"ve-w1":"ve-w2"}/>
          <path d={`M${x},110 L${x},96 A10,10 0 0,1 ${x+20},96 L${x+20},110`}
                stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.6"/>
        </g>
      ))}

      {/* Grand entrance arch */}
      <path d="M142,160 L142,130 A18,18 0 0,1 178,130 L178,160 Z" fill="#f0c060" opacity="0.25"/>
      <path d="M142,160 L142,130 A18,18 0 0,1 178,130 L178,160"
            stroke="#c9a84c" strokeWidth="1.2" fill="none" opacity="0.8"/>
      {/* Door */}
      <rect x="150" y="140" width="10" height="20" fill="#0a0804" rx="1"/>
      <rect x="160" y="140" width="10" height="20" fill="#0a0804" rx="1"/>
      <circle cx="159" cy="151" r="1.5" fill="#c9a84c" opacity="0.9"/>
      <circle cx="161" cy="151" r="1.5" fill="#c9a84c" opacity="0.9"/>

      {/* Ground / approach */}
      <rect x="0" y="150" width="320" height="50" fill="url(#ve-ground)"/>

      {/* Reflecting pool */}
      <ellipse cx="160" cy="175" rx="70" ry="16" fill="#0d1828" opacity="0.9"/>
      <ellipse cx="160" cy="175" rx="68" ry="14" fill="none" stroke="#2a4878" strokeWidth="0.8" opacity="0.5"/>
      {/* Reflection of windows in pool */}
      {[98+10, 134+10, 170+10, 206+10].map((x, i)=>(
        <ellipse key={i} cx={x} cy={172} rx={4} ry={5} fill="#f0c060" opacity="0.12"
                 className="ve-r1" filter="url(#ve-blur)" style={{animationDelay:`${i*0.4}s`}}/>
      ))}

      {/* Lamp posts */}
      {[108, 212].map((x, i)=>(
        <g key={i}>
          <rect x={x-1} y="148" width="2" height="20" fill="#2a1c08" opacity="0.9"/>
          <ellipse cx={x} cy={148} rx={5} ry={3} fill="#f8e080" opacity="0.12" filter="url(#ve-blur)"
                   className="ve-l1" style={{animationDelay:`${i*0.5}s`}}/>
          <circle  cx={x} cy={147} r="2.5" fill="#f8e080" className="ve-l1"
                   style={{animationDelay:`${i*0.5}s`}} filter="url(#ve-glow)"/>
        </g>
      ))}

      {/* Elegant guests silhouettes near entrance */}
      <rect x="130" y="148" width="5" height="12" fill="#0a0808" rx="1" opacity="0.8"/>
      <circle cx="132" cy="146" r="3.5" fill="#0a0808" opacity="0.8"/>
      <rect x="183" y="148" width="5" height="12" fill="#0a0808" rx="1" opacity="0.8"/>
      <circle cx="185" cy="146" r="3.5" fill="#0a0808" opacity="0.8"/>

      {/* Foreground vignette */}
      <rect x="0" y="0" width="68" height="200" fill="url(#ve-sky)" opacity="0.3"/>
      <rect x="252" y="0" width="68" height="200" fill="url(#ve-sky)" opacity="0.3"/>
    </svg>
  );
}

/* ─── 3. Catering — Candlelit Dining ──────────────────────────── */
export function IconCatering(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes ca-flame { 0%,100%{transform:scaleX(1) scaleY(1);opacity:1} 33%{transform:scaleX(.85) scaleY(1.1);opacity:.9} 66%{transform:scaleX(1.1) scaleY(.9);opacity:.95} }
        @keyframes ca-glow  { 0%,100%{opacity:.5} 50%{opacity:.2} }
        @keyframes ca-steam { 0%{transform:translateY(0) scaleX(1);opacity:.5} 100%{transform:translateY(-18px) scaleX(1.4);opacity:0} }
        .ca-f{transform-box:fill-box;transform-origin:50% 100%;animation:ca-flame 0.9s ease-in-out infinite}
        .ca-f2{transform-box:fill-box;transform-origin:50% 100%;animation:ca-flame 0.9s .3s ease-in-out infinite}
        .ca-f3{transform-box:fill-box;transform-origin:50% 100%;animation:ca-flame 0.9s .6s ease-in-out infinite}
        .ca-g{animation:ca-glow .9s ease-in-out infinite}
        .ca-g2{animation:ca-glow .9s .3s ease-in-out infinite}
        .ca-g3{animation:ca-glow .9s .6s ease-in-out infinite}
        .ca-st{animation:ca-steam 2.2s ease-out infinite}
        .ca-st2{animation:ca-steam 2.2s .7s ease-out infinite}
      `}</style>
      <defs>
        {/* Warm room atmosphere */}
        <linearGradient id="ca-room" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a0c04"/>
          <stop offset="60%"  stopColor="#120a04"/>
          <stop offset="100%" stopColor="#0c0802"/>
        </linearGradient>
        {/* Table marble surface */}
        <linearGradient id="ca-marble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d4c8b8"/>
          <stop offset="40%"  stopColor="#c0b4a0"/>
          <stop offset="100%" stopColor="#908070"/>
        </linearGradient>
        {/* Table edge */}
        <linearGradient id="ca-tableedge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#786858"/>
          <stop offset="100%" stopColor="#504038"/>
        </linearGradient>
        {/* Candle glow */}
        <radialGradient id="ca-candleglow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f8c840" stopOpacity="0.9"/>
          <stop offset="60%"  stopColor="#e08020" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#c06010" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="ca-candleglow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f8c840" stopOpacity="0.9"/>
          <stop offset="60%"  stopColor="#e08020" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#c06010" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="ca-candleglow3" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f8c840" stopOpacity="0.9"/>
          <stop offset="60%"  stopColor="#e08020" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#c06010" stopOpacity="0"/>
        </radialGradient>
        {/* Room ambient glow from candles */}
        <radialGradient id="ca-ambient" cx="50%" cy="65%" r="55%">
          <stop offset="0%"   stopColor="#e07820" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#e07820" stopOpacity="0"/>
        </radialGradient>
        {/* Crystal glass */}
        <linearGradient id="ca-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#e8f0f8" stopOpacity="0.7"/>
          <stop offset="50%"  stopColor="#c0d0e0" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#e8f0f8" stopOpacity="0.6"/>
        </linearGradient>
        <filter id="ca-blur">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
        <filter id="ca-softblur">
          <feGaussianBlur stdDeviation="1.5"/>
        </filter>
        <filter id="ca-flameglow">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Room background */}
      <rect width="320" height="200" fill="url(#ca-room)"/>

      {/* Ambient candle light on room */}
      <ellipse cx="160" cy="130" rx="160" ry="90" fill="url(#ca-ambient)"/>

      {/* Back wall wainscoting */}
      <rect x="0" y="0" width="320" height="90" fill="#160e06" opacity="0.7"/>
      <rect x="0" y="88" width="320" height="3"  fill="#2a1c0c" opacity="0.8"/>
      {/* Wall panels suggestion */}
      {[0,80,160,240].map((x,i)=>(
        <rect key={i} x={x+4} y={8} width="72" height="76" fill="none" stroke="#2a1c0c" strokeWidth="1" opacity="0.5" rx="2"/>
      ))}

      {/* Table — 3/4 perspective */}
      <path d="M40,145 L80,115 L240,115 L280,145 Z" fill="url(#ca-marble)" opacity="0.96"/>
      <path d="M40,145 L280,145 L280,155 L40,155 Z" fill="url(#ca-tableedge)" opacity="0.95"/>
      {/* Table reflection/sheen */}
      <path d="M80,116 L130,116 L120,128 L70,128 Z" fill="white" opacity="0.07"/>
      {/* Table legs */}
      <rect x="82"  y="155" width="8" height="30" fill="#3a2810" rx="2" opacity="0.9"/>
      <rect x="228" y="155" width="8" height="30" fill="#3a2810" rx="2" opacity="0.9"/>

      {/* Candelabra center */}
      <rect x="157" y="95" width="6" height="22" fill="#8a7040" rx="2" opacity="0.95"/>
      {/* Arms */}
      <path d="M145,108 Q150,104 157,104 Q164,104 175,108" stroke="#8a7040" strokeWidth="2.5" fill="none" opacity="0.95"/>
      {/* Candles */}
      {[[145,108],[157,100],[175,108]].map(([cx,cy],i)=>(
        <g key={i}>
          <rect x={cx-3} y={cy-12} width="6" height="14" fill="#f0e8d8" rx="1.5" opacity="0.95"/>
          {/* Wax drip */}
          <path d={`M${cx-1},${cy-12} Q${cx},${cy-14} ${cx+1},${cy-12}`} fill="#e8d8b8" opacity="0.8"/>
          {/* Glow pool */}
          <ellipse cx={cx} cy={cy-13} rx={14} ry={10} fill={`url(#ca-candleglow${i+1})`}
                   className={`ca-g${i>0?i+1:''}`} filter="url(#ca-blur)"/>
          {/* Flame */}
          <ellipse className={`ca-f${i>0?i+1:''}`} cx={cx} cy={cy-17} rx="2.5" ry="4.5" fill="#f8e040" filter="url(#ca-flameglow)"/>
          <ellipse className={`ca-f${i>0?i+1:''}`} cx={cx} cy={cy-18} rx="1.5" ry="3" fill="#fff8c0"/>
          {/* Steam */}
          <ellipse className="ca-st" cx={cx} cy={cy-23} rx="1" ry="2" fill="#f0e8d8" opacity="0.4"
                   style={{animationDelay:`${i*0.5}s`}}/>
        </g>
      ))}

      {/* Wine glasses */}
      {/* Left glass */}
      <path d="M108,120 Q108,132 113,134 L113,140 L107,140 L107,142 L119,142 L119,140 L113,140"
            stroke="url(#ca-glass)" strokeWidth="1.2" fill="none" opacity="0.85"/>
      <path d="M108,120 L118,120 Q116,128 113,132 Q110,128 108,120 Z" fill="url(#ca-glass)" opacity="0.5"/>
      {/* Wine in glass */}
      <path d="M109,125 L117,125 Q116,128 113,130 Q110,128 109,125 Z" fill="#7a1828" opacity="0.7"/>
      {/* Glass refraction highlight */}
      <line x1="109" y1="122" x2="109" y2="131" stroke="white" strokeWidth="0.6" opacity="0.5"/>

      {/* Right glass */}
      <path d="M202,120 Q202,132 207,134 L207,140 L201,140 L201,142 L213,142 L213,140 L207,140"
            stroke="url(#ca-glass)" strokeWidth="1.2" fill="none" opacity="0.85"/>
      <path d="M202,120 L212,120 Q210,128 207,132 Q204,128 202,120 Z" fill="url(#ca-glass)" opacity="0.5"/>
      <path d="M203,125 L211,125 Q210,128 207,130 Q204,128 203,125 Z" fill="#7a1828" opacity="0.7"/>
      <line x1="203" y1="122" x2="203" y2="131" stroke="white" strokeWidth="0.6" opacity="0.5"/>

      {/* Plates */}
      <ellipse cx="130" cy="138" rx="22" ry="7" fill="#d8cfc4" opacity="0.85"/>
      <ellipse cx="130" cy="138" rx="18" ry="5.5" fill="#e8dfd4" opacity="0.9"/>
      {/* Food suggestion — plated portion */}
      <ellipse cx="130" cy="137" rx="10" ry="3.5" fill="#c8a060" opacity="0.9"/>
      <ellipse cx="130" cy="136" rx="6"  ry="2"   fill="#a06030" opacity="0.8"/>

      <ellipse cx="190" cy="138" rx="22" ry="7" fill="#d8cfc4" opacity="0.85"/>
      <ellipse cx="190" cy="138" rx="18" ry="5.5" fill="#e8dfd4" opacity="0.9"/>
      <ellipse cx="190" cy="137" rx="10" ry="3.5" fill="#c8a060" opacity="0.9"/>
      <ellipse cx="190" cy="136" rx="6"  ry="2"   fill="#a06030" opacity="0.8"/>

      {/* Napkin fold left */}
      <path d="M87,122 L95,130 L92,138 L84,130 Z" fill="#e8e0d0" opacity="0.7"/>
      {/* Silverware */}
      <line x1="83" y1="120" x2="82" y2="143" stroke="#c0b8a8" strokeWidth="1.2" opacity="0.7"/>
      <line x1="78" y1="120" x2="77" y2="143" stroke="#c0b8a8" strokeWidth="1.2" opacity="0.6"/>

      {/* Foreground tablecloth edge decoration */}
      <path d="M40,145 Q80,148 160,146 Q240,144 280,145" stroke="#e8e0d0" strokeWidth="0.8" fill="none" opacity="0.3"/>
    </svg>
  );
}

/* ─── 4. Decoration — Rose-Gold Ballroom ──────────────────────── */
export function IconDecoration(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes de-sway  { 0%,100%{transform:rotate(-2deg) translateY(0)} 50%{transform:rotate(2deg) translateY(-2px)} }
        @keyframes de-light { 0%,100%{opacity:.9} 50%{opacity:.5} }
        @keyframes de-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        .de-ch{transform-box:fill-box;transform-origin:50% 0%;animation:de-sway 5s ease-in-out infinite}
        .de-l{animation:de-light 2s ease-in-out infinite}
        .de-l2{animation:de-light 2s .5s ease-in-out infinite}
        .de-l3{animation:de-light 2s 1s ease-in-out infinite}
        .de-ft{transform-box:fill-box;transform-origin:center;animation:de-float 4s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="de-room" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#18060a"/>
          <stop offset="55%"  stopColor="#120408"/>
          <stop offset="100%" stopColor="#0a0204"/>
        </linearGradient>
        <linearGradient id="de-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2a1010"/>
          <stop offset="100%" stopColor="#160808"/>
        </linearGradient>
        <radialGradient id="de-chandglow" cx="50%" cy="0%" r="80%">
          <stop offset="0%"   stopColor="#f8d0a0" stopOpacity="0.6"/>
          <stop offset="60%"  stopColor="#f0a040" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#e08020" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="de-floorglow" cx="50%" cy="0%" r="70%">
          <stop offset="0%"   stopColor="#f0a040" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#e08020" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="de-rosebloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#e8a0b0" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#c07080" stopOpacity="0.6"/>
        </radialGradient>
        <filter id="de-blur">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
        <filter id="de-softblur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        <filter id="de-glow">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="de-drapeleft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#3a0818" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#3a0818" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="de-draperight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#3a0818" stopOpacity="0"/>
          <stop offset="100%" stopColor="#3a0818" stopOpacity="0.9"/>
        </linearGradient>
      </defs>

      {/* Room */}
      <rect width="320" height="200" fill="url(#de-room)"/>

      {/* Chandelier light cone on room */}
      <path d="M160,0 L240,200 L80,200 Z" fill="url(#de-chandglow)" opacity="0.6"/>

      {/* Floor reflection */}
      <rect x="0" y="150" width="320" height="50" fill="url(#de-floor)"/>
      <ellipse cx="160" cy="155" rx="110" ry="20" fill="url(#de-floorglow)" filter="url(#de-blur)"/>

      {/* Floor pattern lines (parquet suggestion) */}
      {[140,160,180,200,220].map((x,i)=>(
        <line key={i} x1={x} y1="150" x2={x-20} y2="200" stroke="#2a1010" strokeWidth="0.6" opacity="0.4"/>
      ))}
      {[100,120,140,160,180,200,220].map((y,i)=>(
        <line key={i} x1="0" y1={y} x2="320" y2={y} stroke="#2a1010" strokeWidth="0.3" opacity="0.2"/>
      ))}

      {/* Wall arch suggestion */}
      <path d="M0,180 Q0,40 60,40 L260,40 Q320,40 320,180" stroke="#3a1818" strokeWidth="12" fill="none" opacity="0.7"/>

      {/* Left drape */}
      <path d="M0,0 Q30,50 20,200 L0,200 Z" fill="url(#de-drapeleft)" opacity="0.9"/>
      {/* Right drape */}
      <path d="M320,0 Q290,50 300,200 L320,200 Z" fill="url(#de-draperight)" opacity="0.9"/>

      {/* Chandelier chain */}
      <line x1="160" y1="0" x2="160" y2="22" stroke="#c9a84c" strokeWidth="1.5" opacity="0.7"/>

      {/* Chandelier crystal body */}
      <g className="de-ch">
        {/* Top ring */}
        <ellipse cx="160" cy="26" rx="18" ry="5" fill="none" stroke="#c9a84c" strokeWidth="1.2" opacity="0.8"/>
        {/* Arms */}
        {[-16,-8,0,8,16].map((x,i)=>(
          <g key={i}>
            <line x1={160+x} y1="26" x2={160+x*1.8} y2="36" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7"/>
            {/* Crystal drops */}
            <ellipse cx={160+x*1.8} cy={39} rx={2} ry={3.5} fill="#d0e8f0" opacity="0.7" filter="url(#de-glow)"/>
            {/* Light bulb */}
            <circle cx={160+x*1.8} cy={36} r={2.5} fill="#f8e0a0" className="de-l"
                    style={{animationDelay:`${i*0.2}s`}} filter="url(#de-glow)"/>
          </g>
        ))}
        {/* Lower tier */}
        <ellipse cx="160" cy="30" rx="10" ry="3" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.6"/>
        {[-8,0,8].map((x,i)=>(
          <g key={i}>
            <line x1={160+x} y1="30" x2={160+x} y2="42" stroke="#c9a84c" strokeWidth="0.7" opacity="0.6"/>
            <ellipse cx={160+x} cy={44} rx={1.5} ry={2.5} fill="#d0e8f0" opacity="0.7"/>
          </g>
        ))}
        {/* Center drop */}
        <line x1="160" y1="26" x2="160" y2="48" stroke="#c9a84c" strokeWidth="0.8" opacity="0.6"/>
        <ellipse cx="160" cy="51" rx="3" ry="5" fill="#b0d0e8" opacity="0.8" filter="url(#de-glow)"/>
      </g>

      {/* Chandelier glow halo */}
      <ellipse cx="160" cy="32" rx="50" ry="20" fill="#f8d0a0" opacity="0.12" filter="url(#de-blur)" className="de-l2"/>

      {/* Cascading floral chandelier arrangement */}
      {/* Main cluster at top */}
      {[[-8,52],[-2,48],[4,50],[10,54],[0,46],[6,46],[-4,45]].map(([dx,dy],i)=>(
        <ellipse key={i} cx={160+dx} cy={dy} rx={6+i%2} ry={5} fill={i%3===0?"#e8a0b0":i%3===1?"#d47890":"#c06080"} opacity="0.88"/>
      ))}
      {/* Trailing stems downward */}
      {[[-12,55],[12,55],[-6,58],[6,58],[0,60]].map(([dx,dy],i)=>(
        <g key={i}>
          <line x1={160+dx/2} y1={dy-6} x2={160+dx} y2={dy+12} stroke="#3a6020" strokeWidth="0.8" opacity="0.7"/>
          <ellipse cx={160+dx} cy={dy+12} rx={5+i%2} ry={4} fill={i%2===0?"#d48090":"#c07090"} opacity="0.82"/>
          {/* Foliage */}
          <ellipse cx={160+dx-3} cy={dy+8} rx={3} ry={2} fill="#2a5018" opacity="0.7" transform={`rotate(${-20+i*8},${160+dx-3},${dy+8})`}/>
        </g>
      ))}

      {/* Side wall sconces */}
      {[[28, 95],[292, 95]].map(([x,y],i)=>(
        <g key={i}>
          <ellipse cx={x} cy={y} rx={18} ry={14} fill="#f8c060" opacity="0.12" filter="url(#de-blur)" className="de-l3"/>
          <rect x={x-3} y={y-8} width="6" height="12" fill="#c9a84c" rx="2" opacity="0.8"/>
          <ellipse cx={x} cy={y-9} rx={4} ry={3} fill="#f8e080" opacity="0.85" className="de-l2" filter="url(#de-glow)"/>
        </g>
      ))}

      {/* Table with floral centerpieces at bottom */}
      <ellipse cx="160" cy="170" rx="90" ry="18" fill="#2a1010" opacity="0.9"/>
      <ellipse cx="160" cy="168" rx="86" ry="15" fill="#1e0c0c" opacity="0.7"/>
      {/* Table cloth edge gold trim */}
      <ellipse cx="160" cy="168" rx="86" ry="15" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5"/>

      {/* Centerpiece blooms on table */}
      {[110,160,210].map((x,i)=>(
        <g key={i} className="de-ft" style={{animationDelay:`${i*0.8}s`}}>
          <rect x={x-1} y={152} width="2" height="16" fill="#3a5020" opacity="0.8"/>
          {[[-4,152],[0,149],[4,152],[-2,155],[2,155]].map(([dx,dy],j)=>(
            <ellipse key={j} cx={x+dx} cy={dy} rx={4} ry={3.5}
                     fill={j%2===0?"#e090a8":"#c87090"} opacity="0.85"/>
          ))}
        </g>
      ))}

      {/* Gold floating particles */}
      {[[80,80],[200,70],[140,90],[240,110],[60,120]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="#c9a84c" opacity="0.3"
                className="de-ft" style={{animationDelay:`${i*0.6}s`}} filter="url(#de-softblur)"/>
      ))}
    </svg>
  );
}

/* ─── 5. Entertainment — Concert Arena ───────────────────────── */
export function IconEntertainment(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes en-beam  { 0%,100%{opacity:.55} 50%{opacity:.25} }
        @keyframes en-crowd { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes en-rgb   { 0%{stop-color:#ff4080} 33%{stop-color:#40e0ff} 66%{stop-color:#c040ff} 100%{stop-color:#ff4080} }
        @keyframes en-pulse { 0%,100%{opacity:.9;r:3} 50%{opacity:.4;r:2} }
        @keyframes en-scan  { 0%{transform:rotate(-22deg)} 100%{transform:rotate(22deg)} }
        .en-b1{animation:en-beam 1.6s ease-in-out infinite}
        .en-b2{animation:en-beam 1.6s .4s ease-in-out infinite}
        .en-b3{animation:en-beam 1.6s .8s ease-in-out infinite}
        .en-b4{animation:en-beam 1.6s 1.2s ease-in-out infinite}
        .en-c1{transform-box:fill-box;transform-origin:center;animation:en-crowd 0.7s ease-in-out infinite}
        .en-c2{transform-box:fill-box;transform-origin:center;animation:en-crowd 0.7s .15s ease-in-out infinite}
        .en-c3{transform-box:fill-box;transform-origin:center;animation:en-crowd 0.7s .3s ease-in-out infinite}
        .en-p1{animation:en-pulse 1.2s ease-in-out infinite}
        .en-p2{animation:en-pulse 1.2s .3s ease-in-out infinite}
        .en-sc{transform-box:fill-box;transform-origin:50% 100%;animation:en-scan 2.4s ease-in-out infinite alternate}
      `}</style>
      <defs>
        <linearGradient id="en-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#04020a"/>
          <stop offset="100%" stopColor="#0a0418"/>
        </linearGradient>
        <linearGradient id="en-stage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#181010"/>
          <stop offset="100%" stopColor="#0c0808"/>
        </linearGradient>
        {/* Atmospheric beam — tapered, left */}
        <linearGradient id="en-beamL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ff4080" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#ff4080" stopOpacity="0"/>
        </linearGradient>
        {/* Atmospheric beam — right */}
        <linearGradient id="en-beamR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4080ff" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#4080ff" stopOpacity="0"/>
        </linearGradient>
        {/* Center beam */}
        <linearGradient id="en-beamC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c040ff" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#c040ff" stopOpacity="0"/>
        </linearGradient>
        {/* Outer beams */}
        <linearGradient id="en-beamO" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#40e0ff" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#40e0ff" stopOpacity="0"/>
        </linearGradient>
        {/* Stage glow */}
        <radialGradient id="en-stageglow" cx="50%" cy="0%" r="70%">
          <stop offset="0%"   stopColor="#e04060" stopOpacity="0.5"/>
          <stop offset="60%"  stopColor="#8020c0" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#4020c0" stopOpacity="0"/>
        </radialGradient>
        {/* Crowd glow from stage */}
        <radialGradient id="en-crowdglow" cx="50%" cy="0%" r="80%">
          <stop offset="0%"   stopColor="#e04060" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#4020c0" stopOpacity="0"/>
        </radialGradient>
        <filter id="en-beamblur">
          <feGaussianBlur stdDeviation="2.5"/>
        </filter>
        <filter id="en-blur">
          <feGaussianBlur stdDeviation="5"/>
        </filter>
        <filter id="en-smokeblur">
          <feGaussianBlur stdDeviation="8"/>
        </filter>
        <filter id="en-glow">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="320" height="200" fill="url(#en-sky)"/>

      {/* Stage glow on back wall */}
      <ellipse cx="160" cy="105" rx="180" ry="80" fill="url(#en-stageglow)" filter="url(#en-blur)"/>

      {/* Fog / smoke layer at stage floor — blurred */}
      <ellipse cx="160" cy="112" rx="160" ry="22" fill="#c04080" opacity="0.08" filter="url(#en-smokeblur)"/>
      <ellipse cx="160" cy="112" rx="140" ry="18" fill="#6020c0" opacity="0.07" filter="url(#en-smokeblur)"/>

      {/* Stage platform */}
      <path d="M0,120 L40,100 L280,100 L320,120 Z" fill="url(#en-stage)"/>
      <rect x="0" y="120" width="320" height="8" fill="#141010" opacity="0.9"/>

      {/* Stage edge lights */}
      {[40,72,104,136,160,184,208,240,272].map((x,i)=>(
        <circle key={i} cx={x} cy={120} r="2.8" fill={i%3===0?"#ff4080":i%3===1?"#40e0ff":"#c040ff"}
                className={i%3===0?"en-p1":"en-p2"} filter="url(#en-glow)"/>
      ))}

      {/* Truss rig at top */}
      <rect x="30" y="8" width="260" height="5" fill="#1a1a2a" rx="2" opacity="0.9"/>
      {/* Truss verticals */}
      {[30,80,130,180,230,290].map((x,i)=>(
        <line key={i} x1={x} y1="8" x2={x+2} y2="20" stroke="#1a1a2a" strokeWidth="1.5" opacity="0.6"/>
      ))}

      {/* Light fixtures on truss */}
      {[50,100,160,220,270].map((x,i)=>(
        <g key={i}>
          <rect x={x-4} y={12} width="8" height="6" fill="#2a2a3a" rx="1.5" opacity="0.9"/>
          <circle cx={x} cy={18} r="2.5" fill={i%4===0?"#ff4080":i%4===1?"#40e0ff":i%4===2?"#c040ff":"#ffff40"}
                  opacity="0.9" filter="url(#en-glow)"/>
        </g>
      ))}

      {/* Atmospheric beams — tapered trapezoids with gradient fill */}
      {/* Far left beam */}
      <g filter="url(#en-beamblur)">
        <path d="M50,18 L30,105 L70,105 Z" fill="url(#en-beamO)" className="en-b4" opacity="0.6"/>
      </g>
      {/* Left beam */}
      <g filter="url(#en-beamblur)">
        <path d="M100,18 L70,108 L130,108 Z" fill="url(#en-beamL)" className="en-b1" opacity="0.7"/>
      </g>
      {/* Scanning center beam */}
      <g filter="url(#en-beamblur)" className="en-sc">
        <path d="M160,16 L130,108 L190,108 Z" fill="url(#en-beamC)" opacity="0.65"/>
      </g>
      {/* Right beam */}
      <g filter="url(#en-beamblur)">
        <path d="M220,18 L190,108 L250,108 Z" fill="url(#en-beamR)" className="en-b2" opacity="0.7"/>
      </g>
      {/* Far right beam */}
      <g filter="url(#en-beamblur)">
        <path d="M270,18 L250,105 L290,105 Z" fill="url(#en-beamO)" className="en-b3" opacity="0.6"/>
      </g>

      {/* Performer silhouette */}
      <rect x="155" y="82" width="10" height="20" fill="#0a0408" rx="2" opacity="0.95"/>
      <circle cx="160" cy="80" r="6" fill="#0a0408" opacity="0.95"/>
      {/* Raised arm with mic */}
      <path d="M160,88 L148,78 L146,74" stroke="#0a0408" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <rect x="143" y="70" width="4" height="7" fill="#1a1428" rx="1.5" opacity="0.9"/>
      {/* Other arm out */}
      <path d="M165,90 L176,83" stroke="#0a0408" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Speaker stacks on stage sides */}
      {[[45,80],[265,80]].map(([x,y],i)=>(
        <g key={i}>
          <rect x={x-10} y={y} width="20" height="22" fill="#0c0808" rx="2" opacity="0.9"/>
          <rect x={x-9}  y={y+1} width="18" height="10" fill="#141010" rx="1" opacity="0.8"/>
          <rect x={x-9}  y={y+13} width="18" height="8"  fill="#141010" rx="1" opacity="0.8"/>
          {/* Speaker cone */}
          <circle cx={x} cy={y+6}  r="4.5" fill="#1a1414" opacity="0.9"/>
          <circle cx={x} cy={y+17} r="4.5" fill="#1a1414" opacity="0.9"/>
        </g>
      ))}

      {/* Crowd area */}
      <rect x="0" y="128" width="320" height="72" fill="#08040c" opacity="0.97"/>
      <ellipse cx="160" cy="130" rx="200" ry="30" fill="url(#en-crowdglow)" filter="url(#en-blur)"/>

      {/* Crowd silhouettes — waving arms */}
      {[30,60,90,120,150,180,210,240,270,300].map((x,i)=>(
        <g key={i} className={i%3===0?"en-c1":i%3===1?"en-c2":"en-c3"}>
          <rect x={x-4}  y={148} width="8" height="20" fill="#0d0510" rx="2" opacity="0.9"/>
          <circle cx={x}  cy={146} r="5" fill="#0d0510" opacity="0.9"/>
          {/* Raised hands */}
          <line x1={x-4} y1={152} x2={x-12} y2={140} stroke="#0d0510" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
          <line x1={x+4} y1={152} x2={x+12} y2={140} stroke="#0d0510" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
          {/* Phone screen glow */}
          {i%4===0 && <rect x={x+10} y={138} width="4" height="6" fill="#a0c0ff" opacity="0.4" rx="0.5"/>}
        </g>
      ))}

      {/* Confetti particles */}
      {[[80,70],[120,55],[200,65],[240,75],[170,50],[100,80],[280,60]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width="4" height="2.5"
              fill={i%3===0?"#ff4080":i%3===1?"#40e0ff":"#f8d040"}
              opacity="0.5" transform={`rotate(${i*30},${x+2},${y+1.25})`}
              className="en-c1" style={{animationDelay:`${i*0.18}s`}}/>
      ))}
    </svg>
  );
}

/* ─── 6. Makeup — Luxury Beauty Studio ───────────────────────── */
export function IconMakeup(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes mk-glow  { 0%,100%{opacity:.9} 50%{opacity:.55} }
        @keyframes mk-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes mk-ring  { 0%,100%{opacity:.9;r:22} 50%{opacity:.6;r:21} }
        .mk-g{animation:mk-glow 2s ease-in-out infinite}
        .mk-g2{animation:mk-glow 2s .4s ease-in-out infinite}
        .mk-ft{transform-box:fill-box;transform-origin:center;animation:mk-float 3.5s ease-in-out infinite}
        .mk-r{animation:mk-ring 2s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="mk-room" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f8f0f4"/>
          <stop offset="100%" stopColor="#e8d8e4"/>
        </linearGradient>
        <linearGradient id="mk-counter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e8e0d8"/>
          <stop offset="30%"  stopColor="#d8cfc4"/>
          <stop offset="100%" stopColor="#b8b0a0"/>
        </linearGradient>
        <linearGradient id="mk-mirror" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#d0e0f0" stopOpacity="0.85"/>
          <stop offset="50%"  stopColor="#e8f0f8" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#c0d0e8" stopOpacity="0.8"/>
        </linearGradient>
        <radialGradient id="mk-ringglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="70%"  stopColor="#f8f0d0" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#f0e0a0" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="mk-bottleglow" cx="30%" cy="20%" r="60%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <filter id="mk-blur">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <filter id="mk-softblur">
          <feGaussianBlur stdDeviation="1.5"/>
        </filter>
        <filter id="mk-glow">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="mk-wallpanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f4ecf0"/>
          <stop offset="100%" stopColor="#e8dce4"/>
        </linearGradient>
      </defs>

      {/* Room */}
      <rect width="320" height="200" fill="url(#mk-room)"/>

      {/* Back wall panel */}
      <rect x="0" y="0" width="320" height="130" fill="url(#mk-wallpanel)" opacity="0.8"/>
      {/* Subtle wainscoting lines */}
      <rect x="0" y="126" width="320" height="2" fill="#d0c0cc" opacity="0.5"/>
      {[40,120,200,280].map((x,i)=>(
        <rect key={i} x={x} y={8} width="72" height="112" fill="none" stroke="#d0c0cc" strokeWidth="0.8" opacity="0.4" rx="2"/>
      ))}

      {/* Ring light glow halo behind mirror */}
      <circle cx="160" cy="62" r="44" fill="url(#mk-ringglow)" filter="url(#mk-blur)" className="mk-g"/>

      {/* Mirror frame */}
      <rect x="118" y="18" width="84" height="96" fill="#f0e8e0" rx="5" opacity="0.95"/>
      {/* Gold mirror frame accent */}
      <rect x="118" y="18" width="84" height="96" fill="none" stroke="#c9a84c" strokeWidth="2" rx="5" opacity="0.8"/>
      {/* Mirror glass */}
      <rect x="122" y="22" width="76" height="88" fill="url(#mk-mirror)" rx="3" opacity="0.9"/>
      {/* Mirror glass highlights — no face, just elegant reflections */}
      <line x1="126" y1="26" x2="126" y2="106" stroke="white" strokeWidth="1.5" opacity="0.4"/>
      <line x1="130" y1="24" x2="130" y2="40"  stroke="white" strokeWidth="0.8" opacity="0.25"/>
      {/* Soft reflection of products in mirror — abstract color washes */}
      <rect x="130" y="75" width="60" height="30" fill="#d8c8b0" opacity="0.2" rx="2"/>
      <ellipse cx="155" cy="88" rx="12" ry="6" fill="#c0a888" opacity="0.15"/>
      <ellipse cx="175" cy="85" rx="8"  ry="8" fill="#d0b090" opacity="0.12"/>

      {/* Ring light fixture */}
      <circle className="mk-r" cx="160" cy="62" r="22" fill="none" stroke="#f8f0e0" strokeWidth="4" opacity="0.9" filter="url(#mk-glow)"/>
      <circle cx="160" cy="62" r="20" fill="none" stroke="#f8e8b0" strokeWidth="1.5" opacity="0.6"/>
      {/* Ring light segments */}
      {Array.from({length:16},(_,i)=>{
        const a = (i/16)*Math.PI*2;
        const a2 = ((i+0.8)/16)*Math.PI*2;
        const r1=18, r2=22;
        return (
          <path key={i}
            d={`M${160+r1*Math.cos(a)},${62+r1*Math.sin(a)} L${160+r2*Math.cos(a)},${62+r2*Math.sin(a)} L${160+r2*Math.cos(a2)},${62+r2*Math.sin(a2)} L${160+r1*Math.cos(a2)},${62+r1*Math.sin(a2)} Z`}
            fill="#fff8d0" opacity={i%2===0?0.85:0.4}/>
        );
      })}

      {/* Counter / vanity surface */}
      <rect x="0" y="128" width="320" height="72" fill="url(#mk-counter)" opacity="0.97"/>
      <rect x="0" y="128" width="320" height="3" fill="#c9a84c" opacity="0.4"/>
      {/* Counter edge */}
      <rect x="0" y="197" width="320" height="3" fill="#a09080" opacity="0.5"/>
      {/* Counter sheen */}
      <path d="M0,129 L120,129 L100,140 L0,140 Z" fill="white" opacity="0.05"/>

      {/* Premium perfume bottle — tall */}
      <rect x="74" y="108" width="14" height="22" fill="#c8d4e0" rx="3" opacity="0.9"/>
      <rect x="79" y="105" width="4"  height="5"  fill="#a8b8c8" rx="1" opacity="0.9"/>
      <rect x="77" y="103" width="8"  height="3"  fill="#c9a84c" rx="1" opacity="0.9"/>
      {/* Bottle refraction */}
      <rect x="75" y="110" width="3" height="16" fill="white" opacity="0.25" rx="1"/>
      <ellipse cx="81" cy="112" rx="4" ry="3" fill="url(#mk-bottleglow)" opacity="0.5"/>
      {/* Label */}
      <rect x="76" y="118" width="10" height="8" fill="#f0e8d8" opacity="0.7" rx="0.5"/>

      {/* Compact / pressed powder */}
      <ellipse cx="108" cy="138" rx="14" ry="6" fill="#d4b8a0" opacity="0.9"/>
      <ellipse cx="108" cy="137" rx="12" ry="5" fill="#e8c8b0" opacity="0.9"/>
      {/* Compact mirror glint */}
      <ellipse cx="112" cy="135" rx="4" ry="2.5" fill="white" opacity="0.3"/>

      {/* Lipstick */}
      <rect x="130" y="122" width="7"  height="14" fill="#c8a090" rx="2" opacity="0.9"/>
      <path d="M130,122 Q133,116 137,122 Z" fill="#c84060" opacity="0.9"/>
      <rect x="129" y="130" width="9"  height="6"  fill="#d4a888" rx="1" opacity="0.85"/>

      {/* Foundation bottle — wide */}
      <rect x="148" y="114" width="16" height="18" fill="#e8d8c8" rx="3" opacity="0.9"/>
      <rect x="152" y="110" width="8"  height="6"  fill="#d4c4b0" rx="2" opacity="0.9"/>
      <rect x="150" y="108" width="12" height="3"  fill="#c9a84c" rx="1" opacity="0.85"/>
      <rect x="150" y="118" width="12" height="8"  fill="#f0e0d0" opacity="0.4" rx="1"/>

      {/* Brush set */}
      <g className="mk-ft">
        <rect x="192" y="108" width="4" height="28" fill="#c8a878" rx="2" opacity="0.9"/>
        <ellipse cx="194" cy="107" rx="3" ry="5" fill="#e8c8a8" opacity="0.9"/>
        <rect x="195" y="108" width="4" height="24" fill="#d8b888" rx="2" opacity="0.9"/>
        <ellipse cx="197" cy="107" rx="2.5" ry="4" fill="#f0d8b8" opacity="0.9"/>
        <rect x="198" y="110" width="4" height="22" fill="#b8a068" rx="2" opacity="0.9"/>
        <ellipse cx="200" cy="109" rx="2.5" ry="4.5" fill="#d8c098" opacity="0.9"/>
      </g>

      {/* Fresh botanicals — sprig of eucalyptus */}
      <g className="mk-ft" style={{animationDelay:"1s"}}>
        <path d="M230,108 Q225,118 222,132" stroke="#788c68" strokeWidth="1.5" fill="none" opacity="0.8"/>
        {[[224,114],[222,120],[221,126],[220,132]].map(([x,y],i)=>(
          <ellipse key={i} cx={x-3} cy={y} rx={6} ry={3} fill="#8a9c72" opacity="0.8"
                   transform={`rotate(${-30+i*10},${x-3},${y})`}/>
        ))}
        <path d="M230,108 Q235,118 238,132" stroke="#788c68" strokeWidth="1.5" fill="none" opacity="0.8"/>
        {[[236,114],[238,120],[239,126],[240,132]].map(([x,y],i)=>(
          <ellipse key={i} cx={x+3} cy={y} rx={6} ry={3} fill="#8a9c72" opacity="0.8"
                   transform={`rotate(${30-i*10},${x+3},${y})`}/>
        ))}
      </g>

      {/* Brush/product glint highlights */}
      {[[80,110],[152,116],[196,110]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx={3} ry={2} fill="white" opacity="0.35"
                 className="mk-g2" style={{animationDelay:`${i*0.4}s`}}/>
      ))}
    </svg>
  );
}

/* ─── 7. Planning — Premium Editorial Workspace ──────────────── */
export function IconPlanning(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes pl-cursor { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes pl-glow   { 0%,100%{opacity:.7} 50%{opacity:.35} }
        @keyframes pl-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        .pl-cur{animation:pl-cursor 1.1s step-end infinite}
        .pl-g{animation:pl-glow 2.5s ease-in-out infinite}
        .pl-ft{transform-box:fill-box;transform-origin:center;animation:pl-float 4s ease-in-out infinite}
      `}</style>
      <defs>
        <linearGradient id="pl-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2a1e12"/>
          <stop offset="100%" stopColor="#1a1008"/>
        </linearGradient>
        <linearGradient id="pl-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#faf6f0"/>
          <stop offset="100%" stopColor="#f0e8dc"/>
        </linearGradient>
        <linearGradient id="pl-ipad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#1a2840"/>
          <stop offset="100%" stopColor="#0c1828"/>
        </linearGradient>
        <radialGradient id="pl-screenglow" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#4080c0" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#2040a0" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="pl-desklamp" cx="50%" cy="0%" r="80%">
          <stop offset="0%"   stopColor="#f8e8a0" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#f0c040" stopOpacity="0"/>
        </radialGradient>
        <filter id="pl-blur">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <filter id="pl-softblur">
          <feGaussianBlur stdDeviation="1.5"/>
        </filter>
        <filter id="pl-glow">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="pl-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a1006"/>
          <stop offset="100%" stopColor="#120c04"/>
        </linearGradient>
        <linearGradient id="pl-planner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c9a84c"/>
          <stop offset="100%" stopColor="#a88030"/>
        </linearGradient>
      </defs>

      {/* Room / wall */}
      <rect width="320" height="200" fill="url(#pl-wall)"/>

      {/* Desk lamp glow on wall */}
      <ellipse cx="248" cy="60" rx="70" ry="50" fill="url(#pl-desklamp)" filter="url(#pl-blur)" className="pl-g"/>

      {/* Desk surface — flat-lay top view */}
      <rect x="0" y="88" width="320" height="112" fill="url(#pl-desk)"/>
      <rect x="0" y="88" width="320" height="3" fill="#c9a84c" opacity="0.3"/>
      {/* Desk sheen */}
      <path d="M0,89 L160,89 L140,100 L0,100 Z" fill="white" opacity="0.04"/>

      {/* Main wedding planner notebook */}
      <rect x="60" y="100" width="90" height="72" fill="url(#pl-planner)" rx="3" opacity="0.95"/>
      <rect x="60" y="100" width="90" height="72" fill="none" stroke="#c9a84c" strokeWidth="1" rx="3" opacity="0.8"/>
      {/* Spine */}
      <rect x="60" y="100" width="6" height="72" fill="#906020" rx="2" opacity="0.9"/>
      {/* Gold embossed title area */}
      <rect x="70" y="108" width="72" height="18" fill="#b88030" rx="2" opacity="0.4"/>
      <rect x="75" y="112" width="62" height="2" fill="#f0d080" opacity="0.5"/>
      <rect x="75" y="117" width="45" height="1.5" fill="#f0d080" opacity="0.35"/>
      {/* Content lines */}
      {[132,140,148,156,162].map((y,i)=>(
        <rect key={i} x={70} y={y} width={55-i*4} height="1.5" fill="#e8c870" opacity={0.4-i*0.05} rx="0.5"/>
      ))}
      {/* Small watercolor swatches suggestion */}
      <ellipse cx="122" cy="148" rx="8" ry="5" fill="#e8a0b0" opacity="0.4"/>
      <ellipse cx="133" cy="152" rx="6" ry="4" fill="#d4c890" opacity="0.4"/>
      <ellipse cx="118" cy="155" rx="7" ry="4" fill="#b0c8d8" opacity="0.4"/>

      {/* Planner ribbon bookmark */}
      <rect x="145" y="100" width="2" height="25" fill="#c84060" opacity="0.8"/>

      {/* iPad / tablet */}
      <rect x="162" y="95" width="68" height="50" fill="url(#pl-ipad)" rx="4" opacity="0.95"/>
      <rect x="162" y="95" width="68" height="50" fill="none" stroke="#2a3848" strokeWidth="1.5" rx="4"/>
      {/* Screen */}
      <rect x="165" y="98" width="62" height="44" fill="#1a2840" rx="2" opacity="0.9"/>
      <rect x="165" y="98" width="62" height="44" fill="url(#pl-screenglow)" rx="2"/>
      {/* Screen content — wedding design mock */}
      <rect x="168" y="101" width="56" height="16" fill="#2a4060" opacity="0.7" rx="1"/>
      <ellipse cx="196" cy="109" rx="20" ry="6" fill="#3a5880" opacity="0.5"/>
      <rect x="168" y="120" width="25" height="2" fill="#6090c0" opacity="0.5" rx="0.5"/>
      <rect x="168" y="124" width="40" height="1.5" fill="#4070a0" opacity="0.4" rx="0.5"/>
      <rect x="168" y="128" width="35" height="1.5" fill="#4070a0" opacity="0.4" rx="0.5"/>
      <rect x="168" y="132" width="20" height="1.5" fill="#4070a0" opacity="0.35" rx="0.5"/>
      {/* iPad home indicator */}
      <rect x="191" y="140" width="10" height="1.5" fill="#3a5070" rx="0.75" opacity="0.6"/>

      {/* Stationery — envelopes */}
      <g className="pl-ft">
        <rect x="246" y="108" width="46" height="32" fill="#f8f2e8" rx="2" opacity="0.9"/>
        <rect x="246" y="108" width="46" height="32" fill="none" stroke="#c9a84c" strokeWidth="0.8" rx="2" opacity="0.7"/>
        {/* V fold */}
        <path d="M246,108 L269,124 L292,108" stroke="#d4b858" strokeWidth="0.8" fill="none" opacity="0.6"/>
        {/* Wax seal */}
        <circle cx="269" cy="128" r="7" fill="#c84060" opacity="0.85"/>
        <circle cx="269" cy="128" r="5" fill="#e05070" opacity="0.6"/>
        <text x="269" y="131" textAnchor="middle" fontSize="5" fill="#f8e0d0" fontFamily="serif" opacity="0.8">H</text>
      </g>

      {/* Pen / gold pen */}
      <rect x="62" y="175" width="2" height="20" fill="#c9a84c" rx="1" opacity="0.9" transform="rotate(-20,62,175)"/>
      <path d="M61,175 Q63,172 65,175" fill="#c9a84c" opacity="0.9" transform="rotate(-20,62,175)"/>

      {/* Desk lamp arm (suggestion) */}
      <line x1="290" y1="88" x2="268" y2="40"  stroke="#2a2010" strokeWidth="3" opacity="0.8"/>
      <line x1="268" y1="40" x2="230" y2="55"  stroke="#2a2010" strokeWidth="3" opacity="0.8"/>
      <ellipse cx="225" cy="60" rx="16" ry="8" fill="#2a2010" opacity="0.9"/>
      <ellipse cx="225" cy="60" rx="12" ry="6" fill="#f8e8a0" opacity="0.2" filter="url(#pl-blur)" className="pl-g"/>

      {/* Botanical sprig accent */}
      <g className="pl-ft" style={{animationDelay:"1.2s"}}>
        <path d="M36,95 Q32,108 30,125" stroke="#6a7c58" strokeWidth="1.5" fill="none" opacity="0.8"/>
        {[[32,102],[30,110],[29,118]].map(([x,y],i)=>(
          <ellipse key={i} cx={x-4} cy={y} rx={7} ry={3} fill="#7a9068" opacity="0.75"
                   transform={`rotate(${-30+i*12},${x-4},${y})`}/>
        ))}
        {[[38,100],[36,108],[35,116]].map(([x,y],i)=>(
          <ellipse key={i} cx={x+4} cy={y} rx={6} ry={3} fill="#8a9c78" opacity="0.75"
                   transform={`rotate(${25-i*10},${x+4},${y})`}/>
        ))}
      </g>

      {/* Scattered dried petals */}
      {[[155,178],[170,182],[185,175],[200,180],[215,177]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx={4} ry={2} fill="#d4a0b0" opacity="0.4"
                 transform={`rotate(${i*28},${x},${y})`}/>
      ))}
    </svg>
  );
}

/* ─── 8. Videography — Golden Hour Cinema ────────────────────── */
export function IconVideography(): ReactElement {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <style>{`
        @keyframes vi-drone  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(1deg)} }
        @keyframes vi-flare  { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:.35;transform:scale(1.15)} }
        @keyframes vi-rec    { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes vi-prop   { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes vi-haze   { 0%,100%{opacity:.5} 50%{opacity:.25} }
        .vi-dr{transform-box:fill-box;transform-origin:center;animation:vi-drone 3s ease-in-out infinite}
        .vi-fl{transform-box:fill-box;transform-origin:center;animation:vi-flare 2.5s ease-in-out infinite}
        .vi-rc{animation:vi-rec 1.2s step-end infinite}
        .vi-pr{transform-box:fill-box;transform-origin:center;animation:vi-prop .3s linear infinite}
        .vi-hz{animation:vi-haze 3s ease-in-out infinite}
      `}</style>
      <defs>
        {/* Deep golden hour sky */}
        <linearGradient id="vi-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#060208"/>
          <stop offset="18%"  stopColor="#200818"/>
          <stop offset="40%"  stopColor="#6a1808"/>
          <stop offset="60%"  stopColor="#c84010"/>
          <stop offset="78%"  stopColor="#f07020"/>
          <stop offset="100%" stopColor="#f8b840"/>
        </linearGradient>
        {/* Ground */}
        <linearGradient id="vi-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a0c04"/>
          <stop offset="100%" stopColor="#0c0602"/>
        </linearGradient>
        {/* Lens flare */}
        <radialGradient id="vi-flare1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="40%"  stopColor="#f8e060" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#f08020" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="vi-flare2" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#f8d040" stopOpacity="0"/>
        </radialGradient>
        {/* Sun glow */}
        <radialGradient id="vi-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
          <stop offset="30%"  stopColor="#f8e080" stopOpacity="0.8"/>
          <stop offset="70%"  stopColor="#f09030" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#f06010" stopOpacity="0"/>
        </radialGradient>
        <filter id="vi-blur">
          <feGaussianBlur stdDeviation="5"/>
        </filter>
        <filter id="vi-softblur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        <filter id="vi-glow">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="vi-flareblur">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
        {/* Atmospheric haze */}
        <linearGradient id="vi-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f09030" stopOpacity="0"/>
          <stop offset="100%" stopColor="#f09030" stopOpacity="0.35"/>
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="320" height="200" fill="url(#vi-sky)"/>

      {/* Horizon haze */}
      <rect x="0" y="110" width="320" height="30" fill="url(#vi-haze)" className="vi-hz" filter="url(#vi-softblur)"/>

      {/* Sun disc */}
      <circle cx="200" cy="118" r="30" fill="url(#vi-sun)" filter="url(#vi-blur)"/>
      <circle cx="200" cy="118" r="14" fill="#fffce0" opacity="0.95"/>

      {/* Anamorphic lens flare streak */}
      <rect x="0" y="117" width="320" height="2" fill="#ffffff" opacity="0.12" className="vi-fl" filter="url(#vi-softblur)"/>
      <rect x="0" y="117.5" width="320" height="1" fill="#f8e080" opacity="0.3" className="vi-fl"/>
      {/* Lens flare polygons */}
      {[[100,108,40,26],[130,122,18,12],[60,125,12,8],[240,112,22,14],[270,120,10,6]].map(([x,y,r1,r2],i)=>(
        <ellipse key={i} cx={x} cy={y} rx={r1} ry={r2}
                 fill="url(#vi-flare2)" className="vi-fl" filter="url(#vi-flareblur)"
                 style={{animationDelay:`${i*0.2}s`, opacity:0.4-i*0.05}}/>
      ))}
      <circle cx="200" cy="118" r="20" fill="url(#vi-flare1)" className="vi-fl" filter="url(#vi-blur)" opacity="0.5"/>

      {/* Distant landscape silhouette hills */}
      <path d="M0,130 Q40,100 80,115 Q120,128 160,110 Q200,95 240,112 Q280,125 320,108 L320,140 L0,140 Z"
            fill="#0d0806" opacity="0.95"/>
      {/* Mid hills */}
      <path d="M0,140 Q50,125 100,132 Q150,138 200,128 Q250,118 320,130 L320,150 L0,150 Z"
            fill="#0a0604" opacity="0.97"/>

      {/* Ground */}
      <rect x="0" y="150" width="320" height="50" fill="url(#vi-ground)"/>
      {/* Golden hour ground reflection */}
      <rect x="0" y="150" width="320" height="15" fill="#f09030" opacity="0.06"/>

      {/* Silhouetted trees */}
      <path d="M18,150 Q24,115 30,150 Z"  fill="#080404" opacity="0.95"/>
      <path d="M25,150 Q32,108 40,150 Z"  fill="#080404" opacity="0.9"/>
      <path d="M275,150 Q281,112 288,150 Z" fill="#080404" opacity="0.95"/>
      <path d="M283,150 Q289,118 296,150 Z" fill="#080404" opacity="0.9"/>
      <path d="M55,150 Q58,128 62,150 Z"  fill="#080404" opacity="0.8"/>

      {/* Cinema camera — main subject on tripod */}
      {/* Tripod legs */}
      <line x1="125" y1="172" x2="108" y2="200" stroke="#2a2010" strokeWidth="2" opacity="0.9"/>
      <line x1="145" y1="172" x2="160" y2="200" stroke="#2a2010" strokeWidth="2" opacity="0.9"/>
      <line x1="135" y1="172" x2="132" y2="200" stroke="#2a2010" strokeWidth="1.5" opacity="0.8"/>
      {/* Tripod head */}
      <rect x="120" y="164" width="30" height="6" fill="#2a2010" rx="2" opacity="0.9"/>
      {/* Camera body */}
      <rect x="112" y="148" width="46" height="18" fill="#1a1408" rx="3" opacity="0.97"/>
      <rect x="112" y="148" width="46" height="18" fill="none" stroke="#c9a84c" strokeWidth="0.8" rx="3" opacity="0.5"/>
      {/* Camera body detail panel */}
      <rect x="116" y="151" width="24" height="12" fill="#141008" rx="2" opacity="0.8"/>
      {/* Lens — cinema prime */}
      <rect x="100" y="150" width="14" height="14" fill="#0e0c08" rx="6" opacity="0.95"/>
      <circle cx="107" cy="157" r="5.5" fill="#1a1810" opacity="0.95"/>
      <circle cx="107" cy="157" r="4"   fill="#0a0808" opacity="0.95"/>
      <circle cx="107" cy="157" r="2.5" fill="#181614" opacity="0.95"/>
      {/* Lens rim light */}
      <circle cx="107" cy="157" r="5.5" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.6"/>
      {/* Lens reflection fleck */}
      <circle cx="105" cy="155" r="1.2" fill="white" opacity="0.35"/>
      {/* Matte box / lens hood */}
      <rect x="89"  y="148" width="13"  height="18" fill="#181408" rx="1" opacity="0.9"/>
      {/* Follow focus */}
      <rect x="152" y="148" width="6"   height="10" fill="#241c0c" rx="1" opacity="0.8"/>
      {/* Handle */}
      <rect x="150" y="140" width="10"  height="10" fill="#1a1408" rx="2" opacity="0.8"/>
      {/* Monitor arm */}
      <rect x="155" y="148" width="3"   height="20" fill="#1a1408" rx="1" opacity="0.8"/>
      <rect x="150" y="166" width="18"  height="12" fill="#0c1018" rx="2" opacity="0.9"/>
      {/* Monitor screen — shows waveform */}
      <rect x="151" y="167" width="16" height="10" fill="#1a2830" rx="1.5" opacity="0.9"/>
      <path d="M152,172 Q155,169 158,172 Q161,175 164,172 Q165,170 166,172"
            stroke="#40e0a0" strokeWidth="0.8" fill="none" opacity="0.7"/>
      {/* REC indicator */}
      <circle cx="165" cy="168" r="1.5" fill="#ff3020" className="vi-rc"/>

      {/* Drone — above and to the right */}
      <g className="vi-dr">
        {/* Drone body */}
        <rect x="232" y="55" width="22" height="10" fill="#1a1820" rx="3" opacity="0.95"/>
        {/* Drone arms */}
        <line x1="232" y1="58" x2="222" y2="50" stroke="#1a1820" strokeWidth="2" opacity="0.9"/>
        <line x1="254" y1="58" x2="264" y2="50" stroke="#1a1820" strokeWidth="2" opacity="0.9"/>
        <line x1="232" y1="63" x2="222" y2="70" stroke="#1a1820" strokeWidth="2" opacity="0.9"/>
        <line x1="254" y1="63" x2="264" y2="70" stroke="#1a1820" strokeWidth="2" opacity="0.9"/>
        {/* Propellers */}
        <ellipse className="vi-pr" cx="222" cy="50" rx="9" ry="2" fill="#2a2830" opacity="0.7"/>
        <ellipse className="vi-pr" cx="264" cy="50" rx="9" ry="2" fill="#2a2830" opacity="0.7" style={{animationDirection:"reverse"}}/>
        <ellipse className="vi-pr" cx="222" cy="70" rx="9" ry="2" fill="#2a2830" opacity="0.7" style={{animationDirection:"reverse"}}/>
        <ellipse className="vi-pr" cx="264" cy="70" rx="9" ry="2" fill="#2a2830" opacity="0.7"/>
        {/* Drone camera */}
        <rect x="240" y="65" width="6" height="4" fill="#0a0810" rx="1.5" opacity="0.95"/>
        <circle cx="243" cy="67" r="2" fill="#181618" opacity="0.95"/>
        {/* Motor indicator lights */}
        <circle cx="222" cy="50" r="1.5" fill="#40e0ff" opacity="0.8" filter="url(#vi-glow)"/>
        <circle cx="264" cy="50" r="1.5" fill="#40e0ff" opacity="0.8" filter="url(#vi-glow)"/>
        <circle cx="222" cy="70" r="1.5" fill="#ff4040" opacity="0.8" filter="url(#vi-glow)"/>
        <circle cx="264" cy="70" r="1.5" fill="#ff4040" opacity="0.8" filter="url(#vi-glow)"/>
      </g>

      {/* Cinematic black bars suggestion at top and bottom */}
      <rect x="0" y="0"   width="320" height="10" fill="black" opacity="0.4"/>
      <rect x="0" y="190" width="320" height="10" fill="black" opacity="0.4"/>
    </svg>
  );
}
