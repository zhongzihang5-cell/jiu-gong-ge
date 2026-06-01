import React from 'react';
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
function PreviewPolaroidNine({ captions, compact = false }) {
  const list = captions.length >= 9
    ? captions.slice(0, 9)
    : [...captions, ...Array.from({ length: 9 - captions.length }, (_, i) => `瞬间 ${i + 1}`)];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: compact ? 4 : 6,
      padding: compact ? '6px 6px 8px' : '10px 10px 12px',
      boxSizing: 'border-box',
      width: '100%',
    }}
    >
      {list.map((cap, i) => (
        <div
          key={i}
          style={{
            background: '#fff',
            padding: compact ? '2px 2px 4px' : '4px 4px 6px',
            borderRadius: 3,
            boxShadow: '0 1px 4px rgba(60,35,42,0.06)',
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
          {compact ? null : (
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
          )}
        </div>
      ))}
    </div>
  );
}

function MiniPhoto({ srcIndex, style }) {
  return (
    <img
      src={imgUrl(PREVIEW_SLOTS[srcIndex % PREVIEW_SLOTS.length])}
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        ...style,
      }}
    />
  );
}

/** 双列流卡片内的模板缩略示意 */
function TemplatePreviewThumb({ kind, captions }) {
  const wrap = (children) => (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#fbf6f3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}
    >
      {children}
    </div>
  );

  if (kind === 'scatter') {
    return wrap(
      <ScatterGridPolaroid
        active={false}
        scale={0.52}
        dashedBorderColor="rgba(255,91,138,0.28)"
        templateBg="#fff8fa"
        organizedHoldMs={5200}
        scatterDelayMs={900}
      />
    );
  }

  if (kind === 'grid') {
    return wrap(<PreviewPolaroidNine captions={captions} compact />);
  }

  if (kind === 'cols4') {
    return wrap(
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 3,
        width: '92%',
        height: '88%',
      }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ borderRadius: 2, overflow: 'hidden', background: '#eee' }}>
            <MiniPhoto srcIndex={i + 2} />
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'big1') {
    return wrap(
      <div style={{
        display: 'grid',
        gridTemplateRows: '3fr 2fr',
        gap: 3,
        width: '92%',
        height: '88%',
      }}
      >
        <div style={{ borderRadius: 2, overflow: 'hidden' }}>
          <MiniPhoto srcIndex={0} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, minHeight: 0 }}>
          <div style={{ borderRadius: 2, overflow: 'hidden' }}><MiniPhoto srcIndex={1} /></div>
          <div style={{ borderRadius: 2, overflow: 'hidden' }}><MiniPhoto srcIndex={2} /></div>
        </div>
      </div>
    );
  }

  if (kind === 'grid4') {
    return wrap(
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 3,
        width: '86%',
        aspectRatio: '1 / 1',
      }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ borderRadius: 2, overflow: 'hidden' }}>
            <MiniPhoto srcIndex={i + 3} />
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'v3') {
    return wrap(
      <div style={{
        display: 'grid',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 3,
        width: '72%',
        height: '90%',
      }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ borderRadius: 2, overflow: 'hidden' }}>
            <MiniPhoto srcIndex={i + 4} />
          </div>
        ))}
      </div>
    );
  }

  return wrap(<PreviewPolaroidNine captions={captions ?? []} compact />);
}

/** 成品预览 · 各模板双列流介绍 */
const TEMPLATE_SHOWCASE = [
  {
    id: 'scatter',
    name: '散落拼贴',
    theme: '通用',
    cells: 9,
    ratio: '1:1',
    desc: '相册里的零碎瞬间，自动归位成完整故事',
    kind: 'scatter',
    previewH: 168,
  },
  {
    id: '3x3-c',
    name: '九宫格·文案',
    theme: '孕期时光',
    cells: 9,
    ratio: '1:1',
    desc: '孕周 milestone 标注，一天一天更靠近 TA',
    kind: 'grid',
    captions: ['验孕', '胎心初照', '囤货角', 'B 超剪影', '孕肚合拍', '水果周', '准爸留影', '产检日', '足月倒数'],
    previewH: 152,
  },
  {
    id: 'cols4-c',
    name: '四联竖栏·文案',
    theme: '孕期时光',
    cells: 4,
    ratio: '2:3',
    desc: '纵向四段旅程，适合记录连续变化',
    kind: 'cols4',
    previewH: 184,
  },
  {
    id: 'big1-c',
    name: '主图·文案',
    theme: '宝宝成长',
    cells: 3,
    ratio: '4:3',
    desc: '一张主图定格高光，其余补充细节',
    kind: 'big1',
    previewH: 148,
  },
  {
    id: '2x2',
    name: '经典四宫格',
    theme: '宝宝成长',
    cells: 4,
    ratio: '1:1',
    desc: '四季四帧，版面干净、重点清晰',
    kind: 'grid4',
    previewH: 132,
  },
  {
    id: 'v3-c',
    name: '竖排·文案',
    theme: '宝宝成长',
    cells: 3,
    ratio: '3:4',
    desc: '竖向三联对比，成长变化一目了然',
    kind: 'v3',
    previewH: 176,
  },
  {
    id: 'rows3-c',
    name: '三排·文案',
    theme: '孕期时光',
    cells: 3,
    ratio: '3:4',
    desc: '横向三段时间线，适合阶段回顾',
    kind: 'v3',
    previewH: 160,
  },
  {
    id: 'h3-c',
    name: '横排·文案',
    theme: '宝宝成长',
    cells: 3,
    ratio: '3:2',
    desc: '宽屏横排三联，分享图更舒展',
    kind: 'grid',
    captions: ['出生第 1 天', '第 7 天', '满月', '百天', '半岁', '9 个月', '周岁', '学步', '全家福'],
    previewH: 148,
  },
];

