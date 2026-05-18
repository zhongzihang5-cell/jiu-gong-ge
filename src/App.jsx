import React, { useState, useEffect } from 'react';
import { IOSDevice } from './IOSFrame';

// ── 样本数据 ──────────────────────────────────────────────────
const SAMPLES = [
  { kind: 'demo', tag: '豆豆的成长纪念卡' },
  { src: 'assets/sample1.png', tag: '满月日记', author: 'SillyLolo', likes: '2.3k' },
  { src: 'assets/sample2.png', tag: '宝宝 30 天', author: '穗の豆', likes: '942' },
  { src: 'assets/sample3.png', tag: '出生第一周', author: 'Jugwss', likes: '1.5k' },
  { src: 'assets/sample4.png', tag: '那些无法复刻的瞬间', author: '果儿', likes: '1.1k' },
  { src: 'assets/sample5.png', tag: '百日之喜', author: '小芊金', likes: '845' },
  { src: 'assets/sample6.jpg', tag: '初见第一面', author: '芋圆妈', likes: '1.8k' },
];

// ── 色彩 tokens ───────────────────────────────────────────────
const C = {
  ink: '#2a1f24',
  ink2: '#5b4a52',
  mute: '#9c8e94',
  paper: '#fffaf6',
  cream: '#fdf3ec',
  blush: '#ffe4d8',
  pink: '#ff5b8a',
  pinkSoft: '#ffd2dd',
  line: '#f0e2d8',
};

const FONT_SANS = `-apple-system, "PingFang SC", "Noto Sans SC", system-ui, sans-serif`;
const FONT_SERIF = `"Noto Serif SC", "Songti SC", "STSong", serif`;

// ── Demo 拼图动画：散落 → 整齐九宫格 ────────────────────────
const DEMO_CELL_W = 50;
const DEMO_CELL_H = 72;
const DEMO_GAP = 4;

const DEMO_PHOTOS = [
  { src: 'assets/p1.jpg', chaos: { x:  -8, y:  10, r: -22 } },
  { src: 'assets/p2.jpg', chaos: { x:  44, y:  -4, r:  14 } },
  { src: 'assets/p3.jpg', chaos: { x: 100, y:  22, r:  -8 } },
  { src: 'assets/p4.jpg', chaos: { x:  -4, y:  86, r:  18 } },
  { src: 'assets/p5.jpg', chaos: { x:  60, y:  72, r: -12 } },
  { src: 'assets/p6.jpg', chaos: { x: 108, y: 100, r:  11 } },
  { src: 'assets/p7.jpg', chaos: { x:   6, y: 168, r: -18 } },
  { src: 'assets/p2.jpg', chaos: { x:  66, y: 156, r:   8 } },
  { src: 'assets/p3.jpg', chaos: { x: 112, y: 176, r: -10 } },
];

function DemoPolaroid({ active }) {
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (!active) { setPlaced(false); return; }
    const t = setTimeout(() => setPlaced(true), 1100);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 半透明 3x3 模板格 */}
      <div style={{
        position: 'absolute', inset: 0, padding: 4,
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)',
        gap: DEMO_GAP, boxSizing: 'border-box', pointerEvents: 'none',
        opacity: placed ? 0 : 1, transition: 'opacity 0.5s',
      }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            border: `1px dashed ${C.pinkSoft}`,
            background: '#fff8fa',
            borderRadius: 3,
          }} />
        ))}
      </div>

      {DEMO_PHOTOS.map((p, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const orderX = 4 + col * (DEMO_CELL_W + DEMO_GAP);
        const orderY = 4 + row * (DEMO_CELL_H + DEMO_GAP);
        const x = placed ? orderX : p.chaos.x;
        const y = placed ? orderY : p.chaos.y;
        const r = placed ? 0 : p.chaos.r;
        const delay = placed ? i * 70 : 0;
        return (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0,
            width: DEMO_CELL_W, height: DEMO_CELL_H,
            transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
            transition: `transform 0.75s cubic-bezier(.55,.0,.3,1.15) ${delay}ms, box-shadow 0.5s ${delay}ms, border-color 0.5s`,
            borderRadius: 3,
            border: placed ? `1px solid #fff` : `2px solid #fff`,
            background: '#f3ebe4', overflow: 'hidden',
            boxShadow: placed
              ? '0 1px 2px rgba(80,30,40,0.10)'
              : '0 8px 16px rgba(50,20,30,0.30), 0 2px 4px rgba(50,20,30,0.18)',
            zIndex: placed ? 1 : (10 - i),
            willChange: 'transform',
          }}>
            <img src={p.src} alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        );
      })}
    </div>
  );
}

