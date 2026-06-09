import React, { useState, useEffect, useRef } from 'react';
import { IOSDevice } from './IOSFrame';
import { MeiyouHomePage } from './MeiyouHomePage';
import { MeiyouBabyProfilePage } from './MeiyouBabyProfilePage';
import { SCATTER_DEMO_PHOTOS } from './ScatterGridPolaroid';
import { FinishedProductPreviewOverlay } from './FinishedProductPreview';
import { MemorialStoryRingHeader, FetusPregnancyTimelineHeader } from './MemorialStoryRingHeader';
import { PAPER_STYLES, PAPER_IDS, paperFrameBoxStyle, resolvePaperId } from './paper-styles';

// ── 样本数据 ──────────────────────────────────────────────────
const SAMPLES = [
  { kind: 'demo', tag: '宝宝九宫格' },
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
/** 「期待感」方案 D / 出生金辉格 — 与原 album-future.jsx 对齐 */
const FONT_FET_MONO = `"IBM Plex Mono", "SF Mono", ui-monospace, Menlo, monospace`;

const FET_ANT = {
  gold: '#b89f76',
  goldDeep: '#8a6f3e',
  goldGlow: '#e8c98a',
  ink: '#2b2620',
  ink2: '#5d5448',
  mute: '#a89e8b',
  bgCell: '#e9dfd0',
};

// ── 自动轮播 carousel ────────────────────────────────────────
function StaticNineDemo({ scale = 1 }) {
  const cellW = 50 * scale;
  const cellH = 72 * scale;
  const gap = 4 * scale;
  const pad = 4 * scale;
  const base = import.meta.env.BASE_URL || '/';
  const asset = (src) => (src.startsWith('/') ? src : `${base}${src}`);

  return (
    <div style={{
      padding: pad,
      display: 'grid',
      gridTemplateColumns: `repeat(3, ${cellW}px)`,
      gridTemplateRows: `repeat(3, ${cellH}px)`,
      gap,
      boxSizing: 'border-box',
    }}
    >
      {SCATTER_DEMO_PHOTOS.map((p, i) => (
        <div
          key={i}
          style={{
            width: cellW,
            height: cellH,
            borderRadius: 3 * scale,
            border: `${Math.max(1, Math.round(scale))}px solid #fff`,
            background: '#f3ebe4',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(80,30,40,0.10)',
          }}
        >
          <img
            src={asset(p.src)}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      ))}
    </div>
  );
}

function HeroPreview({ idx, setIdx }) {
  useEffect(() => {
    const dwell = 2200;
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
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                >
                  <StaticNineDemo scale={1} />
                </div>
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
              {s.tag}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 模板选择器图示（支持文案版 -c 后缀）────────────────────
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
          }}>生成纪念拼图</button>
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

// ── 模板实景预览（用真实照片渲染选中布局）───────────────────
const PREVIEW_PHOTOS = [
  'assets/p1.jpg','assets/p2.jpg','assets/p3.jpg',
  'assets/p4.jpg','assets/p5.jpg','assets/p6.jpg','assets/p7.jpg',
];

const THEME_CAPTIONS = {
  '孕期时光': ['孕5周', '孕8周', '孕12周', '孕16周', '孕20周', '孕24周', '孕28周', '孕32周', '出生'],
  /** 新生儿 · 满月 · 成长期 合并文案池 */
  '宝宝成长': [
    '出生第1天', '出生第7天', '出生第14天', '满月', '宝宝60天',
    '百日', '6个月', '9个月', '1岁', '1岁半', '2岁',
  ],
};

function captionsForTheme(theme, cellCount) {
  const pool = THEME_CAPTIONS[themeTabForCaptions(theme)] || THEME_CAPTIONS['孕期时光'];
  return pool.slice(0, cellCount);
}

function resolveLayoutGridId(layoutId) {
  if (!layoutId) return '3x3';
  const hasCaption = String(layoutId).endsWith('-c');
  const stem = hasCaption ? layoutId.slice(0, -2) : layoutId;
  if (stem === '2x2' || stem.startsWith('2x2-')) return hasCaption ? '2x2-c' : '2x2';
  if (stem === '3x3' || stem.startsWith('3x3-')) return hasCaption ? '3x3-c' : '3x3';
  return layoutId;
}

function pushBootstrapForTweak(tweak) {
  if (tweak === 'upload') return 'demo-born-empty';
  if (tweak === 'locked') return 'demo-fetus-progress';
  if (tweak === 'completed') return 'demo-born-complete';
  return null;
}

/** 推送落地 · 原型 tweaks 切换（圆环进度页内） */
function PushTweakBar({ value, onChange }) {
  const opts = [
    { id: 'upload', label: '待上传·＋' },
    { id: 'locked', label: '未到时间' },
    { id: 'completed', label: '已完成' },
  ];
  return (
    <div style={{
      marginBottom: 10,
      padding: 3,
      borderRadius: 8,
      background: 'rgba(255,255,255,0.72)',
      border: '0.5px solid rgba(139,115,85,0.14)',
      display: 'flex',
      gap: 4,
    }}
    >
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              flex: 1,
              height: 28,
              border: 'none',
              borderRadius: 6,
              background: active ? C.pink : 'transparent',
              color: active ? '#fff' : C.ink2,
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: FONT_SANS,
              whiteSpace: 'nowrap',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** 孕期时光 / 宝宝成长 · 各 2 行 × 4 列（四格 + 九格·文案 × 四种纸框） */
const GRID_LAYOUTS = (() => {
  const list = [];
  ['孕期时光', '宝宝成长'].forEach((theme) => {
    PAPER_IDS.forEach((paperId) => {
      [
        { grid: '2x2', gridKind: '四格', cells: 4, withCaption: false },
        { grid: '3x3', gridKind: '九格', cells: 9, withCaption: true },
      ].forEach(({ grid, gridKind, cells, withCaption }) => {
        const id = withCaption ? `${grid}-${paperId}-c` : `${grid}-${paperId}`;
        list.push({
          id,
          theme,
          gridKind,
          paperId,
          cells,
          ratio: '1:1',
          name: `${gridKind} · ${PAPER_STYLES[paperId].name}${withCaption ? '·文案' : ''}`,
          hot: theme === '孕期时光' && grid === '3x3' && paperId === 'warm' && withCaption,
        });
      });
    });
  });
  return list;
})();

/** 美柚「入口3」· 未到周数锁定格的发育示意（孕28 / 孕32） */
const PREG_TIME_LOCK_COPY = {
  6: { emoji: '🍆', likeness: '像一颗茄子', cm: '约 38cm' },
  7: { emoji: '🥦', likeness: '像一颗椰菜', cm: '约 43cm' },
};

/** 胎宝宝 · 方案 D「微光预告」：弱显示例图 + 金色 +周 + tips（同源 album-future VariantD） */
const FETUS_LUXURY_MILESTONE_SLOT = {
  6: {
    date: '2026.07.22',
    deltaWeeks: 8,
    tip: '拍一张大肚剪影',
    previewSrc: 'assets/p4.jpg',
  },
  7: {
    date: '2026.08.19',
    deltaWeeks: 12,
    tip: '布置宝宝小床',
    previewSrc: 'assets/p7.jpg',
  },
};

/** 出生格 · BirthCellGoldPreview：逆光 + 光束 + sparkle + 文案 + 日期 */
const FETUS_BIRTH_LUXURY = { dateLine: '2026.06.28', haloSrc: 'assets/p1.jpg' };

/** 待上传格 · 前几格里程碑示意（与锁定格同视觉，多「+」上传） */
const UPLOAD_EARLY_MILESTONE = {
  2: { date: '2026.06.02', deltaWeeks: 4, tip: '记录第一次胎动', previewSrc: 'assets/p2.jpg' },
  3: { date: '2026.06.20', deltaWeeks: 4, tip: '留下孕肚合影', previewSrc: 'assets/p3.jpg' },
  4: { date: '2026.07.05', deltaWeeks: 4, tip: '和宝宝说句话', previewSrc: 'assets/p5.jpg' },
  5: { date: '2026.07.15', deltaWeeks: 4, tip: '拍一张侧面照', previewSrc: 'assets/p6.jpg' },
};

function uploadMilestoneMeta(idx) {
  if (idx === 8) return { type: 'birth', ...FETUS_BIRTH_LUXURY };
  return FETUS_LUXURY_MILESTONE_SLOT[idx] || UPLOAD_EARLY_MILESTONE[idx] || null;
}

function UploadPlusBadge() {
  return (
    <span style={{
      position: 'relative',
      zIndex: 3,
      width: 36,
      height: 36,
      borderRadius: 18,
      border: `1.5px dashed ${C.pink}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      color: C.pink,
      fontWeight: 400,
      lineHeight: 1,
      fontFamily: FONT_SANS,
      background: 'rgba(255,255,255,0.88)',
      boxShadow: '0 2px 10px rgba(80,40,50,0.12)',
    }}
    aria-hidden
    >
      ＋
    </span>
  );
}

function FetusAnticipSparkle({ size = 16, color = FET_ANT.goldDeep }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ display: 'block' }} aria-hidden>
      <path d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z" fill={color} />
    </svg>
  );
}

function FetusAnticipSunburstRays({ stroke }) {
  const cx = 50;
  const cy = 50;
  const rays = [];
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    const r1 = 18;
    const r2 = 42;
    rays.push(
      <line
        key={i}
        x1={cx + Math.cos(a) * r1}
        y1={cy + Math.sin(a) * r1}
        x2={cx + Math.cos(a) * r2}
        y2={cy + Math.sin(a) * r2}
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinecap="round"
        opacity={0.5}
      />
    );
  }
  return <g>{rays}</g>;
}

/** 已保存的卡若仍为旧四类里的「新生初见 / 满月百日」，文案归入宝宝成长池 */
function themeTabForCaptions(themeTab) {
  if (themeTab === '新生初见' || themeTab === '满月百日') return '宝宝成长';
  return themeTab;
}

/** 全屏相册（原型）：深色、按日期分组、便于从大量素材中选择 */
const ALBUM_GROUPS = (() => {
  const dates = ['2026年5月17日', '2026年5月16日', '2026年5月12日', '2026年5月8日'];
  return dates.map((date, di) => {
    const items = [];
    const count = di === 0 ? 20 : 12;
    for (let i = 0; i < count; i += 1) {
      if (di === 0 && i === 4) {
        items.push({ kind: 'wechat', id: `${date}-wx` });
      }
      items.push({
        kind: 'photo',
        id: `${date}-p${i}`,
        src: PREVIEW_PHOTOS[(di * 16 + i) % PREVIEW_PHOTOS.length],
        live: i % 5 === 0,
      });
    }
    return { date, items };
  });
})();

/** mode: single = 替换某一格；batch = 先多选照片再填入模板（按顺序占格） */
function AlbumPhotoPickerOverlay({
  mode = 'single',
  maxSlots = 9,
  initialSrc,
  onClose,
  onApply,
  onBatchApply,
}) {
  const fileRef = React.useRef(null);
  const isBatch = mode === 'batch';
  const [selectedSrc, setSelectedSrc] = useState(isBatch ? null : (initialSrc || null));
  /** batch：按点选顺序 [{ id, src }] */
  const [batchOrder, setBatchOrder] = useState([]);

  const batchCount = batchOrder.length;
  const batchOk = isBatch && batchCount === maxSlots;

  const toggleBatch = (id, src) => {
    setBatchOrder((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      if (i >= 0) {
        const next = [...prev];
        next.splice(i, 1);
        return next;
      }
      if (prev.length >= maxSlots) return prev;
      return [...prev, { id, src }];
    });
  };

  const isBatchSelected = (id) => batchOrder.some((x) => x.id === id);

  const removeFromBatch = (id) => {
    setBatchOrder((prev) => prev.filter((x) => x.id !== id));
  };

  const selectAllInDate = (date) => {
    const g = ALBUM_GROUPS.find((x) => x.date === date);
    if (!g) return;
    if (isBatch) {
      const photos = g.items.filter((it) => it.kind === 'photo');
      setBatchOrder((prev) => {
        const ids = new Set(prev.map((x) => x.id));
        const room = Math.max(0, maxSlots - prev.length);
        if (room === 0) return prev;
        const add = photos.filter((p) => !ids.has(p.id)).slice(0, room);
        return [...prev, ...add.map((p) => ({ id: p.id, src: p.src }))];
      });
      return;
    }
    const first = g.items.find((it) => it.kind === 'photo');
    if (first?.src) setSelectedSrc(first.src);
  };

  const bg = '#000000';
  const text = 'rgba(255,255,255,0.9)';
  const textSub = 'rgba(255,255,255,0.48)';
  const pink = '#ff4d88';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 400,
      background: bg,
      display: 'flex', flexDirection: 'column',
      fontFamily: FONT_SANS, color: text,
    }}>
      {/* 顶栏 */}
      <div style={{
        flexShrink: 0,
        padding: '48px 12px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 36, height: 36, border: 'none', borderRadius: 8,
            background: 'transparent', color: text, cursor: 'pointer',
            fontSize: 20, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label={isBatch ? '返回' : '关闭'}
        >
          ✕
        </button>
        <button
          type="button"
          style={{
            border: 'none', background: 'transparent', color: text,
            fontSize: 16, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          最近项目
          <span style={{ fontSize: 10, opacity: 0.8 }}>▼</span>
        </button>
        <div style={{ width: 36 }} />
      </div>

      {/* 可滚动网格 */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {ALBUM_GROUPS.map((group) => (
          <div key={group.date}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 14px 6px', position: 'sticky', top: 0,
              background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)',
              borderBottom: '0.5px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{group.date}</span>
              <button
                type="button"
                onClick={() => selectAllInDate(group.date)}
                style={{
                  border: 'none', background: 'transparent',
                  color: pink, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  padding: '4px 0',
                }}
              >
                全选
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
              padding: '0 2px 12px',
            }}>
              {group.items.map((it) => {
                if (it.kind === 'wechat') {
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      style={{
                        aspectRatio: '1', border: 'none', padding: 0, margin: 0,
                        background: '#2c2c2e', borderRadius: 2,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 6,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: 6, background: '#07c160',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, lineHeight: 1, color: '#fff', fontWeight: 500,
                      }}>微</span>
                      <span style={{ fontSize: 11, color: textSub }}>从微信导入</span>
                    </button>
                  );
                }
                const sel = isBatch ? isBatchSelected(it.id) : selectedSrc === it.src;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => (isBatch ? toggleBatch(it.id, it.src) : setSelectedSrc(it.src))}
                    style={{
                      aspectRatio: '1', padding: 0, margin: 0, border: 'none',
                      borderRadius: 2, overflow: 'hidden', position: 'relative',
                      cursor: 'pointer',
                      boxShadow: sel ? `inset 0 0 0 2px ${pink}` : 'none',
                    }}
                  >
                    <img src={it.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {it.live && (
                      <div style={{
                        position: 'absolute', bottom: 5, left: 5,
                        width: 14, height: 14, pointerEvents: 'none',
                      }}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                          <circle cx="12" cy="12" r="9" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="4" fill="#fff" fillOpacity="0.95" />
                        </svg>
                      </div>
                    )}
                    <div style={{
                      position: 'absolute', top: 5, right: 5,
                      width: 18, height: 18, borderRadius: 9,
                      border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.92)',
                      background: sel ? pink : 'rgba(0,0,0,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isBatch && sel ? 9 : 10,
                      color: '#fff', fontWeight: 500,
                      boxSizing: 'border-box',
                    }}>
                      {isBatch && sel
                        ? batchOrder.findIndex((x) => x.id === it.id) + 1
                        : (sel ? '✓' : '')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const url = URL.createObjectURL(f);
          if (isBatch) {
            const id = `upload-${Date.now()}`;
            setBatchOrder((prev) => (
              prev.length >= maxSlots ? prev : [...prev, { id, src: url }]
            ));
          } else {
            onApply?.(url);
          }
          e.target.value = '';
        }}
      />

      {/* 底部：提示 + 下一步，其下为已选照片 1 2 3… */}
      <div style={{
        flexShrink: 0,
        borderTop: '0.5px solid rgba(255,255,255,0.1)',
        background: '#0a0a0a',
        padding: isBatch ? '10px 16px 26px' : '10px 14px 26px',
      }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
        }}
        >
          {isBatch ? (
            <span style={{ fontSize: 14, color: textSub, lineHeight: 1.4 }}>
              请选择{maxSlots}张照片
            </span>
          ) : (
            <span style={{ fontSize: 13, color: selectedSrc ? text : textSub }}>
              请选择一张照片
            </span>
          )}
          <button
            type="button"
            disabled={isBatch ? !batchOk : !selectedSrc}
            onClick={() => {
              if (isBatch) {
                const ordered = batchOrder.map((x) => x.src).slice(0, maxSlots);
                onBatchApply?.(ordered);
              } else if (selectedSrc) {
                onApply?.(selectedSrc);
              }
            }}
            style={{
              flexShrink: 0,
              height: 28, padding: '0 12px', borderRadius: 6, border: 'none',
              background: (isBatch ? batchOk : !!selectedSrc) ? pink : 'rgba(255,255,255,0.14)',
              color: (isBatch ? batchOk : !!selectedSrc) ? '#fff' : 'rgba(255,255,255,0.38)',
              fontSize: 13, fontWeight: 500, letterSpacing: 0.2,
              cursor: (isBatch ? batchOk : !!selectedSrc) ? 'pointer' : 'default',
              fontVariantNumeric: 'tabular-nums',
              opacity: (isBatch ? batchOk : !!selectedSrc) ? 1 : 0.92,
            }}
          >
            {isBatch ? `下一步（${batchCount}/${maxSlots}）` : '完成'}
          </button>
        </div>

        {isBatch && batchCount > 0 && (
          <div style={{
            marginTop: 12,
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 2,
          }}
          >
            {batchOrder.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  width: 56,
                }}
              >
                <div style={{
                  position: 'relative',
                  width: 56,
                  height: 56,
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: '#2c2c2e',
                }}
                >
                  <img
                    src={item.src}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <button
                    type="button"
                    aria-label={`移除第 ${idx + 1} 张`}
                    onClick={() => removeFromBatch(item.id)}
                    style={{
                      position: 'absolute',
                      top: 3,
                      right: 3,
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      border: 'none',
                      background: 'rgba(0,0,0,0.45)',
                      color: '#fff',
                      fontSize: 11,
                      lineHeight: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
                <span style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: text,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }}
                >
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** 带「·文案」（-c）时每格多出底栏，在同比例外框内会压住照片——整体加高以保持照片可视高度 */
function layoutCaptionFrameGrow(baseW, baseH, layoutId) {
  const gridId = resolveLayoutGridId(layoutId);
  if (!gridId || !String(gridId).endsWith('-c')) {
    return { w: baseW, h: baseH };
  }
  const HK = 1.32;
  return { w: baseW, h: Math.round(baseH * HK) };
}

function LayoutPreview({
  layoutId, captionTexts = [], photos: userPhotos = [], onCellTap, onPickPhoto,
  editable = false, readOnly = false,
  /** 空格展示「轻量加号占位」且点击直接进入相册替换（不写示例图快捷填充） */
  inviteAlbumOnEmpty = false,
  /** 与 inviteAlbumOnEmpty 同用：在背后叠一层弱化示例照，弱化空版面感 */
  emptyInviteBackdropDiagram = false,
  /** 待上传格：里程碑示例图 + 文案（与「未到时间」同视觉，多 + 上传） */
  uploadMilestonePlaceholders = false,
  /** 未到时间锁定格索引（整块不可点） */
  timeLockedSlotIndices = [],
  /** 出生里程碑「期待态」格索引（整块不可点） */
  birthAnticipationSlotIndex = null,
  /** 胎宝宝 demo：未到周 / 出生格使用米色里程碑大卡（已出生链路须为 false） */
  useFetusMilestonePlaceholders = false,
  /** 已填格仍画「替换照片」角标，但整块不可交互（海报 / 示意） */
  replaceControlsDecorative = false,
  /** 从该下标起的已填照片整体变暗（0-based，null 关闭）—— 示意「占位」观感 */
  experienceDimFromIndex = null,
}) {
  const interactive = editable && !readOnly;
  const hasCaption = layoutId.endsWith('-c');
  const baseId = layoutId.replace(/-c$/, '');
  const g = 3;

  /** 三联/四联竖栏：在整列条状照片上加底栏文案（非九宫格那种格内正方形） */
  const verticalColumnCaptionLayout = baseId === 'cols4' || baseId === 'cols3';

  const lockedIdxSet = new Set(timeLockedSlotIndices);

  const cell = (idx) => {
    const captionLine = hasCaption
      ? captionTexts[idx % Math.max(captionTexts.length, 1)]
      : '';
    const userSrc = userPhotos[idx] ?? null;
    const demoSrc = PREVIEW_PHOTOS[idx % PREVIEW_PHOTOS.length];
    const lockedCopy = lockedIdxSet.has(idx) ? PREG_TIME_LOCK_COPY[idx] : undefined;
    const isBirthExpect = birthAnticipationSlotIndex === idx;

    /** 未到时间栅 / 出生期待栅：不参与正常填图逻辑（演示态） */
    if (lockedCopy || isBirthExpect) {
      const captionRaw = captionLine != null && String(captionLine).trim() !== ''
        ? String(captionLine)
        : '\u00a0';

      const fetusLuxCards = !!useFetusMilestonePlaceholders;

      const captionBarLabel = () => {
        if (isBirthExpect) {
          if (useFetusMilestonePlaceholders) return '\u2726 宝宝出生 \u2726';
          return `\u2726 ${captionRaw} \u2726`;
        }
        return captionRaw;
      };

      const captionBirthLuxury = isBirthExpect && useFetusMilestonePlaceholders;
      const captionWeekLuxury = !!lockedCopy && useFetusMilestonePlaceholders;
      const timeLockPhotoSlot = () => {
        if (!lockedCopy) return null;
        if (!fetusLuxCards) {
          return (
            <>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg,#fffafb 0%, #fff0f3 52%, #ffe8ee 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: 6,
              }}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }} aria-hidden>{lockedCopy.emoji}</span>
                <span style={{ fontSize: 9, fontWeight: 500, color: C.ink2, textAlign: 'center', lineHeight: 1.25 }}>
                  {lockedCopy.likeness}
                </span>
                <span style={{ fontSize: 8.5, color: C.mute }}>{lockedCopy.cm}</span>
              </div>
              <div style={{
                position: 'absolute', inset: 2,
                border: '1px dashed rgba(255,91,138,0.22)', borderRadius: 3, pointerEvents: 'none',
              }} />
            </>
          );
        }
        const lm = FETUS_LUXURY_MILESTONE_SLOT[idx];
        if (!lm) return null;
        return (
          <div style={{
            position: 'absolute', inset: 0,
            background: FET_ANT.bgCell,
            borderRadius: 2,
            overflow: 'hidden',
          }}
          >
            <img
              src={lm.previewSrc}
              alt=""
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                display: 'block',
                opacity: 0.32,
                filter: 'grayscale(0.42) blur(0.4px)',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(253,245,232,0.53) 0%, rgba(253,245,232,0.88) 100%)',
            }} />
            <div style={{
              position: 'absolute', inset: 0, padding: 6,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center',
            }}
            >
              <div style={{
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 12,
                color: FET_ANT.gold,
                letterSpacing: -0.4,
                lineHeight: 1,
              }}
              >
                +{lm.deltaWeeks}<span style={{ fontSize: 7.8, fontWeight: 500, marginLeft: 1 }}>周</span>
              </div>
              <div style={{
                marginTop: 5,
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: 8.2,
                fontWeight: 400,
                color: FET_ANT.ink,
                lineHeight: 1.25,
              }}
              >
                {lm.tip}
              </div>
            </div>
            <div style={{
              position: 'absolute', top: 5, right: 5,
              fontFamily: FONT_FET_MONO,
              fontSize: 7.2,
              color: FET_ANT.mute,
              letterSpacing: 0.4,
              lineHeight: 1,
            }}
            >
              {lm.date}
            </div>
          </div>
        );
      };

      const birthExpectPhotoSlot = () => {
        if (!isBirthExpect) return null;
        if (!fetusLuxCards) {
          return (
            <>
              <div style={{
                position: 'absolute', inset: 0,
                background:
                  'radial-gradient(ellipse 90% 80% at 50% 35%, rgba(255,252,246,1) 0%, rgba(255,236,220,1) 55%, rgba(245,226,208,1) 100%)',
                boxShadow: 'inset 0 0 0 1.5px rgba(212,165,116,0.45)',
              }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6, padding: 6,
              }}
              >
                <span style={{ fontSize: 15, opacity: 0.9 }} aria-hidden="true">✨</span>
                <span style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: 1,
                  color: '#8a6440',
                  textShadow: '0 1px 0 rgba(255,255,255,0.6)',
                }}
                >
                  终于见到你
                </span>
              </div>
            </>
          );
        }
        const d = FETUS_BIRTH_LUXURY.dateLine;
        const haloSrc = FETUS_BIRTH_LUXURY.haloSrc;
        return (
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: 2,
            overflow: 'hidden',
            background: FET_ANT.bgCell,
            border: `1px solid ${FET_ANT.goldGlow}`,
            boxShadow: `0 0 0 1px rgba(232,201,138,0.33)`,
          }}
          >
            <img src={haloSrc} alt="" style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: 0.28,
              filter: 'sepia(0.5) blur(0.35px)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(circle at 50% 40%, rgba(232,201,138,0.62) 0%, rgba(253,246,227,0.86) 60%, rgba(240,226,187, 0.92) 100%)`,
            }} />
            <svg viewBox="0 0 100 100" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
            }}
            preserveAspectRatio="xMidYMid slice"
            >
              <FetusAnticipSunburstRays stroke={FET_ANT.gold} />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, padding: 6,
              textAlign: 'center',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}
            >
              <FetusAnticipSparkle size={18} />
              <div style={{
                marginTop: 5,
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 10,
                color: FET_ANT.goldDeep,
                lineHeight: 1.22,
                letterSpacing: 0.75,
              }}
              >
                你出生那刻
              </div>
              <div style={{
                marginTop: 3,
                fontFamily: FONT_FET_MONO,
                fontSize: 7.5,
                color: FET_ANT.gold,
                letterSpacing: 0.6,
              }}
              >
                {d}
              </div>
            </div>
          </div>
        );
      };

      if (hasCaption && !verticalColumnCaptionLayout) {
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              minHeight: 0,
              height: '100%',
              overflow: 'hidden',
              alignItems: 'stretch',
            }}
          >
            <div style={{
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <div style={{
                width: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: '1 / 1',
                margin: '0 auto',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
                minWidth: 0,
                background: '#faf8f5',
                cursor: 'default',
                borderRadius: 2,
              }}
              >
                {lockedCopy ? timeLockPhotoSlot() : birthExpectPhotoSlot()}
              </div>
            </div>
            <div style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#fffaf6', padding: '3px 4px',
              borderTop: '0.5px solid rgba(139,115,85,0.18)',
            }}
            >
              <span style={{
                fontFamily: FONT_SERIF,
                fontStyle: captionBirthLuxury ? 'normal' : 'italic',
                fontWeight: 500,
                fontSize: captionWeekLuxury ? 11 : 10,
                color: captionBirthLuxury
                  ? FET_ANT.goldDeep
                  : (captionWeekLuxury ? FET_ANT.ink2 : (isBirthExpect ? '#9a6f3f' : '#c4a09a')),
                lineHeight: 1.25, letterSpacing: captionBirthLuxury ? 0.9 : (isBirthExpect ? 0.6 : 0.3),
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                display: captionBirthLuxury ? 'inline-flex' : undefined,
                alignItems: captionBirthLuxury ? 'center' : undefined,
                justifyContent: captionBirthLuxury ? 'center' : undefined,
                gap: captionBirthLuxury ? 4 : undefined,
              }}
              >
                {captionBirthLuxury ? (
                  <>
                    <span style={{ color: FET_ANT.goldDeep, fontSize: 9, lineHeight: 1 }} aria-hidden>{'\u2726'}</span>
                    <span>宝宝出生</span>
                    <span style={{ color: FET_ANT.goldDeep, fontSize: 9, lineHeight: 1 }} aria-hidden>{'\u2726'}</span>
                  </>
                ) : (
                  captionBarLabel()
                )}
              </span>
            </div>
          </div>
        );
      }

      /** 无时 per-cell 底栏或非方形格文案布局：仍占位，避免误判为空白格继续走填图逻辑 */
      return (
        <div
          key={idx}
          style={{
            overflow: 'hidden', background: '#faf8f5',
            minWidth: 0, minHeight: 0, position: 'relative',
            cursor: 'default',
          }}
        >
          {lockedCopy ? timeLockPhotoSlot() : birthExpectPhotoSlot()}
        </div>
      );
    }

    const src = editable ? userSrc : (userSrc ?? demoSrc);
    const filled = src !== null;

    /** 已填 / 或「邀约留白格」—— 整块点进相册；否则空格点一下用示例图快捷填充 */
    const tapEditablePhotoSlot = interactive
      ? () => {
          if (filled || inviteAlbumOnEmpty) onPickPhoto?.(idx);
          else onCellTap?.(idx, demoSrc);
        }
      : undefined;

    /** 待上传：仅底图示意 + 居中「+」，格内不叠里程碑小字 */
    const uploadMilestoneEmptyInner = () => {
      const meta = uploadMilestoneMeta(idx);
      const bgSrc = meta?.type === 'birth'
        ? meta.haloSrc
        : (meta?.previewSrc || demoSrc);

      return (
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: 2, overflow: 'hidden',
          background: FET_ANT.bgCell,
        }}
        >
          <img
            src={bgSrc}
            alt=""
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: 0.46,
              filter: 'grayscale(0.18) blur(0.35px)',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background:
              'linear-gradient(180deg, rgba(255,252,249,0.62) 0%, rgba(255,248,244,0.78) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          >
            <UploadPlusBadge />
          </div>
        </div>
      );
    };

    // ── 空格：点任意区域 = 快速用示例图 或 「+」进相册 ────────────────
    const emptyInner = () => (
      <>
        {inviteAlbumOnEmpty && uploadMilestonePlaceholders ? (
          uploadMilestoneEmptyInner()
        ) : inviteAlbumOnEmpty ? (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: emptyInviteBackdropDiagram ? 'transparent' : '#faf8f5',
          }}
          >
            {emptyInviteBackdropDiagram && (
              <>
                <img src={demoSrc} alt="" style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block', opacity: 0.26,
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,248,244,0.78)' }} />
              </>
            )}
            <UploadPlusBadge />
          </div>
        ) : (
          <>
            <img src={demoSrc} alt="" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', display: 'block', opacity: 0.32,
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,248,244,0.60)' }} />
          </>
        )}
        <div style={{
          position: 'absolute', inset: 2,
          border: `1px dashed ${C.pinkSoft}`, borderRadius: 3, pointerEvents: 'none',
        }} />
        {interactive && !inviteAlbumOnEmpty && (
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
        )}
      </>
    );

    const dimPhoto = experienceDimFromIndex != null && idx >= experienceDimFromIndex;

    /** 已填格子：照片全展示 + 「替换照片」小按钮 ─────────────────── */
    const filledInner = () => (
      <>
        <img src={src} alt="" style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          opacity: dimPhoto ? 0.5 : 1,
        }} />
        {dimPhoto && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(250,246,242,0.28)', pointerEvents: 'none',
          }} />
        )}
        {(interactive || replaceControlsDecorative) && (
          <>
            {!hasCaption && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 32, pointerEvents: 'none',
                background: 'linear-gradient(to top, rgba(15,6,10,0.55) 0%, transparent 100%)',
              }} />
            )}
            <button
              type="button"
              tabIndex={replaceControlsDecorative ? -1 : 0}
              onClick={(e) => {
                if (replaceControlsDecorative) { e.preventDefault(); e.stopPropagation(); }
                else { e.stopPropagation(); onPickPhoto?.(idx); }
              }}
              style={{
                position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)',
                padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
                background: hasCaption ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.22)',
                border: hasCaption ? '0.5px solid rgba(0,0,0,0.10)' : '0.5px solid rgba(255,255,255,0.50)',
                fontSize: 8.5, color: hasCaption ? C.ink2 : '#fff', cursor: replaceControlsDecorative ? 'default' : 'pointer',
                boxShadow: hasCaption ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                pointerEvents: replaceControlsDecorative ? 'none' : 'auto',
              }}>替换照片</button>
          </>
        )}
      </>
    );

    // ── 「·文案」：竖栏三联/四联 = 满列照片条 + 底栏；其余 = 正方形图区 + 底栏 ──
    if (hasCaption) {
      const text = captionLine != null && String(captionLine).trim() !== ''
        ? String(captionLine)
        : '\u00a0';
      return (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: 0,
            height: '100%',
            overflow: 'hidden',
            alignItems: 'stretch',
          }}
        >
          {verticalColumnCaptionLayout ? (
            /* cols3-c / cols4-c：与同底无文案竖栏一致，整块为图区，仅底部加文案条 */
            <div
              onClick={tapEditablePhotoSlot}
              style={{
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: filled ? '#000' : '#faf8f5',
                cursor: interactive ? 'pointer' : 'default',
              }}
            >
              {filled ? filledInner() : emptyInner()}
            </div>
          ) : (
            /* 上：min(宽, 图区高) 的正方形，横向纵向都居中 */
            <div
              style={{
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                onClick={tapEditablePhotoSlot}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  aspectRatio: '1 / 1',
                  margin: '0 auto',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0,
                  minWidth: 0,
                  background: filled ? '#f5f5f5' : '#faf8f5',
                  cursor: interactive ? 'pointer' : 'default',
                  borderRadius: 2,
                }}
              >
                {filled ? filledInner() : emptyInner()}
              </div>
            </div>
          )}
          <div style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#fffaf6', padding: '3px 4px',
            borderTop: '0.5px solid rgba(139,115,85,0.18)',
          }}>
            <span style={{
              fontFamily: FONT_SERIF,
              fontStyle: 'italic',
              fontWeight: filled ? 700 : 500,
              fontSize: 10,
              color: filled ? C.ink : C.ink2,
              lineHeight: 1.25,
              letterSpacing: 0.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            >
              {text}
            </span>
          </div>
        </div>
      );
    }

    // ── 标准格子（无 per-cell 文案条）──────────────────────────────
    return (
      <div
        key={idx}
        onClick={tapEditablePhotoSlot}
        style={{
          overflow: 'hidden', background: filled ? '#000' : '#e8ddd5',
          minWidth: 0, minHeight: 0, position: 'relative',
          cursor: interactive ? 'pointer' : 'default',
        }}
      >
        {filled ? filledInner() : (editable ? emptyInner() : null)}
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

// ── 模板选择页 ────────────────────────────────────────────────
function LayoutPickerPage({
  onBack,
  onConfirm,
  bootstrap = null,
  onOpenWorks = null,
  entry = null,
  pushTweak = 'upload',
  onPushTweakChange = null,
  closeOnBack = false,
}) {
  const [tab, setTab] = useState('孕期时光');
  const [activeId, setActiveId] = useState('3x3-warm-c');

  const layouts = GRID_LAYOUTS;
  const tabs = ['孕期时光', '宝宝成长'];
  const filtered = layouts.filter((l) => l.theme === tab);
  const current = layouts.find((l) => l.id === activeId && l.theme === tab)
    || filtered[0]
    || layouts[0];
  const gridLayoutId = resolveLayoutGridId(current.id);
  const paperStyle = PAPER_STYLES[current.paperId] || PAPER_STYLES.warm;
  const frameStyle = paperFrameBoxStyle(current.paperId);

  const [cellPhotos, setCellPhotos] = useState({});
  /** layout：选模板；album：全屏多选照片；edit：替换照片 / 补格 */
  const [viewMode, setViewMode] = useState('layout');
  const [pickerCell, setPickerCell] = useState(null); // null | idx — 单格替换
  const puzzleSectionRef = useRef(null);
  const [finishedPreviewOpen, setFinishedPreviewOpen] = useState(false);

  /** 美柚入口2 · 前两格已填示例，其余「＋」+ 弱兜底图 + 顶部引导 */
  const isBornEmptyDemo = bootstrap === 'demo-born-empty';
  const isBornCompleteDemo = bootstrap === 'demo-born-complete';
  const isPartialMemorialDemo =
    bootstrap === 'demo-born-progress' || bootstrap === 'demo-fetus-progress';
  const useFetusLuxuryLocks = bootstrap === 'demo-fetus-progress';
  const isPushEntry = entry === 'push';
  const useTimelineHeader = useFetusLuxuryLocks && !isPushEntry;

  React.useEffect(() => {
    setPickerCell(null);

    if (bootstrap === 'demo-born-empty') {
      const fill = {};
      fill[0] = PREVIEW_PHOTOS[0];
      fill[1] = PREVIEW_PHOTOS[1];
      setTab('孕期时光');
      setActiveId('3x3-warm-c');
      setCellPhotos(fill);
      setViewMode('edit');
      return;
    }

    if (bootstrap === 'demo-born-progress' || bootstrap === 'demo-fetus-progress') {
      const fill = {};
      for (let i = 0; i < 6; i += 1) {
        fill[i] = PREVIEW_PHOTOS[i % PREVIEW_PHOTOS.length];
      }
      setTab('孕期时光');
      setActiveId('3x3-warm-c');
      setCellPhotos(fill);
      setViewMode('edit');
      return;
    }

    if (bootstrap === 'demo-born-complete') {
      const fill = {};
      for (let i = 0; i < 9; i += 1) {
        fill[i] = PREVIEW_PHOTOS[i % PREVIEW_PHOTOS.length];
      }
      setTab('孕期时光');
      setActiveId('3x3-warm-c');
      setCellPhotos(fill);
      setViewMode('edit');
    }
  }, [bootstrap]);

  const openAlbumPicker = () => {
    setPickerCell(null);
    setViewMode('album');
  };

  const handleTabChange = (t) => {
    setTab(t);
    const inTab = layouts.filter((l) => l.theme === t);
    const keep = inTab.find((l) => l.id === activeId);
    if (!keep && inTab[0]) setActiveId(inTab[0].id);
    setViewMode('layout');
    setCellPhotos({});
  };

  const previewPhotos = Array.from({ length: 9 }, (_, i) => cellPhotos[i] ?? null);

  /** 替换照片页 · 须全部填满的格（demo 入口3 的后三格为时间锁占位，不计入） */
  const editRequiredSlotIndices = Array.from({ length: current.cells }, (_, i) => i)
    .filter((i) => !(isPartialMemorialDemo && i >= 6));
  const editAllRequiredFilled = editRequiredSlotIndices.every(
    (i) => cellPhotos[i] != null && cellPhotos[i] !== '',
  );

  const handleConfirm = () => {
    if (!editAllRequiredFilled || useFetusLuxuryLocks) return;
    onConfirm({
      layoutId: current.id,
      layoutName: current.name,
      themeTab: tab,
      cellPhotos: { ...cellPhotos },
      ratio: current.ratio,
    });
  };

  // 点击格子填充照片
  // sugSrc 有值 → 直接用这张（用户点击兜底照片）
  // sugSrc 为 null → 循环下一张（点击"换图"）
  // idx 有值但 sugSrc 为 undefined → 已填格子点击，循环下一张
  const replaceCell = (idx, sugSrc) => {
    if (isPartialMemorialDemo && idx >= 6) return;
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

  // 切换模板 / tab：回到选模板并清空已选照片
  const handleLayoutSelect = (id) => {
    setActiveId(id);
    setViewMode('layout');
    setCellPhotos({});
  };

  /** 入口3 · 顶部缩略九宫与进度数字（前两行与用户填格对齐） */
  const progressMiniSixSources = Array.from({ length: 6 }, (_, i) => (
    cellPhotos[i] ?? PREVIEW_PHOTOS[i % PREVIEW_PHOTOS.length]
  ));
  const progressEditableFilledCount = [0, 1, 2, 3, 4, 5].reduce(
    (n, i) => (cellPhotos[i] ? n + 1 : n),
    0,
  );

  const emptyDemoFilledCount = Array.from({ length: current.cells }, (_, i) => i).reduce(
    (n, i) => (cellPhotos[i] ? n + 1 : n),
    0,
  );
  const showProgressRing = isPartialMemorialDemo || isBornEmptyDemo || isBornCompleteDemo;
  const ringCollected = isBornEmptyDemo
    ? emptyDemoFilledCount
    : isBornCompleteDemo
      ? 9
      : progressEditableFilledCount;
  const ringPct = Math.min(100, Math.round((ringCollected / 9) * 100));
  const ringNineSlots = (isBornEmptyDemo || isBornCompleteDemo)
    ? Array.from({ length: 9 }, (_, i) => cellPhotos[i] ?? null)
    : null;

  const dimMap = {
    '1:1': { w: 240, h: 240 },
    '3:4': { w: 196, h: 261 },
    '4:3': { w: 261, h: 196 },
    '2:3': { w: 185, h: 277 },
    '3:2': { w: 277, h: 185 },
  };
  const baseDim = dimMap[current.ratio] || { w: 240, h: 240 };
  const dim = layoutCaptionFrameGrow(baseDim.w, baseDim.h, current.id);

  const isEdit = viewMode === 'edit';
  const isAlbum = viewMode === 'album';
  const captions = captionsForTheme(tab, current.cells);

  /** 胎宝宝等待解锁页：后三格不可填，底部「完成」始终不可点 */
  const editCtaDisabled = isEdit && (!editAllRequiredFilled || useFetusLuxuryLocks);

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
          onClick={isEdit ? (isPushEntry || closeOnBack ? onBack : () => setViewMode('layout')) : onBack}
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
          {isEdit ? '替换照片' : '选择模板'}
        </div>

        {/* 右：编辑态 · 作品合集（四宫格 icon） */}
        {isEdit && onOpenWorks ? (
          <WorksIcon onClick={onOpenWorks} ariaLabel="作品合集" />
        ) : (
          <div style={{ width: 36 }} />
        )}
      </div>

      {/* ══ LAYOUT 模式：小预览卡片 ══ */}
      {!isEdit && (
        <div style={{
          flex: 1, minHeight: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${C.blush} 0%, ${C.cream} 60%, ${C.paper} 100%)`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 0 8px',
        }}>
          {/* 模板卡片 — 精致边框，点击整体进入编辑 */}
          <div
            key={current.id}
            onClick={openAlbumPicker}
            style={{
              width: dim.w, height: dim.h, borderRadius: 4, overflow: 'hidden',
              ...frameStyle,
              transition: 'width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1)',
              cursor: 'pointer',
            }}>
            <LayoutPreview
              layoutId={gridLayoutId}
              captionTexts={captions}
              photos={previewPhotos}
              onCellTap={openAlbumPicker}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{current.name}</div>
            <div style={{ fontSize: 11, color: C.mute, marginTop: 2 }}>
              {current.gridKind} · {paperStyle.tagline}
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT 模式：保持模板形状 + 精致边框 + 宝宝信息 ══ */}
      {isEdit && (
        <div
          style={{
            flex: 1, minHeight: 0, overflowY: 'auto',
            background: `radial-gradient(ellipse at 50% 0%, ${C.blush} 0%, ${C.cream} 60%, ${C.paper} 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: '14px 14px 10px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setViewMode('layout'); }}
        >
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            {isPushEntry && isEdit && onPushTweakChange && (
              <PushTweakBar value={pushTweak} onChange={onPushTweakChange} />
            )}
            {showProgressRing && (
              <div
                style={{
                  width: '100%',
                  flexShrink: 0,
                  borderRadius: 12,
                  background: ringPct >= 100 ? 'transparent' : '#fff',
                  border: ringPct >= 100
                    ? '0.5px solid rgba(255,77,136,0.18)'
                    : '0.5px solid rgba(139,115,85,0.12)',
                  boxShadow: ringPct >= 100
                    ? '0 6px 24px rgba(255,77,136,0.1)'
                    : '0 4px 18px rgba(80,35,48,0.08)',
                  marginBottom: 12,
                  overflow: 'hidden',
                }}
              >
                {useTimelineHeader ? (
                  <FetusPregnancyTimelineHeader
                    collected={ringCollected}
                    total={9}
                    onPreviewTap={(e) => {
                      e.stopPropagation();
                      setFinishedPreviewOpen(true);
                    }}
                  />
                ) : (
                  <MemorialStoryRingHeader
                    pct={ringPct}
                    total={9}
                    collected={ringCollected}
                    babyName="豆豆"
                    firstSixSrc={isBornEmptyDemo ? undefined : progressMiniSixSources}
                    fetusNineMiniLuxury={useFetusLuxuryLocks}
                    nineSlots={ringNineSlots}
                    onPreviewTap={(e) => {
                      e.stopPropagation();
                      setFinishedPreviewOpen(true);
                    }}
                  />
                )}
              </div>
            )}

            {/* 精致边框卡片 · 九宫格拼图 */}
          <div
            ref={puzzleSectionRef}
            style={{
            width: '100%', flexShrink: 0,
            borderRadius: 4,
            ...frameStyle,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            {/* 照片网格 */}
            <div style={{ aspectRatio: `${dim.w}/${dim.h}`, width: '100%' }}>
              <LayoutPreview
                layoutId={gridLayoutId}
                captionTexts={captions}
                photos={previewPhotos}
              onCellTap={(idx, src) => replaceCell(idx, src)}
              onPickPhoto={(idx) => setPickerCell(idx)}
              editable
              inviteAlbumOnEmpty={isBornEmptyDemo}
              emptyInviteBackdropDiagram={isBornEmptyDemo}
              uploadMilestonePlaceholders={isBornEmptyDemo}
              timeLockedSlotIndices={isPartialMemorialDemo ? [6, 7] : []}
              birthAnticipationSlotIndex={isPartialMemorialDemo ? 8 : null}
              useFetusMilestonePlaceholders={useFetusLuxuryLocks}
              />
            </div>

            {/* 宝宝信息 */}
            <div style={{
              padding: '12px 16px 14px', textAlign: 'center',
              borderTop: `1px solid ${paperStyle.innerLine}`,
              background: paperStyle.footerBg,
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
        </div>
      )}

      {/* ── 分割线（layout 模式才显示）── */}
      {!isEdit && <div style={{ height: 0.5, background: C.line, flexShrink: 0 }} />}

      {/* ── 主题 tabs + 缩略图（layout 模式显示，edit 模式收起）── */}
      <div style={{
        overflow: 'hidden', flexShrink: 0,
        maxHeight: isEdit ? 0 : 248,
        opacity: isEdit ? 0 : 1,
        transition: 'max-height 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s',
      }}>
        <div style={{ display: 'flex', borderBottom: `0.5px solid ${C.line}` }}>
          {tabs.map((t) => (
            <button key={t} type="button" onClick={() => handleTabChange(t)} style={{
              flex: 1, padding: '10px 2px 9px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 12, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? C.pink : C.ink2,
              borderBottom: tab === t ? `2px solid ${C.pink}` : '2px solid transparent',
              marginBottom: -0.5, whiteSpace: 'nowrap',
              fontFamily: FONT_SANS,
            }}>{t}</button>
          ))}
        </div>
        <div style={{
          padding: '10px 14px 8px',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8,
        }}>
          {filtered.map((l, i) => {
            const active = l.id === activeId && l.theme === tab;
            const thumbPaper = PAPER_STYLES[l.paperId] || PAPER_STYLES.warm;
            return (
              <div key={`${l.theme}-${l.id}-${i}`} onClick={() => handleLayoutSelect(l.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', position: 'relative' }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 8,
                  border: active ? `2px solid ${C.pink}` : `1px solid ${thumbPaper.border}`,
                  background: active ? '#fff5f7' : thumbPaper.thumbBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active ? `0 0 0 2px ${C.pinkSoft}` : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  position: 'relative',
                }}>
                  <LayoutGlyph kind={resolveLayoutGridId(l.id)} active={active} />
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
          type="button"
          disabled={editCtaDisabled}
          onClick={isEdit ? handleConfirm : openAlbumPicker}
          style={{
            width: '100%', height: 50, borderRadius: 26, border: 0,
            background: `linear-gradient(135deg, #ff6e9c 0%, ${C.pink} 100%)`,
            color: '#fff', fontSize: 16, fontWeight: 500,
            letterSpacing: 1,
            cursor: editCtaDisabled ? 'not-allowed' : 'pointer',
            opacity: editCtaDisabled ? 0.5 : 1,
            boxShadow: editCtaDisabled
              ? 'none'
              : '0 8px 18px -6px rgba(255,91,138,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {isEdit ? '完成，生成纪念拼图' : '下一步'}
        </button>
      </div>

      {/* ── 全屏相册：先多选照片，再进入替换照片页 ── */}
      {isAlbum && (
        <AlbumPhotoPickerOverlay
          key={[`batch`, current.theme, current.id, current.cells].join('-')}
          mode="batch"
          maxSlots={current.cells}
          onClose={() => setViewMode('layout')}
          onBatchApply={(ordered) => {
            const next = {};
            ordered.forEach((src, i) => {
              if (i < current.cells) next[i] = src;
            });
            setCellPhotos(next);
            setViewMode('edit');
          }}
        />
      )}

      {/* ── 全屏相册：替换某一格 ── */}
      {pickerCell !== null && (
        <AlbumPhotoPickerOverlay
          key={pickerCell}
          mode="single"
          initialSrc={
            cellPhotos[pickerCell] ?? PREVIEW_PHOTOS[pickerCell % PREVIEW_PHOTOS.length]
          }
          onClose={() => setPickerCell(null)}
          onApply={(src) => {
            setCellPhotos((prev) => ({ ...prev, [pickerCell]: src }));
            setPickerCell(null);
          }}
        />
      )}

      {finishedPreviewOpen && (
        <FinishedProductPreviewOverlay onClose={() => setFinishedPreviewOpen(false)} />
      )}
    </div>
  );
}

// ── 首页 ──────────────────────────────────────────────────────
function PuzzlePage({ onGenerate, onWorks, onNavigateBack }) {
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
        style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 28 }}>

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
              位妈妈已经为宝宝生成了纪念九宫格
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
            <HeroPreview idx={previewIdx} setIdx={setPreviewIdx} />
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
            }}>豆豆的专属纪念九宫格已经准备好了</div>
            <div style={{ fontSize: 12, color: C.ink2, marginTop: 4 }}>
              一份有意义的礼物，送给宝宝也送给自己
            </div>

            <div style={{
              marginTop: 14,
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              columnGap: 14,
            }}>
              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="2" width="5" height="5" rx="0.8" stroke={C.pink} strokeWidth="1.4"/>
                      <rect x="9" y="2" width="5" height="5" rx="0.8" stroke={C.pink} strokeWidth="1.4"/>
                      <rect x="2" y="9" width="5" height="5" rx="0.8" stroke={C.pink} strokeWidth="1.4"/>
                      <rect x="9" y="9" width="5" height="5" rx="0.8" stroke={C.pink} strokeWidth="1.4"/>
                    </svg>
                  ),
                  k: '10+ 模板', v: '一键换风格',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="6" width="10" height="6" rx="1" stroke={C.pink} strokeWidth="1.4"/>
                      <path d="M4.5 6V2.5H11.5V6" stroke={C.pink} strokeWidth="1.4" strokeLinejoin="round"/>
                      <rect x="5" y="9" width="6" height="4.5" stroke={C.pink} strokeWidth="1.4" fill="#fff"/>
                    </svg>
                  ),
                  k: '支持冲印', v: '可印成实体相框',
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

          {/* 主 CTA · 紧跟卖点卡片，避免贴底留白 */}
          <div style={{ padding: '20px 0 8px' }}>
            <button
              type="button"
              onClick={onGenerate}
              style={{
                width: '100%', height: 52, borderRadius: 26, border: 0,
                background: `linear-gradient(135deg, #ff6e9c 0%, ${C.pink} 100%)`,
                color: '#fff', fontSize: 16, fontWeight: 700,
                letterSpacing: 1, cursor: 'pointer',
                boxShadow: '0 8px 18px -6px rgba(255,91,138,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              给豆豆做同款
            </button>
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
        <button type="button" aria-label="返回" onClick={onNavigateBack} style={{
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
        <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>制作宝宝九宫格</div>
        <WorksIcon onClick={onWorks} />
      </div>

    </div>
  );
}

// ── 撒花动效 CSS ──────────────────────────────────────────────
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
}
@keyframes sheetUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}`;

// ── 我的作品图标（复用于首页和完成页）──────────────────────────
function WorksIcon({ onClick, ariaLabel = '我的作品' }) {
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} style={{
      width: 36, height: 36, border: 0, background: 'transparent',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/>
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/>
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/>
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>
      </svg>
    </button>
  );
}

// ── 分享浮窗（底部上滑）─────────────────────────────────────────
const SHARE_APPS = [
  { name: '微信好友', bg: '#07C160', icon: '💬' },
  { name: '朋友圈',  bg: '#FA8919', icon: '⊙' },
  { name: '抖音',    bg: '#000',    icon: '♪' },
  { name: '小红书',  bg: '#FE2C55', icon: '✦' },
];

function ShareSheet({ onClose }) {
  return (
    <>
      {/* 遮罩 */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: 'rgba(20,8,12,0.40)',
      }} />
      {/* Sheet 主体 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 201,
        background: '#fff', borderRadius: '16px 16px 0 0',
        padding: '0 20px 36px',
        boxShadow: '0 -4px 24px rgba(80,30,40,0.12)',
        animation: 'sheetUp 0.32s cubic-bezier(.4,0,.2,1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.line }} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, textAlign: 'center', padding: '8px 0 18px', color: C.ink }}>
          分享纪念拼图
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
          {SHARE_APPS.map((app) => (
            <div key={app.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 28, background: app.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, color: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}>{app.icon}</div>
              <div style={{ fontSize: 11, color: C.ink2 }}>{app.name}</div>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{
          width: '100%', height: 44, borderRadius: 12, border: 0,
          background: C.cream, color: C.ink2, fontSize: 15, cursor: 'pointer',
        }}>取消</button>
      </div>
    </>
  );
}

// ── 完成页：与编辑页同一套模板 & 照片 ─────────────────────────────
function CompletionPage({ card, onClose, onMakeAnother, onWorks }) {
  const [shareOpen, setShareOpen] = useState(false);

  const doneCellCount = resolveLayoutGridId(card.layoutId).startsWith('2x2') ? 4 : 9;
  const captions = captionsForTheme(card.themeTab, doneCellCount);
  const doneGridLayoutId = resolveLayoutGridId(card.layoutId);
  const donePaperStyle = PAPER_STYLES[resolvePaperId(card.layoutId)] || PAPER_STYLES.warm;
  const doneFrameStyle = paperFrameBoxStyle(resolvePaperId(card.layoutId));
  const previewPhotos = Array.from({ length: 9 }, (_, i) => card.cellPhotos[i] ?? null);

  const dimMapDone = {
    '1:1': { w: 240, h: 240 },
    '3:4': { w: 196, h: 261 },
    '4:3': { w: 261, h: 196 },
    '2:3': { w: 185, h: 277 },
    '3:2': { w: 277, h: 185 },
  };
  const baseDimDone = dimMapDone[card.ratio] || { w: 240, h: 240 };
  const dim = layoutCaptionFrameGrow(baseDimDone.w, baseDimDone.h, card.layoutId);

  React.useEffect(() => {
    const id = 'confetti-keyframes';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id; el.textContent = CONFETTI_STYLE;
      document.head.appendChild(el);
    }
  }, []);

  const pieces = React.useMemo(() => {
    const colors = ['#ff5b8a','#ffd27a','#a8d8ea','#c9b8ff','#ffb3c8','#7ed8b4','#ff9e6e','#b8d4ff'];
    return Array.from({ length: 30 }, (_, i) => ({
      left:  `${(i * 37 + 3) % 100}%`,
      w:     [6, 8, 10, 5, 9][i % 5],
      h:     [14, 8, 18, 10, 6][i % 5],
      bg:    colors[i % colors.length],
      dur:   `${3.2 + (i % 7) * 0.5}s`,
      delay: `${(i % 9) * 0.25}s`,
      sway:  `${1.8 + (i % 4) * 0.6}s`,
      radius: i % 3 === 0 ? '50%' : '2px',
    }));
  }, []);

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #fff5f8 0%, #fffaf6 55%, #fff 100%)',
      fontFamily: FONT_SANS, color: C.ink,
    }}>
      {/* 撒花 */}
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.left, top: 0,
          width: p.w, height: p.h, borderRadius: p.radius,
          background: p.bg, opacity: 0.82,
          animation: `confettiFall ${p.dur} ${p.delay} ease-in infinite, confettiSway ${p.sway} ${p.delay} ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 50,
        }} />
      ))}

      {/* 可滚动内容 */}
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingBottom: 36,
      }}>
        {/* 顶部导航：关闭 + 我的作品 */}
        <div style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '52px 14px 0', position: 'sticky', top: 0, zIndex: 60,
        }}>
          <button onClick={onClose} style={{
            width: 36, height: 36, border: 0, background: 'transparent',
            cursor: 'pointer', fontSize: 20, color: C.ink2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
          <WorksIcon onClick={onWorks} />
        </div>

        {/* 标题 */}
        <div style={{ marginTop: 16, textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 700, color: C.ink, letterSpacing: 1 }}>
            纪念拼图已保存
          </div>
          <div style={{ fontSize: 12, color: C.mute, marginTop: 6 }}>已自动保存至时间轴</div>
        </div>

        {/* 纪念拼图预览（与「替换照片」页同一 LayoutPreview 数据） */}
        <div style={{
          marginTop: 20, width: '100%', padding: '0 14px', boxSizing: 'border-box',
          position: 'relative', zIndex: 10,
        }}>
          <div style={{
            width: '100%', maxWidth: 304, margin: '0 auto',
            borderRadius: 4,
            ...doneFrameStyle,
            overflow: 'hidden',
          }}>
            <div style={{ aspectRatio: `${dim.w}/${dim.h}`, width: '100%' }}>
              <LayoutPreview
                layoutId={doneGridLayoutId}
                captionTexts={captions}
                photos={previewPhotos}
                editable
                readOnly
              />
            </div>
            <div style={{
              padding: '10px 14px 12px', textAlign: 'center',
              borderTop: `0.5px solid ${donePaperStyle.innerLine}`,
              background: donePaperStyle.footerBg,
              position: 'relative',
            }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 700, letterSpacing: 5, color: '#2a1f0a' }}>豆 豆</div>
              <div style={{ fontSize: 8.5, color: '#8b7355', marginTop: 4, letterSpacing: 0.5 }}>
                BIRTHDAY · 2026.06.28 · WEIGHT · 3200G · HEIGHT · 50CM
              </div>
              <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 8, color: C.pink, opacity: 0.65, fontWeight: 600, letterSpacing: 0.5 }}>美柚</div>
            </div>
          </div>
        </div>

        {/* 按钮区 */}
        <div style={{ marginTop: 22, width: '100%', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 10 }}>
          {/* 主按钮：再做一张 */}
          <button onClick={onMakeAnother ?? onClose} style={{
            width: '100%', height: 50, borderRadius: 26, border: 0,
            background: `linear-gradient(135deg, #ff6e9c 0%, ${C.pink} 100%)`,
            color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', letterSpacing: 1,
            boxShadow: '0 8px 18px -6px rgba(255,91,138,0.5)',
          }}>再做一张</button>
          {/* 副按钮：保存并分享 */}
          <button onClick={() => setShareOpen(true)} style={{
            width: '100%', height: 50, borderRadius: 26, border: `1.5px solid ${C.pinkSoft}`,
            background: '#fff', color: C.pink, fontSize: 16, fontWeight: 600,
            cursor: 'pointer', letterSpacing: 0.5,
          }}>保存并分享</button>
        </div>
      </div>

      {/* 分享浮窗 */}
      {shareOpen && <ShareSheet onClose={() => setShareOpen(false)} />}
    </div>
  );
}

