"use client";

import type { ReactElement } from "react";

/* ─────────────────────────────────────────────────────────
   Illustrated SVG definitions — each 100×100 viewBox,
   gold-palette, hand-crafted for the event-planning brand.
───────────────────────────────────────────────────────── */
const G = "#c9a84c";   // gold
const GL = "#e8d5a3";  // light gold
const W  = "rgba(255,255,255,0.70)";
const W2 = "rgba(255,255,255,0.35)";

const SVGS: Record<string, ReactElement> = {

  rings: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GL}/>
          <stop offset="100%" stopColor={G}/>
        </linearGradient>
      </defs>
      <circle cx="37" cy="58" r="20" stroke="url(#rg1)" strokeWidth="5.5"/>
      <circle cx="63" cy="58" r="20" stroke="url(#rg1)" strokeWidth="5.5"/>
      <polygon points="50,22 44,33 50,40 56,33" fill={G}/>
      <polygon points="44,33 50,40 56,33" fill={W2}/>
      <path d="M44,37 L44,40 L50,47 L56,40 L56,37" fill="none" stroke={G} strokeWidth="1.2"/>
      <path d="M26,47 Q31,41 39,46" stroke={W} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M61,47 Q66,41 74,46" stroke={W} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),

  camera: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GL}/>
          <stop offset="100%" stopColor={G}/>
        </linearGradient>
      </defs>
      <rect x="14" y="34" width="72" height="48" rx="8" fill="url(#cg1)" opacity="0.18"/>
      <rect x="14" y="34" width="72" height="48" rx="8" stroke={G} strokeWidth="3"/>
      <path d="M36,34 L40,24 L60,24 L64,34" stroke={G} strokeWidth="3" strokeLinejoin="round"/>
      <circle cx="50" cy="58" r="16" stroke={G} strokeWidth="3.5"/>
      <circle cx="50" cy="58" r="9"  fill={G} opacity="0.25"/>
      <circle cx="50" cy="58" r="4"  fill={G} opacity="0.6"/>
      <circle cx="44" cy="50" r="2"  fill={W}/>
      <rect x="68" y="38" width="10" height="6" rx="2" fill={G} opacity="0.6"/>
    </svg>
  ),

  cake: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GL}/>
          <stop offset="100%" stopColor={G}/>
        </linearGradient>
      </defs>
      {/* Tiers */}
      <rect x="28" y="68" width="44" height="18" rx="4" fill="url(#kg1)" opacity="0.2"/>
      <rect x="28" y="68" width="44" height="18" rx="4" stroke={G} strokeWidth="2.5"/>
      <rect x="34" y="50" width="32" height="18" rx="4" fill="url(#kg1)" opacity="0.2"/>
      <rect x="34" y="50" width="32" height="18" rx="4" stroke={G} strokeWidth="2.5"/>
      <rect x="40" y="35" width="20" height="15" rx="4" fill="url(#kg1)" opacity="0.2"/>
      <rect x="40" y="35" width="20" height="15" rx="4" stroke={G} strokeWidth="2.5"/>
      {/* Candles */}
      <line x1="46" y1="35" x2="46" y2="28" stroke={G} strokeWidth="2.5"/>
      <line x1="50" y1="35" x2="50" y2="26" stroke={G} strokeWidth="2.5"/>
      <line x1="54" y1="35" x2="54" y2="28" stroke={G} strokeWidth="2.5"/>
      {/* Flames */}
      <ellipse cx="46" cy="26" rx="2.5" ry="4" fill="#ffb347" opacity="0.85"/>
      <ellipse cx="50" cy="24" rx="2.5" ry="4" fill="#ffb347" opacity="0.85"/>
      <ellipse cx="54" cy="26" rx="2.5" ry="4" fill="#ffb347" opacity="0.85"/>
      {/* Decorative dots */}
      <circle cx="38" cy="77" r="2" fill={G} opacity="0.6"/>
      <circle cx="50" cy="77" r="2" fill={G} opacity="0.6"/>
      <circle cx="62" cy="77" r="2" fill={G} opacity="0.6"/>
    </svg>
  ),

  bouquet: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stems */}
      <path d="M50,90 Q46,72 40,58" stroke={G} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M50,90 L50,60" stroke={G} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M50,90 Q54,72 60,58" stroke={G} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      {/* Leaves */}
      <path d="M50,75 Q42,68 44,62 Q50,68 50,75" fill={G} opacity="0.35"/>
      <path d="M50,75 Q58,68 56,62 Q50,68 50,75" fill={G} opacity="0.35"/>
      {/* Center rose */}
      <circle cx="50" cy="46" r="14" fill={G} opacity="0.15"/>
      <path d="M50,35 Q60,42 57,52 Q50,56 43,52 Q40,42 50,35Z" fill={G} opacity="0.3"/>
      <circle cx="50" cy="46" r="6" fill={G} opacity="0.5"/>
      {/* Side flowers */}
      <circle cx="35" cy="52" r="9" fill={G} opacity="0.15"/>
      <circle cx="35" cy="52" r="5" fill={G} opacity="0.4"/>
      <circle cx="65" cy="52" r="9" fill={G} opacity="0.15"/>
      <circle cx="65" cy="52" r="5" fill={G} opacity="0.4"/>
      {/* Petals detail center */}
      {[0,60,120,180,240,300].map((a, i) => (
        <ellipse key={i} cx={50 + 10*Math.cos(a*Math.PI/180)} cy={46 + 10*Math.sin(a*Math.PI/180)}
          rx="4" ry="6" fill={GL} opacity="0.4"
          transform={`rotate(${a} ${50 + 10*Math.cos(a*Math.PI/180)} ${46 + 10*Math.sin(a*Math.PI/180)})`}
        />
      ))}
      {/* Ribbon */}
      <path d="M45,82 Q50,78 55,82 Q50,86 45,82Z" fill={G} opacity="0.5"/>
    </svg>
  ),

  champagne: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GL}/>
          <stop offset="100%" stopColor={G}/>
        </linearGradient>
      </defs>
      {/* Left flute */}
      <path d="M33,20 L26,60 Q26,65 33,65 L33,85" stroke={G} strokeWidth="3" strokeLinecap="round"/>
      <path d="M33,20 L40,60" stroke={G} strokeWidth="3" strokeLinecap="round"/>
      <line x1="27" y1="85" x2="39" y2="85" stroke={G} strokeWidth="3" strokeLinecap="round"/>
      <path d="M26,60 Q26,65 33,65 Q40,65 40,60" fill={G} opacity="0.20"/>
      {/* Right flute */}
      <path d="M67,20 L74,60 Q74,65 67,65 L67,85" stroke={G} strokeWidth="3" strokeLinecap="round"/>
      <path d="M67,20 L60,60" stroke={G} strokeWidth="3" strokeLinecap="round"/>
      <line x1="61" y1="85" x2="73" y2="85" stroke={G} strokeWidth="3" strokeLinecap="round"/>
      <path d="M74,60 Q74,65 67,65 Q60,65 60,60" fill={G} opacity="0.20"/>
      {/* Liquid fill */}
      <path d="M27,50 L32,65 Q33,65 34,65 L39,50Z" fill={G} opacity="0.3"/>
      <path d="M73,50 L68,65 Q67,65 66,65 L61,50Z" fill={G} opacity="0.3"/>
      {/* Bubbles */}
      {[[30,44],[32,36],[35,48],[66,40],[69,52],[71,44]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill={W} opacity="0.7"/>
      ))}
      {/* Clink star */}
      <path d="M50,16 L52,22 L58,22 L53,26 L55,32 L50,28 L45,32 L47,26 L42,22 L48,22Z"
        fill={G} opacity="0.75"/>
    </svg>
  ),

  venue: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Arch */}
      <path d="M20,80 L20,42 Q20,18 50,18 Q80,18 80,42 L80,80" stroke={G} strokeWidth="3"/>
      {/* Inner arch */}
      <path d="M30,80 L30,46 Q30,28 50,28 Q70,28 70,46 L70,80" stroke={G} strokeWidth="2" opacity="0.5"/>
      {/* Columns */}
      <rect x="17" y="76" width="8" height="12" rx="2" fill={G} opacity="0.3"/>
      <rect x="75" y="76" width="8" height="12" rx="2" fill={G} opacity="0.3"/>
      {/* Ground */}
      <line x1="10" y1="88" x2="90" y2="88" stroke={G} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Hanging florals */}
      {[30,40,50,60,70].map((x,i)=>(
        <g key={i}>
          <line x1={x} y1="20" x2={x} y2={28+i%2*6} stroke={G} strokeWidth="1.2" opacity="0.6"/>
          <circle cx={x} cy={30+i%2*6} r="3.5" fill={G} opacity="0.45"/>
        </g>
      ))}
      {/* Path/aisle */}
      <path d="M42,88 L38,80 L62,80 L58,88" fill={G} opacity="0.12"/>
    </svg>
  ),

  music: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Treble clef */}
      <path d="M50,18 Q62,22 62,34 Q62,46 50,52 Q50,62 56,68 Q62,74 56,82 Q50,88 44,82 Q38,76 44,70 Q50,64 50,52 Q38,46 38,34 Q38,22 50,18Z"
        stroke={G} strokeWidth="3" fill={G} opacity="0.15"/>
      <path d="M44,70 Q50,68 50,76 Q50,82 44,82" stroke={G} strokeWidth="2.5" fill="none"/>
      {/* Staff lines */}
      {[36,42,48,54,60].map((y,i)=>(
        <line key={i} x1="20" y1={y} x2="80" y2={y} stroke={G} strokeWidth="1.2" opacity="0.3"/>
      ))}
      {/* Floating notes */}
      <circle cx="72" cy="28" r="5" fill={G} opacity="0.5"/>
      <line x1="77" y1="28" x2="77" y2="14" stroke={G} strokeWidth="2.5"/>
      <circle cx="80" cy="38" r="4" fill={G} opacity="0.4"/>
      <line x1="84" y1="38" x2="84" y2="26" stroke={G} strokeWidth="2"/>
      {/* Sparkle notes */}
      <circle cx="76" cy="11" r="2" fill={GL} opacity="0.7"/>
      <circle cx="84" cy="22" r="1.5" fill={GL} opacity="0.6"/>
    </svg>
  ),

  dance: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Couple silhouette */}
      {/* Person 1 head */}
      <circle cx="38" cy="22" r="8" fill={G} opacity="0.5"/>
      {/* Person 1 body */}
      <path d="M38,30 Q30,40 28,55 Q34,52 38,50 Q42,52 46,50 Q48,42 44,32Z" fill={G} opacity="0.4"/>
      {/* Person 1 dress */}
      <path d="M30,50 Q24,65 22,80 Q30,76 38,75 Q46,76 50,80 Q52,65 48,52Z" fill={G} opacity="0.35"/>
      {/* Person 2 head */}
      <circle cx="62" cy="20" r="8" fill={G} opacity="0.5"/>
      {/* Person 2 body */}
      <path d="M62,28 Q68,36 70,50 L66,52 L62,50 L58,52 L56,44Z" fill={G} opacity="0.4"/>
      {/* Person 2 legs */}
      <path d="M56,52 Q52,68 54,80 L62,78 L70,80 Q70,66 64,52Z" fill={G} opacity="0.35"/>
      {/* Arms intertwined */}
      <path d="M46,38 Q50,34 56,38" stroke={G} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
      {/* Sparkles */}
      {[[20,15],[80,20],[50,10],[85,55]].map(([x,y],i)=>(
        <g key={i} opacity="0.6">
          <line x1={x-4} y1={y} x2={x+4} y2={y} stroke={GL} strokeWidth="1.5"/>
          <line x1={x} y1={y-4} x2={x} y2={y+4} stroke={GL} strokeWidth="1.5"/>
        </g>
      ))}
    </svg>
  ),

  lantern: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chain */}
      <line x1="50" y1="10" x2="50" y2="22" stroke={G} strokeWidth="2.5"/>
      <path d="M44,22 L56,22 L58,30 Q58,24 50,24 Q42,24 42,30Z" fill={G} opacity="0.5"/>
      {/* Lantern body */}
      <path d="M34,38 Q34,28 50,28 Q66,28 66,38 L68,72 Q68,80 50,80 Q32,80 32,72Z" fill={G} opacity="0.12"/>
      <path d="M34,38 Q34,28 50,28 Q66,28 66,38 L68,72 Q68,80 50,80 Q32,80 32,72Z" stroke={G} strokeWidth="2.5"/>
      {/* Vertical bars */}
      {[40,50,60].map((x,i)=>(
        <line key={i} x1={x} y1="28" x2={x} y2="80" stroke={G} strokeWidth="1.2" opacity="0.4"/>
      ))}
      {/* Middle ring */}
      <ellipse cx="50" cy="54" rx="18" ry="4" stroke={G} strokeWidth="1.5" opacity="0.5"/>
      {/* Flame */}
      <ellipse cx="50" cy="48" rx="6" ry="10" fill="#ffb347" opacity="0.7"/>
      <ellipse cx="50" cy="50" rx="3.5" ry="6" fill="#fff7aa" opacity="0.6"/>
      {/* Bottom cap */}
      <path d="M32,72 Q32,80 50,82 Q68,80 68,72" fill={G} opacity="0.25"/>
      <path d="M44,80 L46,90 L54,90 L56,80" fill={G} opacity="0.35"/>
    </svg>
  ),

  invite: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GL} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={G}  stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      {/* Envelope body */}
      <rect x="12" y="28" width="76" height="54" rx="6" fill="url(#ig1)" stroke={G} strokeWidth="2.5"/>
      {/* Flap */}
      <path d="M12,28 L50,54 L88,28" stroke={G} strokeWidth="2.5" fill="none"/>
      {/* Side folds */}
      <path d="M12,82 L38,56" stroke={G} strokeWidth="1.5" opacity="0.4"/>
      <path d="M88,82 L62,56" stroke={G} strokeWidth="1.5" opacity="0.4"/>
      {/* Wax seal */}
      <circle cx="50" cy="60" r="12" fill={G} opacity="0.25"/>
      <circle cx="50" cy="60" r="12" stroke={G} strokeWidth="2"/>
      {/* HM monogram */}
      <text x="50" y="65" textAnchor="middle" fontSize="10" fontWeight="bold" fill={G} opacity="0.9" fontFamily="serif">HM</text>
      {/* Ribbon */}
      <path d="M38,14 Q50,22 62,14 Q56,8 50,12 Q44,8 38,14Z" fill={G} opacity="0.5"/>
    </svg>
  ),

  crown: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="crg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GL}/>
          <stop offset="100%" stopColor={G}/>
        </linearGradient>
      </defs>
      {/* Crown shape */}
      <path d="M12,70 L20,38 L36,56 L50,20 L64,56 L80,38 L88,70Z"
        fill="url(#crg)" opacity="0.25"/>
      <path d="M12,70 L20,38 L36,56 L50,20 L64,56 L80,38 L88,70Z"
        stroke={G} strokeWidth="3" strokeLinejoin="round"/>
      {/* Base band */}
      <rect x="12" y="68" width="76" height="14" rx="4" fill={G} opacity="0.2"/>
      <rect x="12" y="68" width="76" height="14" rx="4" stroke={G} strokeWidth="2.5"/>
      {/* Gems */}
      <circle cx="50" cy="26" r="6" fill={GL} opacity="0.7"/>
      <circle cx="50" cy="26" r="3" fill={W}  opacity="0.5"/>
      <circle cx="22" cy="44" r="4.5" fill={G}  opacity="0.6"/>
      <circle cx="78" cy="44" r="4.5" fill={G}  opacity="0.6"/>
      {/* Band gems */}
      {[26,38,50,62,74].map((x,i)=>(
        <circle key={i} cx={x} cy="75" r="3.5" fill={GL} opacity="0.6"/>
      ))}
      {/* Tiny stars */}
      {[[30,16],[70,16],[50,50]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x-4} y1={y} x2={x+4} y2={y} stroke={GL} strokeWidth="1.5" opacity="0.6"/>
          <line x1={x} y1={y-4} x2={x} y2={y+4} stroke={GL} strokeWidth="1.5" opacity="0.6"/>
        </g>
      ))}
    </svg>
  ),

  candle: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Three candles */}
      {[{x:30,h:50,y:42},{x:50,h:38,y:30},{x:70,h:44,y:36}].map(({x,h,y},i)=>(
        <g key={i}>
          <rect cx={x} x={x-8} y={y+h} width="16" height="4" rx="2" fill={G} opacity="0.4"/>
          <rect x={x-7} y={y} width="14" height={h} rx="7"
            fill={G} opacity="0.18"/>
          <rect x={x-7} y={y} width="14" height={h} rx="7" stroke={G} strokeWidth="2"/>
          {/* Drips */}
          <path d={`M${x-4},${y} Q${x-5},${y+8} ${x-4},${y+12}`} stroke={G} strokeWidth="2" opacity="0.4"/>
          {/* Wick */}
          <line x1={x} y1={y} x2={x} y2={y-6} stroke={G} strokeWidth="2"/>
          {/* Flame */}
          <ellipse cx={x} cy={y-12} rx="5" ry="8" fill="#ffb347" opacity="0.8"/>
          <ellipse cx={x} cy={y-11} rx="2.5" ry="4.5" fill="#fff7aa" opacity="0.7"/>
          {/* Glow */}
          <circle cx={x} cy={y-12} r="10" fill="#ffb347" opacity="0.1"/>
        </g>
      ))}
      {/* Base plate */}
      <ellipse cx="50" cy="94" rx="36" ry="5" fill={G} opacity="0.2"/>
      <path d="M14,92 Q50,96 86,92" stroke={G} strokeWidth="2" opacity="0.5"/>
    </svg>
  ),

  balloon: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strings */}
      <path d="M50,90 Q44,80 40,68" stroke={G} strokeWidth="1.5" opacity="0.5"/>
      <path d="M50,90 L50,72"       stroke={G} strokeWidth="1.5" opacity="0.5"/>
      <path d="M50,90 Q56,80 60,68" stroke={G} strokeWidth="1.5" opacity="0.5"/>
      <path d="M50,90 Q38,76 28,60" stroke={G} strokeWidth="1.5" opacity="0.4"/>
      <path d="M50,90 Q62,76 72,60" stroke={G} strokeWidth="1.5" opacity="0.4"/>
      {/* Balloons */}
      <ellipse cx="50" cy="55" rx="14" ry="17" fill={G} opacity="0.3"/>
      <ellipse cx="50" cy="55" rx="14" ry="17" stroke={G} strokeWidth="2.5"/>
      <ellipse cx="36" cy="62" rx="11" ry="13" fill={G} opacity="0.22"/>
      <ellipse cx="36" cy="62" rx="11" ry="13" stroke={G} strokeWidth="2"/>
      <ellipse cx="64" cy="62" rx="11" ry="13" fill={G} opacity="0.22"/>
      <ellipse cx="64" cy="62" rx="11" ry="13" stroke={G} strokeWidth="2"/>
      <ellipse cx="27" cy="52" rx="9"  ry="11" fill={G} opacity="0.18"/>
      <ellipse cx="27" cy="52" rx="9"  ry="11" stroke={G} strokeWidth="1.8"/>
      <ellipse cx="73" cy="52" rx="9"  ry="11" fill={G} opacity="0.18"/>
      <ellipse cx="73" cy="52" rx="9"  ry="11" stroke={G} strokeWidth="1.8"/>
      {/* Shine highlights */}
      <ellipse cx="46" cy="48" rx="4" ry="5" fill={W} opacity="0.3"/>
      <ellipse cx="33" cy="56" rx="3" ry="3.5" fill={W} opacity="0.25"/>
      <ellipse cx="61" cy="56" rx="3" ry="3.5" fill={W} opacity="0.25"/>
      {/* Knots */}
      <circle cx="50" cy="72" r="2.5" fill={G} opacity="0.6"/>
      <circle cx="36" cy="75" r="2"   fill={G} opacity="0.5"/>
      <circle cx="64" cy="75" r="2"   fill={G} opacity="0.5"/>
    </svg>
  ),

  sparkle: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Big 4-point star */}
      <path d="M50,15 L54,44 L83,48 L54,52 L50,81 L46,52 L17,48 L46,44Z" fill={G} opacity="0.45"/>
      <path d="M50,15 L54,44 L83,48 L54,52 L50,81 L46,52 L17,48 L46,44Z" stroke={GL} strokeWidth="1"/>
      {/* Center glow */}
      <circle cx="50" cy="48" r="8" fill={GL} opacity="0.5"/>
      <circle cx="50" cy="48" r="4" fill={W}  opacity="0.4"/>
      {/* Tiny satellites */}
      {[
        [22,20],[78,20],[22,78],[78,78],
        [50,8],[92,48],[50,88],[8,48],
      ].map(([x,y],i)=>(
        <g key={i} opacity="0.55">
          <line x1={x-4} y1={y}   x2={x+4} y2={y}   stroke={GL} strokeWidth="2"/>
          <line x1={x}   y1={y-4} x2={x}   y2={y+4} stroke={GL} strokeWidth="2"/>
        </g>
      ))}
      {/* Diagonal mini stars */}
      {[[35,28],[65,28],[35,68],[65,68]].map(([x,y],i)=>(
        <g key={i} opacity="0.4">
          <line x1={x-3} y1={y-3} x2={x+3} y2={y+3} stroke={G} strokeWidth="1.5"/>
          <line x1={x+3} y1={y-3} x2={x-3} y2={y+3} stroke={G} strokeWidth="1.5"/>
        </g>
      ))}
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────
   Placement data — 38 items with fixed positions for SSR.
   x/y are percentages of the hero section.
   opacity is the resting opacity (hover goes to 1.0).