function TemplateFlowCard({ item }) {
  return (
    <article style={{
      background: MY.white,
      borderRadius: 12,
      overflow: 'hidden',
      border: `0.5px solid rgba(0,0,0,0.06)`,
      boxShadow: '0 4px 16px rgba(80,35,48,0.06)',
      display: 'flex',
      flexDirection: 'column',
    }}
    >
      <div style={{
        height: item.previewH,
        flexShrink: 0,
        borderBottom: `0.5px solid ${MY.line}`,
      }}
      >
        <TemplatePreviewThumb kind={item.kind} captions={item.captions} />
      </div>
      <div style={{ padding: '10px 10px 12px' }}>
        <div style={{
          display: 'inline-block',
          fontSize: 10,
          fontWeight: 500,
          color: MY.brand,
          background: 'rgba(255,77,136,0.08)',
          padding: '2px 8px',
          borderRadius: 4,
          marginBottom: 6,
          lineHeight: 1.4,
        }}
        >
          {item.theme}
        </div>
        <div style={{
          fontFamily: FONT_SERIF,
          fontSize: 14,
          fontWeight: 500,
          color: MY.text,
          lineHeight: 1.35,
          marginBottom: 4,
        }}
        >
          {item.name}
        </div>
        <p style={{
          fontSize: 11,
          fontWeight: 400,
          color: MY.textSub,
          lineHeight: 1.45,
          margin: '0 0 8px',
        }}
        >
          {item.desc}
        </p>
        <div style={{
          fontSize: 10,
          color: MY.textSub,
          opacity: 0.85,
          letterSpacing: 0.2,
        }}
        >
          {item.cells} 格 · {item.ratio}
        </div>
      </div>
    </article>
  );
}

/**
 * 替换照片流程内 · 成品模板双列流预览（独立全屏层，保留下层编辑状态）
 */
export function FinishedProductPreviewOverlay({ onClose }) {
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
      {/* 顶栏 · 与替换照片等页一致 */}
      <div style={{
        flexShrink: 0,
        padding: '52px 16px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      >
        <button
          type="button"
          aria-label="返回"
          onClick={onClose}
          style={{
            height: 36,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 4px',
            color: MY.text,
          }}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path
              d="M8.5 1L1.5 8L8.5 15"
              stroke="rgba(0,0,0,0.8)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 13, color: MY.textSub, fontWeight: 400 }}>返回</span>
        </button>

        <div style={{
          fontSize: 16,
          fontWeight: 600,
          color: MY.text,
          letterSpacing: 0.2,
        }}
        >
          成品预览
        </div>

        <div style={{ width: 36 }} aria-hidden />
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
          padding: '8px 16px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        >
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
              {' '}位妈妈已为宝宝生成纪念拼图
            </span>
          </div>

          <h1 style={{
            margin: '18px 0 8px',
            fontFamily: FONT_SERIF,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: 0.6,
            lineHeight: 1.45,
            color: MY.text,
            textAlign: 'center',
          }}
          >
            多种模板，拼出你的故事
          </h1>
          <p style={{
            fontSize: 13,
            fontWeight: 400,
            color: MY.textSub,
            lineHeight: 1.5,
            textAlign: 'center',
            maxWidth: 300,
            margin: 0,
          }}
          >
            下滑浏览不同版式成品，选最适合你相册的一种。
          </p>
        </div>

        {/* 双列模板流 */}
        <div style={{
          columnCount: 2,
          columnGap: 12,
          padding: '4px 12px 8px',
        }}
        >
          {TEMPLATE_SHOWCASE.map((item) => (
            <div
              key={item.id}
              style={{
                breakInside: 'avoid',
                WebkitColumnBreakInside: 'avoid',
                marginBottom: 12,
              }}
            >
              <TemplateFlowCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