// ── 我的作品页 ───────────────────────────────────────────────────
const INITIAL_WORKS = [
  { id: 1, name: '九格 · 暖棕经典·文案', date: '2026.05.18', layoutId: '3x3-warm-c', photos: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 2, name: '四格 · 粉柔暖阳', date: '2026.05.15', layoutId: '2x2-blush', photos: [1, 2, 3, 4] },
  { id: 3, name: '九格 · 清新成长·文案', date: '2026.05.10', layoutId: '3x3-sage-c', photos: [3, 4, 5, 0, 1, 6, 2, 7, 1] },
];

function formatWorkDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function WorksPage({ works, onBack }) {
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden', position: 'relative',
      background: C.paper, fontFamily: FONT_SANS, color: C.ink,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* 导航 */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '52px 16px 12px', flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, border: 0, background: 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M8.5 1L1.5 8L8.5 15" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontSize: 17, fontWeight: 600, marginLeft: 8 }}>我的作品</div>
      </div>

      {/* 作品列表 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 32px' }}>
        {works.map((work, index) => {
          const isPrint = index === 0;
          const isFour = String(work.layoutId || '').startsWith('2x2');
          const cellCount = isFour ? 4 : 9;
          const thumbSlots = work.cellPhotos
            ? Array.from({ length: cellCount }, (_, i) => work.cellPhotos[i] ?? null)
            : (work.photos || []).slice(0, cellCount).map(
              (pi) => PREVIEW_PHOTOS[pi % PREVIEW_PHOTOS.length],
            );
          const paperId = resolvePaperId(work.layoutId);
          const thumbPaper = PAPER_STYLES[paperId] || PAPER_STYLES.warm;
          return (
          <div key={work.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 0', borderBottom: `0.5px solid ${C.line}`,
          }}>
            {/* 缩略图 */}
            <div style={{
              width: 72, height: 72, flexShrink: 0,
              border: `1px solid ${thumbPaper.border}`, borderRadius: 4, overflow: 'hidden',
              boxShadow: 'inset 0 0 0 2px #fff, inset 0 0 0 2.5px rgba(139,115,85,0.2)',
              background: thumbPaper.frameBg,
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${isFour ? 2 : 3}, 1fr)`,
                gap: 1,
                padding: 1,
                height: '100%',
              }}
              >
                {thumbSlots.map((src, i) => (
                  <div key={i} style={{ overflow: 'hidden', background: '#ddd6cf' }}>
                    {src ? (
                      <img src={src} alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            {/* 信息 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 14, fontWeight: 500, color: C.ink,
                lineHeight: 1.35,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              >
                {work.name}
              </div>
              <div style={{ fontSize: 11, color: C.mute, marginTop: 4 }}>{work.date}</div>
            </div>
            <button
              type="button"
              style={{
                flexShrink: 0, height: 32, padding: '0 14px', borderRadius: 16,
                border: isPrint ? 0 : `1px solid rgba(79,124,174,0.45)`,
                background: isPrint ? C.pink : '#f2f6fa',
                color: isPrint ? '#fff' : '#4f7cae',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {isPrint ? '立即印制' : '立即查看'}
            </button>
          </div>
          );
        })}
        {works.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 80, color: C.mute, fontSize: 14 }}>
            暂无作品，快去做一张吧 ✨
          </div>
        )}
      </div>
    </div>
  );
}

// ── 主应用（iOS 设备框架包裹）────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('meiyou');
  const [savedCard, setSavedCard] = useState(null);
  const [works, setWorks] = useState(INITIAL_WORKS);
  /** 纪念拼图返回时要去往的上一页（首页引导 / 个人中心等） */
  const [homeReturnScreen, setHomeReturnScreen] = useState('meiyou');
  /** 个人中心：已出生(`baby`) / 胎宝宝(`fetus`) 两套界面 */
  const [babyProfileVariant, setBabyProfileVariant] = useState(/** @type {'baby' | 'fetus'} */ ('baby'));
  /** 作品合集返回页 */
  const [worksBackScreen, setWorksBackScreen] = useState(/** @type {'home' | 'layout'} */ ('home'));

  /** key 递增以强制重装模板页；bootstrap 参见 LayoutPickerPage */
  const [layoutSession, setLayoutSession] = useState(() => ({
    key: 0,
    /** @type {null | 'demo-born-empty' | 'demo-born-progress' | 'demo-fetus-progress' | 'demo-born-complete'} */
    bootstrap: null,
    /** @type {null | 'push' | 'tool'} */
    entry: null,
    /** @type {'upload' | 'locked' | 'completed'} */
    pushTweak: 'upload',
    pushCloseOnBack: false,
    backTarget: /** @type {'home' | 'meiyou'} */ ('home'),
  }));

  const goToLayoutPicker = (opts = {}) => {
    setLayoutSession((prev) => ({
      key: prev.key + 1,
      bootstrap: opts.bootstrap ?? null,
      entry: opts.entry ?? null,
      pushTweak: opts.pushTweak ?? 'upload',
      pushCloseOnBack: opts.pushCloseOnBack ?? false,
      backTarget: opts.backTarget ?? 'home',
    }));
    setScreen('layout');
  };

  /** 推送落地：圆环进度页 + tweaks（待上传 / 未到时间 / 已完成） */
  const goToPushLayout = (tweak = 'upload') => {
    setHomeReturnScreen('meiyou');
    goToLayoutPicker({
      backTarget: 'meiyou',
      bootstrap: pushBootstrapForTweak(tweak),
      entry: 'push',
      pushTweak: tweak,
    });
  };

  /** 引导条 / 引导图 · 查看已完成九宫格，返回即关闭 */
  const goToPushGuideView = () => {
    setHomeReturnScreen('meiyou');
    goToLayoutPicker({
      backTarget: 'meiyou',
      bootstrap: 'demo-born-complete',
      entry: 'push',
      pushTweak: 'completed',
      pushCloseOnBack: true,
    });
  };

  const handlePushTweakChange = (tweak) => {
    setLayoutSession((prev) => ({
      ...prev,
      key: prev.key + 1,
      bootstrap: pushBootstrapForTweak(tweak),
      pushTweak: tweak,
      entry: 'push',
      pushCloseOnBack: false,
    }));
  };

  /** 着陆页「纪念拼图」活动承接（仍为 Puzzle 首页） */
  const openGrowthCardFrom = (fromScreen) => {
    setHomeReturnScreen(fromScreen);
    setScreen('home');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, #f3eee6 0%, #e7ddd1 100%)',
      padding: '32px 16px',
    }}>
      <IOSDevice width={402} height={874}>
        {screen === 'home' && (
          <PuzzlePage
            onGenerate={() => goToLayoutPicker({ backTarget: 'home' })}
            onWorks={() => {
              setWorksBackScreen('home');
              setScreen('works');
            }}
            onNavigateBack={() => setScreen(homeReturnScreen)}
          />
        )}
        {screen === 'meiyou' && (
          <MeiyouHomePage
            onOpenBabyProfile={(which) => {
              setBabyProfileVariant(which === 'fetus' ? 'fetus' : 'baby');
              setScreen('babyProfile');
            }}
            onTapTryNow={(tab) => {
              if (tab === 'fetus') {
                goToPushLayout('upload');
                return;
              }
              setHomeReturnScreen('meiyou');
              goToLayoutPicker({
                backTarget: 'meiyou',
                bootstrap: 'demo-born-empty',
              });
            }}
            onTapGuideView={(tab) => {
              if (tab === 'fetus') {
                goToPushGuideView();
                return;
              }
              setHomeReturnScreen('meiyou');
              goToLayoutPicker({
                backTarget: 'meiyou',
                bootstrap: 'demo-born-progress',
              });
            }}
            onTapFamilyGuide={(tab) => {
              if (tab === 'fetus') {
                goToPushGuideView();
                return;
              }
              setHomeReturnScreen('meiyou');
              goToLayoutPicker({
                backTarget: 'meiyou',
                bootstrap: 'demo-born-progress',
              });
            }}
          />
        )}
        {screen === 'babyProfile' && (
          <MeiyouBabyProfilePage
            variant={babyProfileVariant}
            onBack={() => setScreen('meiyou')}
            onGoGrowthCard={() => openGrowthCardFrom('babyProfile')}
          />
        )}
        {screen === 'layout' && (
          <LayoutPickerPage
            key={layoutSession.key}
            bootstrap={layoutSession.bootstrap}
            entry={layoutSession.entry}
            pushTweak={layoutSession.pushTweak}
            onPushTweakChange={layoutSession.entry === 'push' ? handlePushTweakChange : null}
            closeOnBack={layoutSession.pushCloseOnBack}
            onBack={() => setScreen(layoutSession.backTarget)}
            onConfirm={(payload) => {
              setSavedCard(payload);
              setWorks((prev) => [{
                id: Date.now(),
                name: payload.layoutName || '纪念拼图',
                date: formatWorkDate(),
                layoutId: payload.layoutId,
                cellPhotos: payload.cellPhotos,
              }, ...prev]);
              setScreen('done');
            }}
            onOpenWorks={() => {
              setWorksBackScreen('layout');
              setScreen('works');
            }}
          />
        )}
        {screen === 'done' && savedCard && (
          <CompletionPage
            card={savedCard}
            onClose={() => {
              setSavedCard(null);
              setScreen('home');
            }}
            onMakeAnother={() => {
              setSavedCard(null);
              goToLayoutPicker({ backTarget: 'home' });
            }}
            onWorks={() => {
              setWorksBackScreen('home');
              setScreen('works');
            }}
          />
        )}
        {screen === 'works' && (
          <WorksPage works={works} onBack={() => setScreen(worksBackScreen)} />
        )}
      </IOSDevice>
    </div>
  );
}
