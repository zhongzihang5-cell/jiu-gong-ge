import React, { useState, useEffect } from 'react';
import { ScatterGridPolaroid } from './ScatterGridPolaroid';
import { MY, FONT } from './meiyou-theme';

const FONT_SERIF = `"Noto Serif SC", "Songti SC", "STSong", serif`;

const PREVIEW_SLOTS = [
  'assets/p1.jpg', 'assets/p2.jpg', 'assets/p3.jpg',
  'assets/p4.jpg', 'assets/p5.jpg', 'assets/p6.jpg', 'assets/p7.jpg',
];

const base = typeof import.meta !== 'undefined' && import.meta.env
  ? (import.meta.env.BASE_URL || '/')
  : '/';
const imgUrl = (p) => (p.startsWith('/') ? p : `${base}${p}`);

/** 3×3 拍立得小格 · 与设计稿手写脚标风格一致 */
function PreviewPolaroidNine({ captions }) {
  const list = captions.length >= 9
    ? captions.slice(0, 9)
    : [...captions, ...Array.from({ length: 9 - captions.length }, (_, i) => `瞬间 ${i + 1}`)];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 6,
      padding: '10px 10px 12px',
      boxSizing: 'border-box',
    }}
    >
      {list.map((cap, i) => (
        <div
          key={i}
          style={{
            background: '#fff',
            padding: '4px 4px 6px',
            borderRadius: 3,
            boxShadow:
              i === 4
                ? '0 3px 10px rgba(255,91,138,0.18), 0 1px 4px rgba(60,35,42,0.08)'
                : '0 2px 6px rgba(60,35,42,0.06)',
          }}
        >
          <div style={{
            borderRadius: 2,
            overflow: 'hidden',
            aspectRatio: '1 / 1',
            background: '#f5ebe4',
          }}
          >
            <img
              src={imgUrl(PREVIEW_SLOTS[i % PREVIEW_SLOTS.length])}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 7.5,
            fontStyle: 'italic',
            color: MY.textSub,
            marginTop: 4,
            lineHeight: 1.25,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          >
            {cap}
          </div>
        </div>
      ))}
    </div>
  );
}

const CAROUSEL_SAMPLES = [
  {
    tag: '满月日记',
    subLine: '9 张小瞬间 · 拼成第一份纪念卡',
    kind: 'scatter',
  },
  {
    tag: '孕期旅程',
    subLine: '里程碑九宫格 · 一天一天更靠近 TA',
    kind: 'grid',
    captions: ['验孕', '胎心初照', '囤货角', 'B 超剪影', '孕肚合拍', '水果周', '准爸留影', '产检日', '足月倒数'],
  },
  {
    tag: '散落在相册的日常',
    subLine: '把零碎照片拼成一起看的故事',
    kind: 'scatter',
  },
  {
    tag: '百日礼记',
    subLine: '100 天里的哈欠与大笑',
    kind: 'grid',
    captions: ['第 7 天', '睡姿', '第 14 天', '抬头练习', '洗澡时间', '抓握', '满月', '百天', '全家合照'],
  },
];

const SCROLL_MS = 4800;

/**
 * 替换照片流程内 · 成品案例轮播预览（独立全屏层，保留下层编辑状态）
 */
