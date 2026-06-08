import React from 'react';
import { MY, FONT } from './meiyou-theme';
import { PAPER_STYLES } from './paper-styles';

const FONT_SERIF = `"Noto Serif SC", "Songti SC", "STSong", serif`;

const PREVIEW_SLOTS = [
  'assets/p1.jpg', 'assets/p2.jpg', 'assets/p3.jpg',
  'assets/p4.jpg', 'assets/p5.jpg', 'assets/p6.jpg', 'assets/p7.jpg',
];

const base = typeof import.meta !== 'undefined' && import.meta.env
  ? (import.meta.env.BASE_URL || '/')
  : '/';
const imgUrl = (p) => (p.startsWith('/') ? p : `${base}${p}`);

const PREGNANCY_CAPS = ['验孕', '胎心初照', '囤货角', 'B 超剪影', '孕肚合拍', '水果周', '准爸留影', '产检日', '足月倒数'];
const BABY_CAPS = ['出生第 1 天', '第 7 天', '满月', '百天', '半岁', '9 个月', '周岁', '学步', '全家福'];

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

/** 四格 / 九格缩略示意 · 带纸框样式 */
function TemplatePreviewThumb({ kind, paperId, withCaption, captions }) {
  const paper = PAPER_STYLES[paperId] || PAPER_STYLES.warm;
  const cols = kind === 'grid4' ? 2 : 3;
  const count = kind === 'grid4' ? 4 : 9;
  const capList = captions?.length
    ? captions.slice(0, count)
    : Array.from({ length: count }, (_, i) => `瞬间 ${i + 1}`);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: paper.thumbBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: 10,
    }}
    >
      <div style={{
        width: kind === 'grid4' ? '72%' : '88%',
        aspectRatio: '1 / 1',
        background: paper.frameBg,
        border: `1.5px solid ${paper.border}`,
        borderRadius: 4,
        boxShadow: `inset 0 0 0 3px #fff, inset 0 0 0 4px ${paper.innerLine}`,
        padding: withCaption ? 6 : 4,
        boxSizing: 'border-box',
      }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: withCaption ? 3 : 2,
          height: '100%',
        }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                background: '#fff',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div style={{ flex: 1, minHeight: 0, background: '#f0e8e2' }}>
                <MiniPhoto srcIndex={i} />
              </div>
              {withCaption && (
                <div style={{
                  flexShrink: 0,
                  fontFamily: FONT_SERIF,
                  fontSize: 5.5,
                  fontStyle: 'italic',
                  color: MY.textSub,
                  textAlign: 'center',
                  padding: '2px 1px',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                >
                  {capList[i]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 成品预览 · 四格/九格 × 四种纸框样式 */
const TEMPLATE_SHOWCASE = [
  {
    id: '3x3-warm-c',
    name: '九格 · 暖棕经典·文案',
    theme: '孕期时光',
    cells: 9,
    ratio: '1:1',
    desc: '暖棕双层边框，孕周 milestone 温柔标注',
    kind: 'grid9',
    paperId: 'warm',
    withCaption: true,
    captions: PREGNANCY_CAPS,
    previewH: 152,
  },
  {
    id: '2x2-blush',
    name: '四格 · 粉柔暖阳',
    theme: '宝宝成长',
    cells: 4,
    ratio: '1:1',
    desc: '蜜桃粉边柔底，四季四帧干净留念',
    kind: 'grid4',
    paperId: 'blush',
    withCaption: false,
    previewH: 132,
  },
  {
    id: '3x3-sage-c',
    name: '九格 · 清新成长·文案',
    theme: '宝宝成长',
    cells: 9,
    ratio: '1:1',
    desc: '薄荷绿边浅底，成长瞬间清爽拼合',
    kind: 'grid9',
    paperId: 'sage',
    withCaption: true,
    captions: BABY_CAPS,
    previewH: 152,
  },
  {
    id: '2x2-kraft-c',
    name: '四格 · 自然原色·文案',
    theme: '孕期时光',
    cells: 4,
    ratio: '1:1',
    desc: '暖褐自然底，阶段回顾质朴耐看',
    kind: 'grid4',
    paperId: 'kraft',
    withCaption: true,
    captions: PREGNANCY_CAPS.slice(0, 4),
    previewH: 136,
  },
  {
    id: '3x3-blush',
    name: '九格 · 粉柔暖阳',
    theme: '孕期时光',
    cells: 9,
    ratio: '1:1',
    desc: '粉边柔底九格，一天一天更靠近 TA',
    kind: 'grid9',
    paperId: 'blush',
    withCaption: false,
    previewH: 148,
  },
  {
    id: '2x2-warm-c',
    name: '四格 · 暖棕经典·文案',
    theme: '宝宝成长',
    cells: 4,
    ratio: '1:1',
    desc: '经典暖棕四格，高光瞬间重点清晰',
    kind: 'grid4',
    paperId: 'warm',
    withCaption: true,
    captions: BABY_CAPS.slice(0, 4),
    previewH: 136,
  },
  {
    id: '3x3-kraft',
    name: '九格 · 自然原色',
    theme: '宝宝成长',
    cells: 9,
    ratio: '1:1',
    desc: '自然原色九格，适合长久珍藏分享',
    kind: 'grid9',
    paperId: 'kraft',
    withCaption: false,
    previewH: 148,
  },
  {
    id: '2x2-sage-c',
    name: '四格 · 清新成长·文案',
    theme: '孕期时光',
    cells: 4,
    ratio: '1:1',
    desc: '清新绿边四格，连续变化一目了然',
    kind: 'grid4',
    paperId: 'sage',
    withCaption: true,
    captions: PREGNANCY_CAPS.slice(0, 4),
    previewH: 136,
  },
];

function TemplateFlowCard({ item }) {
  return (
    <article style={{
      background: MY.white,
      borderRadius: 12,
      overflow: 'hidden',
      border: '0.5px solid rgba(0,0,0,0.06)',
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
        <TemplatePreviewThumb
          kind={item.kind}
          paperId={item.paperId}
          withCaption={item.withCaption}
          captions={item.captions}
        />
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
        '#fff8fc 0%, #fff5f7 26%, ' +
        '#fffcfa 55%, #fffdfb 100%)',
      overflow: 'hidden',
      fontFamily: FONT,
    }}
    >
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
            border: '0.5px solid rgba(255,77,136,0.18)',
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
              {' '}位妈妈已为宝宝生成纪念九宫格
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
            四格与九格，拼出你的故事
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
            下滑浏览不同纸框样式成品，选最适合你相册的一种。
          </p>
        </div>

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
