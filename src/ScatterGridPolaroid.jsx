import React, { useState, useEffect } from 'react';

const BASE_CELL_W = 50;
const BASE_CELL_H = 72;
const BASE_GAP = 4;
const BASE_PAD = 4;

/** 与成长纪念卡首页 Demo 一致的 9 张图与散落初值 */
export const SCATTER_DEMO_PHOTOS = [
  { src: 'assets/p1.jpg', chaos: { x: -8, y: 10, r: -22 } },
  { src: 'assets/p2.jpg', chaos: { x: 44, y: -4, r: 14 } },
  { src: 'assets/p3.jpg', chaos: { x: 100, y: 22, r: -8 } },
  { src: 'assets/p4.jpg', chaos: { x: -4, y: 86, r: 18 } },
  { src: 'assets/p5.jpg', chaos: { x: 60, y: 72, r: -12 } },
  { src: 'assets/p6.jpg', chaos: { x: 108, y: 100, r: 11 } },
  { src: 'assets/p7.jpg', chaos: { x: 6, y: 168, r: -18 } },
  { src: 'assets/p2.jpg', chaos: { x: 66, y: 156, r: 8 } },
  { src: 'assets/p3.jpg', chaos: { x: 112, y: 176, r: -10 } },
];

/**
 * 散落 → 九宫格归位（与 App 内原 DemoPolaroid 动效一致）
 * @param {{ scatterDelayMs?: number, organizedHoldMs?: number, ... }} props
 * scatterDelayMs：散开后等待多久再拼成九宫格（默认 1100）
 * organizedHoldMs：拼满后停留多久再回到散落；不传则「散开→拼好」只播一次并停在九宫格
 */
export function ScatterGridPolaroid({
  active = true,
  scale = 1,
  dashedBorderColor = '#ffd2dd',
  templateBg = '#fff8fa',
  scatterDelayMs = 1100,
  organizedHoldMs,
}) {
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (!active) {
      setPlaced(false);
      return undefined;
    }
    let cancelled = false;
    const timers = [];

    const runCycle = () => {
      setPlaced(false);
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setPlaced(true);
        if (organizedHoldMs != null && organizedHoldMs >= 400) {
          timers.push(setTimeout(() => {
            if (cancelled) return;
            runCycle();
          }, organizedHoldMs));
        }
      }, scatterDelayMs));
    };

    runCycle();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [active, scatterDelayMs, organizedHoldMs]);

  const cellW = BASE_CELL_W * scale;
  const cellH = BASE_CELL_H * scale;
  const gap = BASE_GAP * scale;
  const pad = BASE_PAD * scale;

  const w = pad * 2 + 3 * cellW + 2 * gap;
  const h = pad * 2 + 3 * cellH + 2 * gap;

  const base = import.meta.env.BASE_URL || '/';
  const asset = (src) => (src.startsWith('/') ? src : `${base}${src}`);

  return (
    <div style={{
      position: 'relative',
      width: w,
      height: h,
      flexShrink: 0,
    }}
    >
      {/* 半透明 3x3 占位格（归位前提示） */}
      <div style={{
        position: 'absolute',
        inset: 0,
        padding: pad,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap,
        boxSizing: 'border-box',
        pointerEvents: 'none',
        opacity: placed ? 0 : 1,
        transition: 'opacity 0.5s',
      }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{
              border: `1px dashed ${dashedBorderColor}`,
              background: templateBg,
              borderRadius: 3 * scale,
            }}
          />
        ))}
      </div>

      {SCATTER_DEMO_PHOTOS.map((p, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const orderX = pad + col * (cellW + gap);
        const orderY = pad + row * (cellH + gap);
        const x = placed ? orderX : p.chaos.x * scale;
        const y = placed ? orderY : p.chaos.y * scale;
        const r = placed ? 0 : p.chaos.r;
        const delay = placed ? i * 70 : 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: cellW,
              height: cellH,
              transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
              transition: `transform 0.75s cubic-bezier(.55,.0,.3,1.15) ${delay}ms, box-shadow 0.5s ${delay}ms, border-color 0.5s`,
              borderRadius: 3 * scale,
              border: placed
                ? `${Math.max(1, Math.round(scale))}px solid #fff`
                : `${Math.max(1, Math.round(2 * scale))}px solid #fff`,
              background: '#f3ebe4',
              overflow: 'hidden',
              boxShadow: placed
                ? '0 1px 2px rgba(80,30,40,0.10)'
                : '0 8px 16px rgba(50,20,30,0.30), 0 2px 4px rgba(50,20,30,0.18)',
              zIndex: placed ? 1 : (10 - i),
              willChange: 'transform',
            }}
          >
            <img
              src={asset(p.src)}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        );
      })}
    </div>
  );
}