───────────────────────────────────────────────────────── */
type Item = { svg: keyof typeof SVGS; x:number; y:number; size:number; rot:number; delay:number; op:number };

const ITEMS: Item[] = [
  // ── LEFT EDGE ──────────────────────────────────────────
  { svg:"rings",     x:1,  y:6,  size:118, rot:-14, delay:0,    op:0.68 },
  { svg:"camera",    x:5,  y:26, size:92,  rot:9,   delay:280,  op:0.58 },
  { svg:"bouquet",   x:0,  y:50, size:138, rot:-7,  delay:560,  op:0.62 },
  { svg:"lantern",   x:7,  y:72, size:98,  rot:13,  delay:840,  op:0.52 },
  { svg:"sparkle",   x:2,  y:88, size:78,  rot:-22, delay:1120, op:0.55 },
  { svg:"champagne", x:13, y:16, size:108, rot:7,   delay:420,  op:0.50 },
  { svg:"invite",    x:10, y:40, size:94,  rot:-11, delay:700,  op:0.48 },
  { svg:"cake",      x:14, y:63, size:128, rot:16,  delay:980,  op:0.55 },

  // ── LEFT QUARTER ───────────────────────────────────────
  { svg:"music",     x:19, y:5,  size:84,  rot:-8,  delay:200,  op:0.38 },
  { svg:"candle",    x:22, y:33, size:104, rot:11,  delay:480,  op:0.33 },
  { svg:"crown",     x:25, y:76, size:88,  rot:-16, delay:760,  op:0.38 },
  { svg:"balloon",   x:20, y:90, size:74,  rot:9,   delay:1060, op:0.32 },

  // ── CENTER-LEFT (behind text, kept faint) ──────────────
  { svg:"venue",     x:30, y:3,  size:100, rot:-10, delay:340,  op:0.22 },
  { svg:"dance",     x:35, y:87, size:84,  rot:12,  delay:640,  op:0.22 },
  { svg:"sparkle",   x:38, y:11, size:68,  rot:-5,  delay:520,  op:0.18 },
  { svg:"rings",     x:40, y:91, size:78,  rot:8,   delay:920,  op:0.20 },

  // ── CENTER TOP/BOTTOM ──────────────────────────────────
  { svg:"camera",    x:45, y:2,  size:94,  rot:-8,  delay:380,  op:0.20 },
  { svg:"bouquet",   x:52, y:94, size:88,  rot:11,  delay:680,  op:0.20 },
  { svg:"music",     x:48, y:5,  size:72,  rot:14,  delay:580,  op:0.18 },

  // ── CENTER-RIGHT (behind text, kept faint) ─────────────
  { svg:"lantern",   x:59, y:3,  size:84,  rot:-12, delay:240,  op:0.22 },
  { svg:"champagne", x:65, y:89, size:98,  rot:8,   delay:560,  op:0.22 },
  { svg:"candle",    x:62, y:9,  size:68,  rot:-6,  delay:460,  op:0.18 },
  { svg:"sparkle",   x:70, y:87, size:78,  rot:15,  delay:760,  op:0.20 },

  // ── RIGHT QUARTER ──────────────────────────────────────
  { svg:"invite",    x:75, y:7,  size:108, rot:13,  delay:140,  op:0.40 },
  { svg:"cake",      x:78, y:36, size:88,  rot:-10, delay:400,  op:0.38 },
  { svg:"crown",     x:80, y:70, size:98,  rot:9,   delay:700,  op:0.42 },
  { svg:"venue",     x:76, y:83, size:84,  rot:-14, delay:1000, op:0.36 },

  // ── RIGHT EDGE ─────────────────────────────────────────
  { svg:"dance",     x:88, y:4,  size:128, rot:-18, delay:100,  op:0.66 },
  { svg:"rings",     x:92, y:23, size:94,  rot:14,  delay:360,  op:0.60 },
  { svg:"camera",    x:86, y:46, size:118, rot:-9,  delay:620,  op:0.64 },
  { svg:"bouquet",   x:93, y:66, size:108, rot:11,  delay:860,  op:0.56 },
  { svg:"lantern",   x:88, y:83, size:98,  rot:-12, delay:1080, op:0.58 },
  { svg:"champagne", x:96, y:40, size:84,  rot:18,  delay:480,  op:0.52 },
  { svg:"music",     x:83, y:14, size:104, rot:-6,  delay:260,  op:0.54 },
  { svg:"candle",    x:90, y:89, size:78,  rot:12,  delay:940,  op:0.50 },
  { svg:"cake",      x:82, y:60, size:112, rot:-15, delay:740,  op:0.56 },
  { svg:"invite",    x:95, y:11, size:88,  rot:8,   delay:160,  op:0.60 },
  { svg:"crown",     x:87, y:28, size:74,  rot:-20, delay:420,  op:0.48 },
];

export default function ScatteredMosaic() {
  return (
    <div
      className="mosaic-container pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {ITEMS.map((item, i) => (
        <div
          key={i}
          className="mosaic-card absolute"
          style={{
            left:            `${item.x}%`,
            top:             `${item.y}%`,
            width:           item.size,
            height:          item.size,
            "--rot":         `${item.rot}deg`,
            "--op":          item.op,
            animationDelay:  `${item.delay}ms`,
          } as React.CSSProperties}
        >
          <div className="mosaic-inner h-full w-full rounded-2xl p-3"
            style={{
              background:     "var(--glass-bg)",
              border:         "1px solid var(--border)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {SVGS[item.svg]}
          </div>
        </div>
      ))}
    </div>
  );
}
