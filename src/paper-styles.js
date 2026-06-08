/** 四格 / 九格 · 边框与底色样式（与选版式页一致） */
export const PAPER_STYLES = {
  warm: {
    name: '暖棕经典',
    tagline: '双层暖棕边框，适合长久珍藏',
    border: '#8b7355',
    frameBg: '#fffaf6',
    footerBg: '#fffaf6',
    innerLine: 'rgba(139,115,85,0.22)',
    thumbBg: '#f7f0e8',
    shadow: '0 10px 28px rgba(80,30,40,0.18)',
  },
  blush: {
    name: '粉柔暖阳',
    tagline: '蜜桃粉边柔底，温柔记录',
    border: '#d4899a',
    frameBg: '#fff5f8',
    footerBg: '#fff5f8',
    innerLine: 'rgba(212,137,154,0.28)',
    thumbBg: '#ffeff4',
    shadow: '0 10px 28px rgba(120,50,70,0.14)',
  },
  sage: {
    name: '清新成长',
    tagline: '薄荷绿边浅底，清爽留念',
    border: '#7aab8e',
    frameBg: '#f6fbf8',
    footerBg: '#f6fbf8',
    innerLine: 'rgba(122,171,142,0.28)',
    thumbBg: '#edf7f1',
    shadow: '0 10px 28px rgba(40,80,60,0.12)',
  },
  kraft: {
    name: '自然原色',
    tagline: '暖褐自然底，质朴耐看',
    border: '#a08050',
    frameBg: '#faf4ea',
    footerBg: '#faf4ea',
    innerLine: 'rgba(160,128,80,0.26)',
    thumbBg: '#f3e8d6',
    shadow: '0 10px 28px rgba(90,60,30,0.16)',
  },
};

export const PAPER_IDS = ['warm', 'blush', 'sage', 'kraft'];

export function paperFrameBoxStyle(paperId) {
  const p = PAPER_STYLES[paperId] || PAPER_STYLES.warm;
  return {
    background: p.frameBg,
    border: `1.5px solid ${p.border}`,
    boxShadow:
      `inset 0 0 0 5px #fff, inset 0 0 0 6px ${p.innerLine}, ${p.shadow}`,
  };
}

export function resolvePaperId(layoutId, layoutMeta = null) {
  if (layoutMeta?.paperId) return layoutMeta.paperId;
  const stem = String(layoutId).endsWith('-c') ? layoutId.slice(0, -2) : layoutId;
  const m = stem.match(/^(?:2x2|3x3)-(.+)$/);
  return m ? m[1] : 'warm';
}
