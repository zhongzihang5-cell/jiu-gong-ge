import React from 'react';
import { MY, FONT } from './meiyou-theme';

const PREVIEW_PHOTOS = [
  'assets/p1.jpg', 'assets/p2.jpg', 'assets/p3.jpg',
  'assets/p4.jpg', 'assets/p5.jpg', 'assets/p6.jpg', 'assets/p7.jpg',
];

const FET_ANT = {
  goldGlow: '#e8c98a',
  goldDeep: '#8a6f3e',
  bgCell: '#e9dfd0',
};

const FETUS_LUXURY_MILESTONE_SLOT = {
  6: { previewSrc: 'assets/p4.jpg' },
  7: { previewSrc: 'assets/p7.jpg' },
};

const FETUS_BIRTH_LUXURY = { haloSrc: 'assets/p1.jpg' };

const FONT_SERIF = `"Noto Serif SC", "Songti SC", "STSong", serif`;

/** 替换照片页 / 首页 · 3×3 缩略占位 */
export function BirthProgressNineMini({
  gap = 1,
  firstSixSrc,
  fetusNineMiniLuxury = false,
  nineSlots,
}) {
  const thumbs = PREVIEW_PHOTOS;

  if (nineSlots && nineSlots.length >= 9) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap,
        width: '100%', height: '100%',
        background: '#fff',
        boxSizing: 'border-box',
      }}
      >
        {nineSlots.slice(0, 9).map((src, i) => (
          <div key={i} style={{ minWidth: 0, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
            {src ? (
              <img src={src} alt="" style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              }} />
            ) : (
              <>
                <img src={thumbs[i % thumbs.length]} alt="" style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.28,
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(255,243,247,0.82)',
                  border: '0.5px dashed rgba(255,91,138,0.28)',
                  boxSizing: 'border-box',
                }} />
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  const row = firstSixSrc
    ?? [0, 1, 2, 3, 4, 5].map((i) => thumbs[i % thumbs.length]);

  const cellImg = (i) => (
    <img src={row[i]} alt="" style={{
      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    }} />
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap,
      width: '100%', height: '100%',
      background: '#fff',
      boxSizing: 'border-box',
    }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ minWidth: 0, minHeight: 0, overflow: 'hidden' }}>{cellImg(i)}</div>)}
      {fetusNineMiniLuxury ? (
        <>
          <div style={{ minWidth: 0, minHeight: 0, overflow: 'hidden', background: FET_ANT.bgCell, position: 'relative' }}>
            <img src={FETUS_LUXURY_MILESTONE_SLOT[6].previewSrc} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: 0.38, filter: 'grayscale(0.35)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(253,245,232,0.5) 0%, rgba(253,245,232,0.78) 100%)',
            }} />
          </div>
          <div style={{ minWidth: 0, minHeight: 0, overflow: 'hidden', background: FET_ANT.bgCell, position: 'relative' }}>
            <img src={FETUS_LUXURY_MILESTONE_SLOT[7].previewSrc} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: 0.38, filter: 'grayscale(0.35)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(253,245,232,0.5) 0%, rgba(253,245,232,0.78) 100%)',
            }} />
          </div>
          <div style={{
            minWidth: 0, minHeight: 0, background: '#ede4d6',
            border: `0.5px solid ${FET_ANT.goldGlow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}
          >
            <img src={FETUS_BIRTH_LUXURY.haloSrc} alt="" style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover', opacity: 0.22,
              filter: 'sepia(0.45)', display: 'block',
            }} />
            <span style={{
              position: 'relative', zIndex: 1,
              fontSize: 10, fontWeight: 500, color: FET_ANT.goldDeep, lineHeight: 1,
              fontFamily: FONT_SERIF,
            }} aria-hidden>{'\u2726'}</span>
          </div>
        </>
      ) : (
        <>
          <div style={{
            background: '#fff3f7',
            border: '0.5px dashed rgba(255,91,138,0.28)',
            minWidth: 0, minHeight: 0,
          }} />
          <div style={{
            background: '#fff3f7',
            border: '0.5px dashed rgba(255,91,138,0.28)',
            minWidth: 0, minHeight: 0,
          }} />
          <div style={{
            background: 'linear-gradient(180deg,#fffceb 0%, #fff5d9 100%)',
            border: '0.5px solid rgba(212,175,116,0.35)',
            minWidth: 0, minHeight: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          >
            <span style={{ fontSize: 9, fontWeight: 400, color: '#c9a227', lineHeight: 1 }} aria-hidden="true">＋</span>
          </div>
        </>
      )}
    </div>
  );
}

/** 圆环进度摘要：左九宫缩略 + 右文案与操作按钮 */
export function MemorialStoryRingHeader({
  pct = 67,
  total = 9,
  collected = 6,
  babyName = '豆豆',
  firstSixSrc,
  onPreviewTap,
  fetusNineMiniLuxury = false,
  nineSlots,
  actionLabel = '成品预览',
}) {
  const ringR = 34;
  const ringC = 2 * Math.PI * ringR;
  const pctClamped = Math.max(0, Math.min(100, pct)) / 100;
  const dash = ringC * pctClamped;

  const wrap = 76;
  const cx = wrap / 2;
  const cSafe = Math.min(collected, total);
  const rest = Math.max(0, total - cSafe);
  const isFullyComplete = pct >= 100 && cSafe >= total;

  if (isFullyComplete) {
    const completeWrap = 82;
    const completeCx = completeWrap / 2;
    const completeRingR = 36;

    return (
      <div style={{
        flexShrink: 0,
        padding: '16px 14px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: FONT,
        background:
          'linear-gradient(128deg, #fff9fc 0%, #fff3f8 38%, #fffaf4 72%, #fffefb 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 10,
            right: 14,
            fontSize: 11,
            color: 'rgba(255,77,136,0.22)',
            lineHeight: 1,
          }}
        >
          ✦
        </span>
        <span
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 12,
            right: 42,
            fontSize: 8,
            color: 'rgba(255,180,100,0.35)',
            lineHeight: 1,
          }}
        >
          ✦
        </span>

        <div
          aria-hidden
          style={{
            flexShrink: 0,
            width: completeWrap,
            height: completeWrap,
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 2,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,77,136,0.14) 0%, transparent 68%)',
            pointerEvents: 'none',
          }}
          />
          <svg
            width={completeWrap}
            height={completeWrap}
            viewBox={`0 0 ${completeWrap} ${completeWrap}`}
            style={{ position: 'absolute', left: 0, top: 0 }}
          >
            <defs>
              <linearGradient id="ringCompleteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6e9c" />
                <stop offset="55%" stopColor="#ff4d88" />
                <stop offset="100%" stopColor="#ffb86c" />
              </linearGradient>
            </defs>
            <circle
              cx={completeCx}
              cy={completeCx}
              r={completeRingR}
              fill="none"
              stroke="rgba(255,77,136,0.1)"
              strokeWidth="3.5"
            />
            <circle
              cx={completeCx}
              cy={completeCx}
              r={completeRingR}
              fill="none"
              stroke="url(#ringCompleteGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 52,
            height: 52,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1.5px solid rgba(255,255,255,0.95)',
            boxShadow:
              '0 0 0 1px rgba(255,77,136,0.12), 0 4px 14px rgba(255,77,136,0.14)',
            boxSizing: 'border-box',
          }}
          >
            <BirthProgressNineMini
              gap={1}
              firstSixSrc={firstSixSrc}
              fetusNineMiniLuxury={fetusNineMiniLuxury}
              nineSlots={nineSlots}
            />
          </div>
          <div style={{
            position: 'absolute',
            right: 4,
            bottom: 6,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: 'linear-gradient(135deg, #ff6e9c 0%, #ff4d88 100%)',
            border: '1.5px solid #fff',
            boxShadow: '0 2px 6px rgba(255,77,136,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            color: '#fff',
            lineHeight: 1,
          }}
          >
            ✓
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, paddingRight: 4 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            borderRadius: 80,
            background: 'rgba(255,77,136,0.08)',
            border: '0.5px solid rgba(255,77,136,0.14)',
            marginBottom: 8,
          }}
          >
            <span style={{ fontSize: 11, lineHeight: 1 }} aria-hidden>🎉</span>
            <span style={{
              fontSize: 11,
              fontWeight: 500,
              color: MY.brand,
              letterSpacing: 0.3,
            }}
            >
              圆满达成
            </span>
          </div>
          <div style={{
            fontSize: 14,
            fontWeight: 500,
            color: MY.text,
            lineHeight: 1.35,
          }}
          >
            恭喜，{babyName}的九宫格已拼满
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flexShrink: 0,
      padding: '14px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: FONT,
    }}
    >
      <div
        aria-hidden
        style={{
          flexShrink: 0,
          width: wrap,
          height: wrap,
          position: 'relative',
        }}
      >
        <svg
          width={wrap}
          height={wrap}
          viewBox={`0 0 ${wrap} ${wrap}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: 'rotate(-88deg)',
            transformOrigin: '50% 50%',
          }}
        >
          <circle
            cx={cx}
            cy={cx}
            r={ringR}
            fill="none"
            stroke="rgba(255,91,138,0.12)"
            strokeWidth="4"
          />
          <circle
            cx={cx}
            cy={cx}
            r={ringR}
            fill="none"
            stroke={MY.brand}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${ringC}`}
          />
        </svg>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 50,
          height: 50,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '0.5px solid rgba(255,255,255,0.9)',
          boxShadow: '0 1px 4px rgba(80,40,50,0.08)',
          boxSizing: 'border-box',
        }}
        >
          <BirthProgressNineMini
            gap={1}
            firstSixSrc={firstSixSrc}
            fetusNineMiniLuxury={fetusNineMiniLuxury}
            nineSlots={nineSlots}
          />
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 500,
          color: MY.text,
          marginBottom: 6,
          lineHeight: 1.35,
        }}
        >
          {babyName}的专属九宫格 · 已完成
          <span style={{ color: MY.brand }}>{pct}%</span>
        </div>
        {!isFullyComplete && (
          <>
            <div style={{
              fontSize: 11,
              color: MY.textSub,
              lineHeight: 1.43,
              marginBottom: 10,
            }}
            >
              已完成{' '}
              <span style={{ color: MY.brand, fontWeight: 500 }}>
                {cSafe}/{total}
              </span>
              {' '}· 再填 {rest} 格即可生成
            </div>
            <button
              type="button"
              onClick={onPreviewTap}
              style={{
                background: '#fff5f9',
                padding: '6px 14px',
                borderRadius: 80,
                fontSize: 12,
                fontWeight: 500,
                color: MY.brand,
                cursor: onPreviewTap ? 'pointer' : 'default',
                letterSpacing: 0.2,
                border: `0.5px solid rgba(255,91,138,0.18)`,
              }}
            >
              {actionLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const FETUS_TIMELINE_LABELS = ['5周', '8周', '12周', '16周', '20周', '24周', '28周', '32周', '宝宝出生'];

/** 胎宝宝替换照片页 · 孕期留影横向时间轴（图2样式） */
export function FetusPregnancyTimelineHeader({
  collected = 6,
  total = 9,
  onPreviewTap,
  nodeLabels = FETUS_TIMELINE_LABELS,
}) {
  const cSafe = Math.min(Math.max(0, collected), total);
  const currentIndex = cSafe < total ? cSafe : total - 1;
  const lineRatio = total > 1 ? cSafe / (total - 1) : 0;
  const pct = Math.round((cSafe / total) * 100);

  return (
    <div style={{
      flexShrink: 0,
      padding: '14px 14px 12px',
      fontFamily: FONT,
    }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 14,
      }}
      >
        <div style={{
          fontSize: 14,
          fontWeight: 500,
          color: MY.text,
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
        }}
        >
          孕期留影 ·{' '}
          <span style={{ color: MY.brand }}>{pct}%</span>
        </div>
        <button
          type="button"
          onClick={onPreviewTap}
          style={{
            flexShrink: 0,
            height: 28,
            padding: '0 12px',
            borderRadius: 80,
            border: 'none',
            background: MY.brand,
            color: MY.white,
            fontSize: 12,
            fontWeight: 500,
            cursor: onPreviewTap ? 'pointer' : 'default',
            whiteSpace: 'nowrap',
          }}
        >
          预览成品 →
        </button>
      </div>

      <div style={{ position: 'relative', paddingBottom: 2 }}>
        <div style={{
          position: 'absolute',
          left: 7,
          right: 7,
          top: 9,
          height: 2,
          background: 'rgba(255,77,136,0.12)',
          borderRadius: 1,
        }}
        />
        {cSafe > 0 && (
          <div style={{
            position: 'absolute',
            left: 7,
            top: 9,
            height: 2,
            width: `calc((100% - 14px) * ${lineRatio})`,
            background: MY.brand,
            borderRadius: 1,
            transition: 'width 0.25s ease',
          }}
          />
        )}

        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          {nodeLabels.slice(0, total).map((label, i) => {
            const done = i < cSafe;
            const current = i === currentIndex && cSafe < total;
            const isLast = i === total - 1;

            let nodeStyle = {
              width: current ? 14 : 8,
              height: current ? 14 : 8,
              borderRadius: '50%',
              flexShrink: 0,
              boxSizing: 'border-box',
            };

            if (done) {
              nodeStyle = {
                ...nodeStyle,
                background: MY.brand,
                border: 'none',
              };
            } else if (current) {
              nodeStyle = {
                ...nodeStyle,
                background: MY.white,
                border: `2px solid ${MY.brand}`,
                boxShadow: '0 0 0 3px rgba(255,77,136,0.18)',
              };
            } else {
              nodeStyle = {
                ...nodeStyle,
                background: MY.white,
                border: '1.5px solid rgba(255,77,136,0.22)',
              };
            }

            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: isLast ? '1.35 1 0' : '1 1 0',
                  minWidth: 0,
                }}
              >
                <div style={nodeStyle} aria-hidden />
                <span style={{
                  marginTop: 6,
                  fontSize: isLast ? 8 : 9,
                  fontWeight: current ? 500 : 400,
                  color: current ? MY.brand : MY.textSub,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  whiteSpace: isLast ? 'normal' : 'nowrap',
                  maxWidth: isLast ? 42 : 30,
                }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** 胎宝宝首页时间轴 · 与替换照片页圆环进度一一对应（示意 5/9） */
const FETUS_HOME_COLLECTED = 5;
const FETUS_HOME_TOTAL = 9;
const FETUS_HOME_PCT = Math.round((FETUS_HOME_COLLECTED / FETUS_HOME_TOTAL) * 100);
const FETUS_HOME_NINE_SLOTS = Array.from({ length: 9 }, (_, i) => (
  i < FETUS_HOME_COLLECTED ? PREVIEW_PHOTOS[i % PREVIEW_PHOTOS.length] : null
));

export function MemorialTimelineProgressGuide({
  visible,
  onClose,
  onTapView,
  babyName = '豆豆',
}) {
  if (!visible) return null;

  return (
    <div style={{
      position: 'relative',
      background: MY.white,
      borderRadius: 12,
      overflow: 'hidden',
      border: '0.5px solid rgba(139,115,85,0.12)',
      boxShadow: '0 4px 18px rgba(80,35,48,0.08)',
    }}
    >
      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 22,
          height: 22,
          border: 'none',
          background: 'transparent',
          color: MY.textSub,
          fontSize: 15,
          lineHeight: 1,
          cursor: 'pointer',
          padding: 0,
          zIndex: 2,
        }}
        aria-label="关闭"
      >
        ✕
      </button>
      <MemorialStoryRingHeader
        pct={FETUS_HOME_PCT}
        total={FETUS_HOME_TOTAL}
        collected={FETUS_HOME_COLLECTED}
        babyName={babyName}
        nineSlots={FETUS_HOME_NINE_SLOTS}
        actionLabel="立即查看"
        onPreviewTap={onTapView}
      />
    </div>
  );
}