// ── 自动轮播 carousel ────────────────────────────────────────
function HeroPreview({ idx, setIdx, onGenerate }) {
  useEffect(() => {
    const dwell = SAMPLES[idx]?.kind === 'demo' ? 5600 : 3000;
    const t = setTimeout(() => setIdx((i) => (i + 1) % SAMPLES.length), dwell);
    return () => clearTimeout(t);
  }, [idx, setIdx]);

  return (
    <div style={{ position: 'relative', height: 318, perspective: '1000px' }}>
      {SAMPLES.map((s, i) => {
        const offset = ((i - idx) + SAMPLES.length) % SAMPLES.length;
        const isCenter = offset === 0;
        const isLeft = offset === SAMPLES.length - 1;
        const isRight = offset === 1;
        if (!isCenter && !isLeft && !isRight) return null;
        const dx = isCenter ? 0 : isLeft ? -72 : 72;
        const rot = isCenter ? -2 : isLeft ? -10 : 10;
        const scale = isCenter ? 1 : 0.78;
        const z = isCenter ? 3 : 1;
        const op = isCenter ? 1 : 0.5;
        return (
          <div
            key={i}
            onClick={() => setIdx(i)}
            style={{
              position: 'absolute', left: '50%', top: 8,
              width: 184, height: 280, marginLeft: -92,
              transform: `translateX(${dx}px) rotate(${rot}deg) scale(${scale})`,
              transition: 'transform 0.6s cubic-bezier(.2,.8,.2,1), opacity 0.6s',
              zIndex: z, opacity: op, cursor: 'pointer',
              borderRadius: 6, overflow: 'hidden',
              background: '#fff', padding: 7, paddingBottom: 36,
              boxShadow: isCenter
                ? '0 18px 38px -12px rgba(80,30,40,0.28), 0 4px 12px rgba(80,30,40,0.12)'
                : '0 8px 18px -8px rgba(80,30,40,0.18)',
            }}
          >
            <div style={{
              width: '100%', height: '100%', borderRadius: 3, overflow: 'hidden',
              background: s.kind === 'demo' ? '#f7f1ea' : '#f3ebe4',
              position: 'relative',
            }}>
              {s.kind === 'demo' ? (
                <DemoPolaroid active={isCenter} />
              ) : (
                <img src={s.src} alt={s.tag}
                  style={{
                    width: '100%', height: '180%',
                    objectFit: 'cover', objectPosition: 'center 40%',
                    marginTop: '-40%',
                    display: 'block',
                  }}
                />
              )}
            </div>
            <div style={{
              position: 'absolute', bottom: 7, left: 0, right: 0,
              textAlign: 'center', fontSize: 11, color: C.ink2,
              fontFamily: FONT_SERIF, letterSpacing: 0.4,
              lineHeight: 1.6, padding: '0 8px',
            }}>
              {s.kind === 'demo' ? (
                <span>
                  让回忆生动起来
                  <span
                    onClick={(e) => { e.stopPropagation(); onGenerate(); }}
                    style={{ color: C.pink, fontWeight: 600, cursor: 'pointer' }}
                  >——去制作</span>
                </span>
              ) : s.tag}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 版式选择器图示（支持文案版 -c 后缀）────────────────────
function LayoutGlyph({ kind, active }) {
  const hasCaption = kind.endsWith('-c');
  const baseKind = kind.replace(/-c$/, '');

  const stroke = active ? C.pink : '#bdb1a8';
  const fill   = active ? '#fff5f7' : 'transparent';
  const sw     = active ? 1.6 : 1.3;
  const W = 36, H = 48, inset = 4;

  // 普通格子
  const plainRect = (x, y, w, h) => (
    <rect x={x} y={y} width={w} height={h} rx={1.5}
      fill={fill} stroke={stroke} strokeWidth={sw} />
  );
  // 带文案指示线的格子：照片 70% 高度 + 底部文字线
  const capRect = (x, y, w, h) => {
    const ph = h * 0.70;
    return (
      <g>
        <rect x={x} y={y} width={w} height={ph} rx={1.5}
          fill={fill} stroke={stroke} strokeWidth={sw} />
        <rect x={x+1} y={y+ph+1.2} width={w-2} height={2} rx={1}
          fill={active ? C.pink : '#c0b8b2'} opacity={0.75} />
        <rect x={x+4} y={y+ph+4.4} width={w-8} height={1.4} rx={0.7}
          fill={active ? C.pink : '#c0b8b2'} opacity={0.45} />
      </g>
    );
  };
  const rect = hasCaption ? capRect : plainRect;

  let cells;
  switch (baseKind) {
    case '2x2':
      cells = (<g>{rect(inset,inset,12,17)}{rect(20,inset,12,17)}{rect(inset,25,12,17)}{rect(20,25,12,17)}</g>);
      break;
    case '2x2b':
      cells = (<g>{rect(inset,inset,12,17)}{rect(20,inset,12,17)}{rect(inset,25,12,17)}{rect(20,25,12,17)}</g>);
      break;
    case '3x3':
      cells = (<g>{[0,1,2].map((r) => [0,1,2].map((c) => (
        <React.Fragment key={`${r}-${c}`}>{rect(inset+c*9.5, inset+r*12, 8, 10)}</React.Fragment>
      )))}</g>);
      break;
    case 'v3':
      cells = (<g>{rect(11,inset,14,11)}{rect(11,18,14,11)}{rect(11,31,14,11)}</g>);
      break;
    case 'h3':
      cells = (<g>{rect(inset,14,8,18)}{rect(14,14,8,18)}{rect(24,14,8,18)}</g>);
      break;
    case 'big1':
      cells = (<g>{rect(inset,inset,28,22)}{rect(inset,28,13,14)}{rect(19,28,13,14)}</g>);
      break;
    case 'L':
      cells = (<g>{rect(inset,inset,13,17)}{rect(19,inset,13,17)}{rect(inset,22,28,20)}</g>);
      break;
    case 'split':
      cells = (<g>{rect(inset,inset,13,40)}{rect(19,inset,13,18)}{rect(19,22,13,18)}</g>);
      break;
    case 'rows3':
      cells = (<g>{rect(inset,inset,28,11)}{rect(inset,17,28,11)}{rect(inset,30,28,12)}</g>);
      break;
    case 'cols3':
      cells = (<g>{rect(inset,inset,8,40)}{rect(14,inset,8,40)}{rect(24,inset,8,40)}</g>);
      break;
    case 'cols4':
      cells = (<g>{rect(3,inset,6,40)}{rect(11,inset,6,40)}{rect(19,inset,6,40)}{rect(27,inset,6,40)}</g>);
      break;
    case 'mix1':
      cells = (<g>{rect(inset,inset,13,40)}{rect(19,inset,13,18)}{rect(19,24,6,18)}{rect(27,24,5,18)}</g>);
      break;
    default:
      cells = rect(inset, inset, 28, 40);
  }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>{cells}</svg>
  );
}

function HotMark() {
  return (
    <div style={{
      position: 'absolute', top: -4, right: -4,
      width: 18, height: 18, borderRadius: 9,
      background: C.pink, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 700,
    }}>♥</div>
  );
}

// ── 编辑页 ────────────────────────────────────────────────────
function EditorPage({ onBack, onDone }) {
  const slots = [
    { w: '孕 5 周',  cap: 'Welcome Our Baby · 验孕棒两条线',  filled: true,  src: 'assets/p1.jpg', pos: 'center 50%' },
    { w: '孕 8 周',  cap: '心跳第一次出现的那天',           filled: true,  src: 'assets/p2.jpg', pos: 'center 50%' },
    { w: '孕 16 周', cap: '小肚子悄悄鼓起来了',             filled: true,  src: 'assets/p3.jpg', pos: 'center 30%' },
    { w: '孕 22 周', cap: '致我的小樱桃崽 · 大排畸顺利',     filled: true,  src: 'assets/p4.jpg', pos: 'center 35%' },
    { w: '孕 28 周', cap: '带你看世界 · 加州小镇',           filled: true,  src: 'assets/p5.jpg', pos: 'center 35%' },
    { w: '孕 32 周', cap: '每天读绘本给你听',               filled: true,  src: 'assets/p6.jpg', pos: 'center 50%' },
    { w: '孕 36 周', cap: '待产包准备好啦 · 等你出生',       filled: true,  src: 'assets/p7.jpg', pos: 'center 40%' },
    { w: '出生照',    cap: '待添加',         filled: false },
    { w: '家庭合照',  cap: '待添加',         filled: false },
  ];
  const matched = slots.filter((s) => s.filled).length;
  const missing = slots.length - matched;

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden', position: 'relative',
      background: '#fff8f4', fontFamily: FONT_SANS, color: C.ink,
    }}>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 96 }}>
        {/* 顶部导航 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '52px 16px 8px', background: '#fff8f4',
        }}>
          <button onClick={onBack} aria-label="返回" style={{
            width: 36, height: 36, border: 0, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path d="M8.5 1L1.5 8L8.5 15" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div style={{ fontSize: 16, fontWeight: 600 }}>从孕育到出生</div>
          <button onClick={onDone} style={{
            padding: '8px 14px', borderRadius: 999, border: 0,
            background: C.pink, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>生成纪念卡</button>
        </div>

        {/* 模板标题块 */}
        <div style={{
          margin: '6px 14px 14px', padding: '14px 16px',
          background: '#ffeaf0', borderRadius: 12,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: FONT_SERIF, fontSize: 19, fontWeight: 700, color: C.pink,
              letterSpacing: 0.5,
            }}>从孕育到出生</div>
            <div style={{
              marginTop: 4, fontSize: 12, color: C.pink,
              fontStyle: 'italic', fontFamily: FONT_SERIF,
            }}>280 天，最珍贵的旅程</div>
          </div>
          <div style={{
            padding: '6px 12px', borderRadius: 8,
            background: '#fff', border: `1px solid ${C.pinkSoft}`,
            fontSize: 12, color: C.pink, fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>已匹配 {matched}/{slots.length} 张</div>
        </div>

        {/* 3x3 九宫格 */}
        <div style={{ padding: '0 14px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: 8, rowGap: 14,
          }}>
            {slots.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  aspectRatio: '1', borderRadius: 6, overflow: 'hidden',
                  background: s.filled ? '#000' : 'transparent',
                  border: s.filled ? '0' : `1.5px dashed ${C.pinkSoft}`,
                  display: 'flex', cursor: 'pointer', position: 'relative',
                }}>
                  {s.filled ? (
                    <img src={s.src} alt={s.w}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.pos, display: 'block' }} />
                  ) : (
                    <div style={{
                      flex: 1, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', color: C.pinkSoft,
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 16,
                        border: `1.5px solid ${C.pinkSoft}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, fontWeight: 300, color: C.pinkSoft,
                      }}>+</div>
                      <div style={{ marginTop: 6, fontSize: 11, color: '#f3a3b6' }}>点击上传</div>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 6, minHeight: 32 }}>
                  <div style={{
                    fontFamily: FONT_SERIF, fontStyle: 'italic',
                    fontSize: 13, fontWeight: 700, lineHeight: 1.2,
                    color: s.filled ? C.ink : '#f3a3b6',
                  }}>{s.w}</div>
                  <div style={{
                    fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 11,
                    lineHeight: 1.35, marginTop: 2,
                    color: s.filled ? C.ink2 : '#f3a3b6',
                  }}>{s.cap}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 未填充提示 */}
        {missing > 0 && (
          <div style={{
            margin: '20px 14px 0', padding: '14px 16px',
            background: '#fff', borderRadius: 12,
            border: `0.5px solid ${C.line}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: '#fff5e1', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>⚠️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#d98326' }}>
                还有 {missing} 格未填充
              </div>
              <div style={{ fontSize: 12, color: C.ink2, marginTop: 2 }}>
                点击空格子添加照片
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: C.mute }}>
          点击任意格子可替换照片或编辑文案
        </div>
      </div>

      {/* 底部操作栏 */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 14px 22px',
        background: 'linear-gradient(to top, #fff8f4 70%, rgba(255,248,244,0))',
        display: 'flex', gap: 10,
      }}>
        <button style={{
          width: 100, height: 52, borderRadius: 26,
          border: 0, background: '#f1ebe4',
          fontSize: 15, fontWeight: 600, color: C.ink, cursor: 'pointer',
        }}>存草稿</button>
        <button onClick={onDone} style={{
          flex: 1, height: 52, borderRadius: 26, border: 0,
          background: `linear-gradient(135deg, #ff6e9c 0%, ${C.pink} 100%)`,
          color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
          letterSpacing: 1,
          boxShadow: '0 8px 18px -6px rgba(255,91,138,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <span>🖨</span>
          立即印制
        </button>
      </div>
    </div>
  );
}

// ── 版式实景预览（用真实照片渲染选中布局）───────────────────
const PREVIEW_PHOTOS = [
  'assets/p1.jpg','assets/p2.jpg','assets/p3.jpg',
  'assets/p4.jpg','assets/p5.jpg','assets/p6.jpg','assets/p7.jpg',
];

const THEME_CAPTIONS = {
  '孕期时光': ['孕5周','孕8周','孕12周','孕16周','孕20周','孕24周','孕28周','孕32周','孕36周'],
  '新生初见': ['出生第1天','出生第3天','出生第7天','出生第14天','出生第21天','出生第30天'],
  '满月百日': ['宝宝30天','宝宝60天','宝宝90天','宝宝100天','宝宝120天','宝宝150天'],
  '宝宝成长': ['6个月','9个月','1岁','1岁3月','1岁6月','2岁'],
};

function LayoutPreview({ layoutId, captionTexts = [], photos: userPhotos = [], onCellTap, onPickPhoto, editable = false }) {
  const hasCaption = layoutId.endsWith('-c');
  const baseId = layoutId.replace(/-c$/, '');
  const g = 3;

  const cell = (idx) => {
    const text = hasCaption ? captionTexts[idx % Math.max(captionTexts.length, 1)] : null;
    const userSrc = userPhotos[idx] ?? null;
    const demoSrc = PREVIEW_PHOTOS[idx % PREVIEW_PHOTOS.length];
    const src = editable ? userSrc : (userSrc ?? demoSrc);
    const filled = src !== null;

    // ── 空格：点任意区域 = 用这张；「替换照片」打开选择器 ───────────
    const emptyInner = () => (
      <>
        <img src={demoSrc} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', display: 'block', opacity: 0.32,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,248,244,0.60)' }} />
        <div style={{
          position: 'absolute', inset: 2,
          border: `1px dashed ${C.pinkSoft}`, borderRadius: 3, pointerEvents: 'none',
        }} />
        {/* 唯一按钮：替换照片 */}
        <button
          onClick={(e) => { e.stopPropagation(); onPickPhoto?.(idx); }}
          style={{
            position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)',
            padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
            background: 'rgba(255,255,255,0.90)',
            border: `0.5px solid rgba(0,0,0,0.10)`,
            fontSize: 8.5, color: C.ink2, cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}>替换照片</button>
      </>
    );

    // ── 已填格子：照片全展示 + 「替换照片」小按钮 ───────────────────
    const filledInner = () => (
      <>
        <img src={src} alt="" style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
        }} />
        {editable && (
          <>
            {/* 暗渐变让按钮可读 */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 32, pointerEvents: 'none',
              background: 'linear-gradient(to top, rgba(15,6,10,0.55) 0%, transparent 100%)',
            }} />
            {/* 唯一按钮：替换照片 */}
            <button
              onClick={(e) => { e.stopPropagation(); onPickPhoto?.(idx); }}
              style={{
                position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)',
                padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
                background: 'rgba(255,255,255,0.22)',
                border: '0.5px solid rgba(255,255,255,0.50)',
                fontSize: 8.5, color: '#fff', cursor: 'pointer',
              }}>替换照片</button>
          </>
        )}
      </>
    );

    // ── editable + 有文案 → 照片上方，文案独立在下方 ──────────────
    if (editable && text) {
      return (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, height: '100%', overflow: 'hidden' }}>
          {/* 照片区 */}
          <div
            onClick={() => filled ? onPickPhoto?.(idx) : onCellTap?.(idx, demoSrc)}
            style={{
              flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden',
              background: filled ? '#000' : 'transparent',
              cursor: onCellTap ? 'pointer' : 'default',
            }}
          >
            {filled ? filledInner() : emptyInner()}
          </div>
          {/* 文案条 */}
          <div style={{
            flexShrink: 0, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#fffaf6', padding: '0 4px',
            borderTop: '0.5px solid rgba(139,115,85,0.15)',
          }}>
            <span style={{
              fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 700,
              fontSize: 9, color: filled ? C.ink : '#d4a8b0',
              lineHeight: 1, letterSpacing: 0.3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{text}</span>
          </div>
        </div>
      );
    }

    // ── 标准格子（非文案 或 预览模式）──────────────────────────────
    return (
      <div
        key={idx}
        onClick={filled
          ? (editable ? () => onPickPhoto?.(idx) : undefined)
          : (editable ? () => onCellTap?.(idx, demoSrc) : undefined)}
        style={{
          overflow: 'hidden', background: filled ? '#000' : '#e8ddd5',
          minWidth: 0, minHeight: 0, position: 'relative',
          cursor: onCellTap ? 'pointer' : 'default',
        }}
      >
        {filled ? filledInner() : (editable ? emptyInner() : null)}
        {/* 预览模式文案 overlay */}
        {text && !editable && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '10px 4px 4px',
            background: 'linear-gradient(to top, rgba(20,8,12,0.65) 0%, transparent 100%)',
            color: '#fff', fontSize: 9, fontFamily: FONT_SERIF,
            textAlign: 'center', letterSpacing: 0.5, lineHeight: 1.2, pointerEvents: 'none',
          }}>{text}</div>
        )}
      </div>
    );
  };

  const s = { width: '100%', height: '100%' };

  switch (baseId) {
    case '3x3': return (
      <div style={{ ...s, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap: g }}>
        {[0,1,2,3,4,5,6,7,8].map(i => cell(i))}
      </div>
    );
    case '2x2': return (
      <div style={{ ...s, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: g }}>
        {[0,1,2,3].map(i => cell(i))}
      </div>
    );
    case '2x2b': return (
      <div style={{ ...s, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 1 }}>
        {[0,1,2,3].map(i => cell(i))}
      </div>
    );
    case 'v3': return (
      <div style={{ ...s, display: 'grid', gridTemplateRows: 'repeat(3,1fr)', gap: g }}>
        {[0,1,2].map(i => cell(i))}
      </div>
    );
    case 'h3': return (
      <div style={{ ...s, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: g }}>
        {[0,1,2].map(i => cell(i))}
      </div>
    );
    case 'big1': return (
      <div style={{ ...s, display: 'grid', gridTemplateRows: '3fr 2fr', gap: g }}>
        {cell(0)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: g, minHeight: 0 }}>
          {cell(1)}{cell(2)}
        </div>
      </div>
    );
    case 'split': return (
      <div style={{ ...s, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: g }}>
        {cell(0)}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: g, minWidth: 0 }}>
          {cell(1)}{cell(2)}
        </div>
      </div>
    );
    case 'L': return (
      <div style={{ ...s, display: 'grid', gridTemplateRows: '1fr 1fr', gap: g }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: g, minHeight: 0 }}>
          {cell(0)}{cell(1)}
        </div>
        {cell(2)}
      </div>
    );
    case 'rows3': return (
      <div style={{ ...s, display: 'grid', gridTemplateRows: 'repeat(3,1fr)', gap: g }}>
        {[0,1,2].map(i => cell(i))}
      </div>
    );
    case 'cols3': return (
      <div style={{ ...s, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: g }}>
        {[0,1,2].map(i => cell(i))}
      </div>
    );
    case 'cols4': return (
      <div style={{ ...s, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: g }}>
        {[0,1,2,3].map(i => cell(i))}
      </div>
    );
    case 'mix1': return (
      <div style={{ ...s, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: g }}>
        {cell(0)}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: g, minWidth: 0 }}>
          {cell(1)}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: g, minHeight: 0 }}>
            {cell(2)}{cell(3)}
          </div>
        </div>
      </div>
    );
    default: return (
      <div style={{ ...s, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap: g }}>
        {[0,1,2,3,4,5,6,7,8].map(i => cell(i))}
      </div>
    );
  }
}