export function FinishedProductPreviewOverlay({ onClose }) {
  const [idx, setIdx] = useState(0);
  const n = CAROUSEL_SAMPLES.length;

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % n);
    }, SCROLL_MS);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 500,
      display: 'flex',
      flexDirection: 'column',
      background:
        'linear-gradient(175deg,' +
        `#fff8fc 0%, #fff5f7 26%, ` +
        '#fffcfa 55%, #fffdfb 100%)',
      overflow: 'hidden',
      fontFamily: FONT,
    }}
    >
      {/* 顶栏 */}
      <div style={{
        flexShrink: 0,
        padding: '52px 10px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      >
        <button
          type="button"
          aria-label="关闭"
          onClick={onClose}
          style={{
            width: 40,
            height: 40,
            border: 'none',
            background: 'rgba(255,255,255,0.82)',
            borderRadius: 12,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(80,35,48,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: MY.textSub,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round">
            <path d="M1 1l10 10M11 1L1 11" />
          </svg>
        </button>
        <div style={{
          marginRight: 40,
          fontSize: 15,
          fontWeight: 500,
          color: MY.textSub,
          letterSpacing: 0.4,
        }}
        >
          成品预览
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 28,
      }}
      >
        <div style={{
          padding: '8px 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        >
          {/* 口碑条 */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 80,
            background: MY.white,
            border: `0.5px solid rgba(255,77,136,0.18)`,
            boxShadow: '0 6px 20px rgba(255,115,148,0.08)',
          }}
          >
            <span style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: MY.brand,
              flexShrink: 0,
            }}
            aria-hidden
            />
            <span style={{ fontSize: 12, fontWeight: 400, color: MY.text }}>
              <span style={{ color: MY.brand, fontWeight: 500 }}>12,886</span>
              {' '}位妈妈已为宝宝生成纪念卡
            </span>
          </div>

          {/* 主标题 */}
          <h1 style={{
            margin: '22px 0 10px',
            fontFamily: FONT_SERIF,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 0.8,
            lineHeight: 1.45,
            color: MY.text,
            textAlign: 'center',
          }}
          >
            这 <span style={{ color: MY.brand, fontVariantNumeric: 'tabular-nums' }}>280</span> 天，
            <br />
            <span style={{ color: MY.brand }}>值得</span>
            <span style={{ color: MY.text }}>好好珍藏</span>
          </h1>
          <p style={{
            fontSize: 13,
            fontWeight: 400,
            color: MY.textSub,
            lineHeight: 1.5,
            textAlign: 'center',
            maxWidth: 300,
            margin: '0 0 8px',
          }}
          >
            看看其他家庭完成的纪念卡，
            {' '}你也会想要一张属于自己的拼图故事。
          </p>
        </div>

        {/* 轮播区 */}
        <div style={{
          height: 320,
          position: 'relative',
          perspective: 1100,
          marginTop: 4,
        }}
        >
          {/* 左右切换 */}
          <button
            type="button"
            aria-label="上一张"
            onClick={() => setIdx((i) => (i - 1 + n) % n)}
            style={{
              position: 'absolute',
              left: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 32,
              height: 72,
              zIndex: 20,
              border: 'none',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.55)',
              color: MY.textSub,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="下一张"
            onClick={() => setIdx((i) => (i + 1) % n)}
            style={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 32,
              height: 72,
              zIndex: 20,
              border: 'none',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.55)',
              color: MY.textSub,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            ›
          </button>

          {CAROUSEL_SAMPLES.map((s, i) => {
            const offset = ((i - idx) + n) % n;
            const show = offset <= 2 || offset === n - 1;
            const isCenter = offset === 0;
            const isLeft = offset === n - 1;
            const isRight = offset === 1;

            let dx = 0; let rot = 0; let sc = 0.74; let z = 1; let op = 0.52;
            if (isCenter) {
              dx = 0; rot = -1.8; sc = 1; z = 8; op = 1;
            } else if (isLeft) {
              dx = -86; rot = -9; sc = 0.78; z = 5; op = 0.55;
            } else if (isRight) {
              dx = 86; rot = 9; sc = 0.78; z = 5; op = 0.55;
            } else if (offset === 2) {
              dx = 132; rot = 16; sc = 0.64; z = 2; op = 0.28;
            }
            if (!show) return null;

            const activeScatter = isCenter && s.kind === 'scatter';

            return (
              <button
                type="button"
                key={s.tag}
                onClick={() => setIdx(i)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 10,
                  width: 200,
                  minHeight: 276,
                  marginLeft: -100,
                  transform: `translateX(${dx}px) rotate(${rot}deg) scale(${sc})`,
                  transition: 'transform 0.62s cubic-bezier(.2,.8,.22,1), opacity 0.45s',
                  zIndex: z,
                  opacity: op,
                  cursor: 'pointer',
                  padding: '10px 10px 14px',
                  border: 'none',
                  borderRadius: 10,
                  background: MY.white,
                  boxShadow: isCenter
                    ? `0 20px 48px rgba(180,110,138,0.22), ${'0 2px 10px rgba(80,35,42,0.08)'}`
                    : '0 10px 28px rgba(80,35,42,0.12)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{
                  flex: 1,
                  minHeight: 198,
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: '#fbf6f3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                >
                  {s.kind === 'scatter' ? (
                    <div style={{
                      transform: 'scale(0.97)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      overflow: 'hidden',
                    }}
                    >
                      <ScatterGridPolaroid
                        active={activeScatter}
                        scale={0.98}
                        dashedBorderColor="rgba(255,91,138,0.28)"
                        templateBg="#fff8fa"
                        organizedHoldMs={5200}
                        scatterDelayMs={900}
                      />
                    </div>
                  ) : (
                    <PreviewPolaroidNine captions={s.captions} />
                  )}
                </div>
                <div style={{
                  marginTop: 10,
                  padding: '0 4px',
                }}
                >
                  <div style={{
                    fontFamily: FONT_SERIF,
                    fontSize: 14,
                    fontWeight: 500,
                    color: MY.text,
                    letterSpacing: 0.4,
                    marginBottom: 3,
                  }}
                  >
                    {s.tag}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: MY.textSub,
                    lineHeight: 1.4,
                  }}
                  >
                    {s.subLine}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 分页 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          marginTop: 18,
          paddingBottom: 8,
        }}
        >
          {CAROUSEL_SAMPLES.map((s, i) => (
            <button
              type="button"
              key={`dot-${s.tag}`}
              aria-label={`第 ${i + 1} 张`}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 22 : 6,
                height: 6,
                borderRadius: 3,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'width 0.25s cubic-bezier(.2,.8,.2,1)',
                background:
                  i === idx
                    ? MY.brand
                    : 'rgba(255,77,136,0.22)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