// ── 版式选择页 ────────────────────────────────────────────────
function LayoutPickerPage({ onBack, onConfirm }) {
  const [tab, setTab] = useState('孕期时光');
  const [activeId, setActiveId] = useState('3x3');

  const layouts = [
    // ── 孕期时光 ──
    { id: '3x3',     theme: '孕期时光', hot: true, name: '九宫格',     cells: 9, ratio: '1:1' },
    { id: '3x3-c',   theme: '孕期时光', hot: true, name: '九宫格·文案', cells: 9, ratio: '1:1' },
    { id: 'cols4',   theme: '孕期时光',            name: '四联竖栏',   cells: 4, ratio: '2:3' },
    { id: 'cols4-c', theme: '孕期时光',            name: '四联·文案',  cells: 4, ratio: '2:3' },
    { id: 'rows3',   theme: '孕期时光',            name: '横向三排',   cells: 3, ratio: '3:4' },
    { id: 'rows3-c', theme: '孕期时光',            name: '三排·文案',  cells: 3, ratio: '3:4' },
    { id: '2x2-c',   theme: '孕期时光',            name: '四格·文案',  cells: 4, ratio: '1:1' },
    { id: 'big1-c',  theme: '孕期时光',            name: '主图·文案',  cells: 3, ratio: '4:3' },
    // ── 新生初见 ──
    { id: 'big1',    theme: '新生初见', hot: true, name: '主图突出',   cells: 3, ratio: '4:3' },
    { id: 'big1-c',  theme: '新生初见', hot: true, name: '主图·文案',  cells: 3, ratio: '4:3' },
    { id: 'split',   theme: '新生初见',            name: '左右切分',   cells: 3, ratio: '4:3' },
    { id: 'split-c', theme: '新生初见',            name: '切分·文案',  cells: 3, ratio: '4:3' },
    { id: 'v3',      theme: '新生初见',            name: '竖排三联',   cells: 3, ratio: '3:4' },
    { id: 'v3-c',    theme: '新生初见',            name: '竖排·文案',  cells: 3, ratio: '3:4' },
    { id: 'L',       theme: '新生初见',            name: 'L 型',       cells: 3, ratio: '1:1' },
    { id: 'L-c',     theme: '新生初见',            name: 'L 型·文案',  cells: 3, ratio: '1:1' },
    // ── 满月百日 ──
    { id: '2x2',     theme: '满月百日', hot: true, name: '经典四宫格', cells: 4, ratio: '1:1' },
    { id: '2x2-c',   theme: '满月百日', hot: true, name: '四格·文案',  cells: 4, ratio: '1:1' },
    { id: 'mix1',    theme: '满月百日',            name: '混合版式',   cells: 4, ratio: '4:3' },
    { id: 'mix1-c',  theme: '满月百日',            name: '混合·文案',  cells: 4, ratio: '4:3' },
    { id: 'cols3',   theme: '满月百日',            name: '竖向三栏',   cells: 3, ratio: '2:3' },
    { id: 'cols3-c', theme: '满月百日',            name: '三栏·文案',  cells: 3, ratio: '2:3' },
    { id: 'L',       theme: '满月百日',            name: 'L 型',       cells: 3, ratio: '1:1' },
    { id: 'L-c',     theme: '满月百日',            name: 'L 型·文案',  cells: 3, ratio: '1:1' },
    // ── 宝宝成长 ──
    { id: 'cols3',   theme: '宝宝成长', hot: true, name: '竖向三栏',   cells: 3, ratio: '2:3' },
    { id: 'cols3-c', theme: '宝宝成长', hot: true, name: '三栏·文案',  cells: 3, ratio: '2:3' },
    { id: 'h3',      theme: '宝宝成长',            name: '横排三联',   cells: 3, ratio: '3:2' },
    { id: 'h3-c',    theme: '宝宝成长',            name: '横排·文案',  cells: 3, ratio: '3:2' },
    { id: '2x2b',    theme: '宝宝成长',            name: '紧凑四格',   cells: 4, ratio: '1:1' },
    { id: '2x2b-c',  theme: '宝宝成长',            name: '紧凑·文案',  cells: 4, ratio: '1:1' },
    { id: '3x3',     theme: '宝宝成长',            name: '九宫格',     cells: 9, ratio: '1:1' },
    { id: 'rows3-c', theme: '宝宝成长',            name: '三排·文案',  cells: 3, ratio: '3:4' },
  ];

  const tabs = ['孕期时光', '新生初见', '满月百日', '宝宝成长'];
  const filtered = layouts.filter((l) => l.theme === tab);
  const current = layouts.find((l) => l.id === activeId && l.theme === tab)
    || filtered[0]
    || layouts[0];

  const handleTabChange = (t) => {
    setTab(t);
    const first = layouts.find((l) => l.theme === t);
    if (first) setActiveId(first.id);
  };

  const [favorites, setFavorites] = useState(new Set());
  const [cellPhotos, setCellPhotos] = useState({});
  const [viewMode, setViewMode] = useState('layout'); // 'layout' | 'edit'
  const [pickerCell, setPickerCell] = useState(null); // null | idx — 换一张 sheet

  const favKey = (l) => `${l.theme}::${l.id}`;
  const isFav = favorites.has(favKey(current));

  const toggleFav = () => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(favKey(current))) next.delete(favKey(current));
      else next.add(favKey(current));
      return next;
    });
  };

  const toggleFavLayout = (l) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const key = favKey(l);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleConfirm = () => {
    setFavorites((prev) => new Set([...prev, favKey(current)]));
    onConfirm();
  };

  // 点击格子填充照片
  // sugSrc 有值 → 直接用这张（用户点击兜底照片）
  // sugSrc 为 null → 循环下一张（点击"换图"）
  // idx 有值但 sugSrc 为 undefined → 已填格子点击，循环下一张
  const replaceCell = (idx, sugSrc) => {
    if (sugSrc !== null && sugSrc !== undefined) {
      setCellPhotos((prev) => ({ ...prev, [idx]: sugSrc }));
      return;
    }
    const cur = cellPhotos[idx] ?? PREVIEW_PHOTOS[idx % PREVIEW_PHOTOS.length];
    const curI = PREVIEW_PHOTOS.indexOf(cur);
    setCellPhotos((prev) => ({
      ...prev,
      [idx]: PREVIEW_PHOTOS[(curI + 1) % PREVIEW_PHOTOS.length],
    }));
  };

  // 切换版式时重置 viewMode
  const handleLayoutSelect = (id) => {
    setActiveId(id);
    setViewMode('layout');
  };

  const previewPhotos = Array.from({ length: 9 }, (_, i) => cellPhotos[i] ?? null);

  const dimMap = {
    '1:1': { w: 240, h: 240 },
    '3:4': { w: 196, h: 261 },
    '4:3': { w: 261, h: 196 },
    '2:3': { w: 185, h: 277 },
    '3:2': { w: 277, h: 185 },
  };
  const dim = dimMap[current.ratio] || { w: 240, h: 240 };

  const isEdit = viewMode === 'edit';
  const gridCols = current.cells === 4 ? 2 : 3;
  const captions = THEME_CAPTIONS[tab] || [];
  const hasCaption = current.id.endsWith('-c');

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background: isEdit ? '#fff8f4' : C.paper,
      fontFamily: FONT_SANS, color: C.ink,
      display: 'flex', flexDirection: 'column', position: 'relative',
      transition: 'background 0.3s',
    }}>

      {/* ── 顶部导航 ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 16px 10px', flexShrink: 0,
      }}>
        {/* 左：返回按钮（edit 模式显示文字） */}
        <button
          onClick={isEdit ? () => setViewMode('layout') : onBack}
          style={{
            height: 36, border: 0, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            padding: isEdit ? '0 4px' : '0',
          }}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M8.5 1L1.5 8L8.5 15" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isEdit && (
            <span style={{ fontSize: 13, color: C.ink2, fontWeight: 400 }}>返回</span>
          )}
        </button>

        <div style={{ fontSize: 16, fontWeight: 600 }}>
          {isEdit ? '替换照片' : '选择版式'}
        </div>

        {/* 右：占位保持对称 */}
        <div style={{ width: 36 }} />
      </div>

      {/* ══ LAYOUT 模式：小预览卡片 ══ */}
      {!isEdit && (
        <div style={{
          flex: 1, minHeight: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${C.blush} 0%, ${C.cream} 60%, ${C.paper} 100%)`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 0 8px',
        }}>
          {/* 版式卡片 — 精致边框，点击整体进入编辑 */}
          <div
            key={current.id}
            onClick={() => setViewMode('edit')}
            style={{
              width: dim.w, height: dim.h, borderRadius: 4, overflow: 'hidden',
              border: '1.5px solid #8b7355',
              boxShadow:
                'inset 0 0 0 4px #fff,' +
                'inset 0 0 0 5px rgba(139,115,85,0.20),' +
                '0 10px 28px rgba(80,30,40,0.18)',
              transition: 'width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1)',
              cursor: 'pointer',
            }}>
            <LayoutPreview
              layoutId={current.id}
              captionTexts={captions}
              photos={previewPhotos}
              onCellTap={() => setViewMode('edit')}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{tab}</div>
            <div style={{ fontSize: 11, color: C.mute, marginTop: 2 }}>
              {current.cells} 张照片 · 点击格子或下一步填入
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT 模式：保持版式形状 + 精致边框 + 宝宝信息 ══ */}
      {isEdit && (
        <div
          style={{
            flex: 1, minHeight: 0, overflowY: 'auto',
            background: `radial-gradient(ellipse at 50% 0%, ${C.blush} 0%, ${C.cream} 60%, ${C.paper} 100%)`,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '14px 14px 10px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setViewMode('layout'); }}
        >
          {/* 精致边框卡片 */}
          <div style={{
            width: '100%', flexShrink: 0,
            background: '#fffaf6',
            border: '1.5px solid #8b7355',
            borderRadius: 4,
            boxShadow:
              'inset 0 0 0 5px #fff,' +
              'inset 0 0 0 6px rgba(139,115,85,0.22),' +
              '0 10px 32px rgba(80,30,40,0.18)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            {/* 照片网格 */}
            <div style={{ aspectRatio: `${dim.w}/${dim.h}`, width: '100%' }}>
              <LayoutPreview
                layoutId={current.id}
                captionTexts={captions}
                photos={previewPhotos}
              onCellTap={(idx, src) => replaceCell(idx, src)}
              onPickPhoto={(idx) => setPickerCell(idx)}
              editable={true}
              />
            </div>

            {/* 宝宝信息 */}
            <div style={{
              padding: '12px 16px 14px', textAlign: 'center',
              borderTop: '1px solid rgba(139,115,85,0.18)',
              background: '#fffaf6',
            }}>
              <div style={{
                fontFamily: FONT_SERIF, fontSize: 17, fontWeight: 700,
                letterSpacing: 6, color: '#2a1f0a', marginBottom: 6,
              }}>豆 豆</div>
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: 6, flexWrap: 'wrap',
                fontSize: 8.5, color: '#8b7355', letterSpacing: 0.6,
                fontFamily: FONT_SANS,
              }}>
                <span>BIRTHDAY · 2026.06.28</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>WEIGHT · 3200G</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>HEIGHT · 50CM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 分割线（layout 模式才显示）── */}
      {!isEdit && <div style={{ height: 0.5, background: C.line, flexShrink: 0 }} />}

      {/* ── 主题 tabs + 缩略图（layout 模式显示，edit 模式收起）── */}
      <div style={{
        overflow: 'hidden', flexShrink: 0,
        maxHeight: isEdit ? 0 : 300,
        opacity: isEdit ? 0 : 1,
        transition: 'max-height 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s',
      }}>
        <div style={{ display: 'flex', borderBottom: `0.5px solid ${C.line}` }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => handleTabChange(t)} style={{
              flex: 1, padding: '10px 2px 9px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 12, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? C.pink : C.ink2,
              borderBottom: tab === t ? `2px solid ${C.pink}` : '2px solid transparent',
              marginBottom: -0.5, whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>
        <div style={{
          padding: '10px 14px 8px',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8,
        }}>
          {filtered.map((l, i) => {
            const active = l.id === activeId && l.theme === tab;
            const faved = favorites.has(favKey(l));
            return (
              <div key={`${l.theme}-${l.id}-${i}`} onClick={() => handleLayoutSelect(l.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', position: 'relative' }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 8,
                  border: active ? `2px solid ${C.pink}` : `1px solid ${C.line}`,
                  background: active ? '#fff5f7' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active ? `0 0 0 2px ${C.pinkSoft}` : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  position: 'relative',
                }}>
                  <LayoutGlyph kind={l.id} active={active} />
                  {/* 每个缩略图右上角的爱心 */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavLayout(l); }}
                    style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 18, height: 18, borderRadius: 9,
                      background: faved ? C.pink : 'rgba(255,255,255,0.92)',
                      border: faved ? 'none' : `1px solid ${C.pinkSoft}`,
                      cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.18s',
                    }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24"
                      fill={faved ? '#fff' : 'none'}
                      stroke={faved ? '#fff' : C.pink}
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div style={{
                  fontSize: 9.5, color: active ? C.pink : C.mute,
                  fontWeight: active ? 600 : 400, textAlign: 'center', lineHeight: 1.3,
                }}>{l.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 底部 CTA ── */}
      <div style={{ padding: '8px 16px 22px', flexShrink: 0, background: isEdit ? '#fff8f4' : C.paper }}>
        <button
          onClick={isEdit ? handleConfirm : () => setViewMode('edit')}
          style={{
            width: '100%', height: 50, borderRadius: 26, border: 0,
            background: `linear-gradient(135deg, #ff6e9c 0%, ${C.pink} 100%)`,
            color: '#fff', fontSize: 16, fontWeight: 700,
            letterSpacing: 1, cursor: 'pointer',
            boxShadow: '0 8px 18px -6px rgba(255,91,138,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          {isEdit ? '完成，生成纪念卡' : '下一步'}
        </button>
      </div>

      {/* ── 照片选择器 sheet（换一张）── */}
      {pickerCell !== null && (
        <>
          {/* 半透明遮罩，背后海报仍可见 */}
          <div
            onClick={() => setPickerCell(null)}
            style={{
              position: 'absolute', inset: 0, zIndex: 300,
              background: 'rgba(20,8,12,0.45)',
            }}
          />
          {/* 底部 sheet */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 301,
            background: '#fff', borderRadius: '16px 16px 0 0',
            paddingBottom: 28,
            boxShadow: '0 -4px 24px rgba(80,30,40,0.14)',
          }}>
            {/* 拖拽手柄 */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: C.line }} />
            </div>

            {/* 标题 */}
            <div style={{
              padding: '8px 18px 4px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>换一张</div>
                <div style={{ fontSize: 11, color: C.mute, marginTop: 2 }}>从你已上传的孕期照片中选择</div>
              </div>
              <button onClick={() => setPickerCell(null)} style={{
                width: 28, height: 28, borderRadius: 14,
                background: C.cream, border: 'none', cursor: 'pointer',
                fontSize: 14, color: C.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </div>

            {/* 从相册上传新照片（高价值，最顶部）*/}
            <div style={{ padding: '10px 18px 8px' }}>
              <button
                onClick={() => { replaceCell(pickerCell, null); setPickerCell(null); }}
                style={{
                  width: '100%', height: 44, borderRadius: 10, border: 0,
                  background: `linear-gradient(135deg, #ff6e9c 0%, ${C.pink} 100%)`,
                  color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 14px rgba(255,91,138,0.35)',
                }}>
                <span>📷</span>
                <span>从相册上传新照片</span>
              </button>
            </div>

            <div style={{ height: 0.5, background: C.line, margin: '0 18px 10px' }} />

            {/* 已上传照片网格 */}
            <div style={{ padding: '0 18px', }}>
              <div style={{ fontSize: 11, color: C.mute, marginBottom: 8 }}>已上传的照片</div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
              }}>
                {PREVIEW_PHOTOS.map((src, i) => {
                  const isCurrently = (previewPhotos[pickerCell] ?? PREVIEW_PHOTOS[pickerCell % PREVIEW_PHOTOS.length]) === src;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setCellPhotos((prev) => ({ ...prev, [pickerCell]: src }));
                        setPickerCell(null);
                      }}
                      style={{
                        aspectRatio: '1', borderRadius: 6, overflow: 'hidden',
                        cursor: 'pointer', position: 'relative',
                        border: isCurrently ? `2px solid ${C.pink}` : '2px solid transparent',
                        boxShadow: isCurrently ? `0 0 0 1px ${C.pinkSoft}` : 'none',
                      }}
                    >
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      {isCurrently && (
                        <div style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 16, height: 16, borderRadius: 8,
                          background: C.pink, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700,
                        }}>✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── 首页 ──────────────────────────────────────────────────────
function PuzzlePage({ onGenerate }) {
  const [previewIdx, setPreviewIdx] = useState(0);
  const [counter, setCounter] = useState(12847);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCounter((c) => c + Math.floor(Math.random() * 3) + 1), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden', position: 'relative',
      background: C.paper, fontFamily: FONT_SANS, color: C.ink,
    }}>
      {/* 滚动区域 */}
      <div
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 20)}
        style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 96 }}>

        {/* HERO */}
        <div style={{
          position: 'relative',
          background: `radial-gradient(ellipse at 30% 0%, ${C.blush} 0%, ${C.cream} 45%, ${C.paper} 80%)`,
          paddingTop: 100, paddingBottom: 12,
        }}>
          {/* 社会证明胶囊 */}
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
              border: `0.5px solid ${C.pinkSoft}`,
              fontSize: 11, color: C.ink2,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: C.pink }} />
              <span style={{
                fontVariantNumeric: 'tabular-nums', color: C.pink, fontWeight: 600,
              }}>{counter.toLocaleString()}</span>
              位妈妈已经为宝宝生成了成长纪念卡
            </span>
          </div>

          {/* 大标题 */}
          <div style={{ textAlign: 'center', padding: '18px 24px 0' }}>
            <div style={{
              fontFamily: FONT_SERIF, fontSize: 32, fontWeight: 700,
              lineHeight: 1.25, color: C.ink, letterSpacing: 0.5,
            }}>
              这 280 天，<br/>
              <span style={{ color: C.pink }}>值得</span>好好珍藏
            </div>
          </div>

          {/* 轮播 */}
          <div style={{ marginTop: 18 }}>
            <HeroPreview idx={previewIdx} setIdx={setPreviewIdx} onGenerate={onGenerate} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 0 }}>
              {SAMPLES.map((_, i) => (
                <div key={i} onClick={() => setPreviewIdx(i)}
                  style={{
                    width: i === previewIdx ? 14 : 5, height: 5, borderRadius: 3,
                    background: i === previewIdx ? C.pink : C.pinkSoft,
                    transition: 'all 0.3s', cursor: 'pointer',
                  }} />
              ))}
            </div>
          </div>
        </div>

        {/* 素材就绪卡片 */}
        <div style={{ padding: '14px 18px 0', background: C.paper }}>
          <div style={{
            position: 'relative', overflow: 'hidden',
            background: `linear-gradient(135deg, #fff5ee 0%, #ffeaef 100%)`,
            border: `0.5px solid ${C.pinkSoft}`,
            borderRadius: 14, padding: '16px 16px 14px',
          }}>
            <div style={{
              position: 'absolute', top: 10, right: 12,
              fontSize: 10, color: C.pink, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 3, background: C.pink,
                boxShadow: `0 0 0 3px ${C.pinkSoft}`,
              }} />
              已就绪
            </div>

            <div style={{
              fontFamily: FONT_SERIF, fontSize: 17, fontWeight: 700, color: C.ink,
              letterSpacing: 0.5,
            }}>豆豆的专属成长纪念卡已经准备好了</div>
            <div style={{ fontSize: 12, color: C.ink2, marginTop: 4 }}>
              一份有意义的礼物，送给宝宝也送给自己
            </div>

            <div style={{
              marginTop: 14,
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              columnGap: 14, rowGap: 12,
            }}>
              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6.5" stroke={C.pink} strokeWidth="1.4"/>
                      <path d="M5.5 8.2L7 9.7L10.5 6.2" stroke={C.pink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  k: '完全免费', v: '不限次数畅做',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M9 1L3 9H7.5L7 15L13 7H8.5L9 1Z" stroke={C.pink} strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                  ),
                  k: '30 秒成图', v: 'AI 智能排版',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="6" width="10" height="6" rx="1" stroke={C.pink} strokeWidth="1.4"/>
                      <path d="M4.5 6V2.5H11.5V6" stroke={C.pink} strokeWidth="1.4" strokeLinejoin="round"/>
                      <rect x="5" y="9" width="6" height="4.5" stroke={C.pink} strokeWidth="1.4" fill="#fff"/>
                    </svg>
                  ),
                  k: '支持冲印', v: '可印成照片书',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="2" width="5" height="5" rx="0.8" stroke={C.pink} strokeWidth="1.4"/>
                      <rect x="9" y="2" width="5" height="5" rx="0.8" stroke={C.pink} strokeWidth="1.4"/>
                      <rect x="2" y="9" width="5" height="5" rx="0.8" stroke={C.pink} strokeWidth="1.4"/>
                      <rect x="9" y="9" width="5" height="5" rx="0.8" stroke={C.pink} strokeWidth="1.4"/>
                    </svg>
                  ),
                  k: '10+ 版式', v: '一键换风格',
                },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    flex: '0 0 28px', width: 28, height: 28, borderRadius: 8,
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(80,30,40,0.06)',
                  }}>{r.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{r.k}</div>
                    <div style={{ fontSize: 10.5, color: C.ink2, marginTop: 1, lineHeight: 1.3 }}>{r.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 顶部导航（滚动时出现磨砂效果）*/}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '52px 16px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,250,246,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'saturate(180%) blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(14px)' : 'none',
        borderBottom: scrolled ? `0.5px solid ${C.line}` : '0.5px solid transparent',
        transition: 'background 0.2s, border-color 0.2s',
        pointerEvents: 'auto',
      }}>
        <button aria-label="返回" style={{
          width: 36, height: 36, border: 0,
          background: scrolled ? 'transparent' : 'rgba(255,255,255,0.7)',
          borderRadius: 18, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M8.5 1L1.5 8L8.5 15" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>成长纪念卡</div>
        <div style={{ width: 36, height: 36 }} />
      </div>

      {/* 底部 CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 18px 22px',
        background: 'linear-gradient(to top, #fffaf6 65%, rgba(255,250,246,0))',
      }}>
        <button onClick={onGenerate} style={{
          width: '100%', height: 52, borderRadius: 26, border: 0,
          background: `linear-gradient(135deg, #ff6e9c 0%, ${C.pink} 100%)`,
          color: '#fff', fontSize: 16, fontWeight: 700,
          letterSpacing: 1, cursor: 'pointer',
          boxShadow: '0 8px 18px -6px rgba(255,91,138,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          给豆豆做同款
        </button>
      </div>
    </div>
  );
}

// ── 完成页（纪念卡已保存）────────────────────────────────────────
// 撒花动效 CSS（注入一次）
const CONFETTI_STYLE = `
@keyframes confettiFall {
  0%   { transform: translateY(-30px) rotate(0deg) scaleX(1);   opacity: 1; }
  60%  { opacity: 1; }
  100% { transform: translateY(920px) rotate(600deg) scaleX(-1); opacity: 0; }
}
@keyframes confettiSway {
  0%,100% { margin-left: 0px; }
  33%     { margin-left: 12px; }
  66%     { margin-left: -10px; }
}`;

function CompletionPage({ onClose, onPrint }) {
  // 注入动画样式
  React.useEffect(() => {
    const id = 'confetti-keyframes';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id; el.textContent = CONFETTI_STYLE;
      document.head.appendChild(el);
    }
  }, []);

  // 30 个撒花粒子
  const pieces = React.useMemo(() => {
    const colors = ['#ff5b8a','#ffd27a','#a8d8ea','#c9b8ff','#ffb3c8','#7ed8b4','#ff9e6e','#b8d4ff'];
    return Array.from({ length: 30 }, (_, i) => ({
      left:    `${(i * 37 + 3) % 100}%`,
      w:       [6, 8, 10, 5, 9][i % 5],
      h:       [14, 8, 18, 10, 6][i % 5],
      bg:      colors[i % colors.length],
      dur:     `${3.2 + (i % 7) * 0.5}s`,
      delay:   `${(i % 9) * 0.25}s`,
      sway:    `${1.8 + (i % 4) * 0.6}s`,
      radius:  i % 3 === 0 ? '50%' : '2px',
    }));
  }, []);

  const SHARE_APPS = [
    { name: '微信好友', bg: '#07C160', icon: '💬' },
    { name: '朋友圈',  bg: '#FA8919', icon: '⊙' },
    { name: '抖音',    bg: '#000',    icon: '♪' },
    { name: '小红书',  bg: '#FE2C55', icon: '✦' },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      overflow: 'hidden',                         /* 裁切撒花，不超出手机边框 */
      background: 'linear-gradient(180deg, #fff5f8 0%, #fffaf6 55%, #fff 100%)',
      fontFamily: FONT_SANS, color: C.ink,
    }}>

      {/* ── 撒花动效（absolute，被外层裁切）── */}
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.left, top: 0,
          width: p.w, height: p.h, borderRadius: p.radius,
          background: p.bg, opacity: 0.82,
          animation:
            `confettiFall ${p.dur} ${p.delay} ease-in infinite,` +
            `confettiSway ${p.sway} ${p.delay} ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 50,
        }} />
      ))}

      {/* ── 可滚动内容区 ── */}
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingBottom: 32,
      }}>

      {/* 关闭按钮 */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 52, left: 18, zIndex: 60,
        width: 32, height: 32, border: 0, background: 'transparent',
        cursor: 'pointer', fontSize: 20, color: C.ink2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>

      {/* 标题 */}
      <div style={{ marginTop: 68, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 700,
          color: C.ink, letterSpacing: 1,
        }}>纪念卡已保存</div>
        <div style={{ fontSize: 12, color: C.mute, marginTop: 6 }}>
          已自动保存至时间轴
        </div>
      </div>

      {/* 纪念卡预览（放大 + 精致边框 + 美柚水印）*/}
      <div style={{
        marginTop: 20, width: 290, position: 'relative', zIndex: 10,
        border: '1.5px solid #8b7355',
        borderRadius: 4,
        boxShadow:
          'inset 0 0 0 5px #fff,' +
          'inset 0 0 0 6px rgba(139,115,85,0.20),' +
          '0 16px 40px rgba(80,30,40,0.22)',
        background: '#fffaf6',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, padding: 2 }}>
          {PREVIEW_PHOTOS.slice(0, 9).map((src, i) => (
            <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', background: '#ddd6cf' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
        <div style={{
          padding: '10px 14px 12px', textAlign: 'center',
          borderTop: '0.5px solid rgba(139,115,85,0.18)',
          position: 'relative',
        }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 700, letterSpacing: 5, color: '#2a1f0a' }}>豆 豆</div>
          <div style={{ fontSize: 8.5, color: '#8b7355', marginTop: 4, letterSpacing: 0.5 }}>
            BIRTHDAY · 2026.06.28 · WEIGHT · 3200G · HEIGHT · 50CM
          </div>
          <div style={{
            position: 'absolute', bottom: 6, right: 10,
            fontSize: 8, color: C.pink, opacity: 0.65,
            fontWeight: 600, letterSpacing: 0.5,
          }}>美柚</div>
        </div>
      </div>

      {/* 立即印制 */}
      <div style={{ marginTop: 20, width: '100%', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <button onClick={onPrint} style={{
          width: '100%', height: 48, borderRadius: 26, border: 0,
          background: `linear-gradient(135deg, #ff6e9c 0%, ${C.pink} 100%)`,
          color: '#fff', fontSize: 16, fontWeight: 700,
          cursor: 'pointer', letterSpacing: 1,
          boxShadow: '0 8px 18px -6px rgba(255,91,138,0.5)',
        }}>立即印制</button>
      </div>

      {/* 分享到 */}
      <div style={{ marginTop: 20, textAlign: 'center', width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{
          fontSize: 12, color: C.mute, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
        }}>
          <div style={{ flex: 1, height: 0.5, background: C.line, maxWidth: 60 }} />
          分享到
          <div style={{ flex: 1, height: 0.5, background: C.line, maxWidth: 60 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {SHARE_APPS.map((app) => (
            <div key={app.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 26, background: app.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}>{app.icon}</div>
              <div style={{ fontSize: 10, color: C.ink2 }}>{app.name}</div>
            </div>
          ))}
        </div>
      </div>

      </div>  {/* end 可滚动内容区 */}
    </div>
  );
}

// ── 主应用（iOS 设备框架包裹）────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home');

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, #f3eee6 0%, #e7ddd1 100%)',
      padding: '32px 16px',
    }}>
      <IOSDevice width={402} height={874}>
        {screen === 'home' && (
          <PuzzlePage onGenerate={() => setScreen('layout')} />
        )}
        {screen === 'layout' && (
          <LayoutPickerPage
            onBack={() => setScreen('home')}
            onConfirm={() => setScreen('done')} />
        )}
        {screen === 'done' && (
          <CompletionPage
            onClose={() => setScreen('home')}
            onPrint={() => {}} />
        )}
      </IOSDevice>
    </div>
  );
}
