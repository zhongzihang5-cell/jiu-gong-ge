import React, { useState } from 'react';
import { MY, FONT } from './meiyou-theme';
import { ScatterGridPolaroid } from './ScatterGridPolaroid';

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconTabMeiyou({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L4 8v12h6v-7h4v7h6V8l-8-5z"
        fill={active ? MY.brand : 'rgba(0,0,0,0.35)'}
        stroke="none"
      />
    </svg>
  );
}

function IconTabCalendar({ active }) {
  const c = active ? MY.brand : 'rgba(0,0,0,0.35)';
  return (
    <div style={{ position: 'relative', width: 24, height: 26 }}>
      <svg width="24" height="18" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke={c} strokeWidth="1.8" />
        <path d="M3 11h18" stroke={c} strokeWidth="1.8" />
      </svg>
      <span style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        fontSize: 9, fontWeight: 500, color: c, textAlign: 'center', lineHeight: 1,
      }}>26</span>
    </div>
  );
}

function IconTabCoin({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke={active ? MY.brand : 'rgba(0,0,0,0.35)'} strokeWidth="1.8" />
      <text x="12" y="15" textAnchor="middle" fontSize="9" fontWeight="500" fill={active ? MY.brand : 'rgba(0,0,0,0.35)'} fontFamily={FONT}>¥</text>
    </svg>
  );
}

function IconTabMsg({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h16v10H8l-4 3V6z"
        stroke={active ? MY.brand : 'rgba(0,0,0,0.35)'}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTabProfile({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="4" stroke={active ? MY.brand : 'rgba(0,0,0,0.35)'} strokeWidth="1.8" />
      <path d="M5 21v-2a7 7 0 0114 0v2" stroke={active ? MY.brand : 'rgba(0,0,0,0.35)'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const FEED_ICONS = [
  { label: '喂养记录', bg: MY.brandSoft, emoji: '🏠' },
  { label: '在家早教', bg: '#fff8e6', emoji: '🧩' },
  { label: '问答精选', bg: '#fff3d9', emoji: '⭐' },
  { label: '记身高体重', bg: '#e6faf5', emoji: '📋' },
  { label: '更多', bg: '#f5f5f7', emoji: '▦' },
];

/** 美柚首页 · 默认「宝宝」tab：顶栏纯色、资料区两行文案对齐参考截图 */
export function MeiyouHomePage({
  onOpenBabyProfile,
  /** 推广条「立即体验」—— 九宫格后进编辑，末三格空白需自主上传 */
  onTapTryNow,
  /** 时间轴 guide「点击查看」—— 保持示例图已满可继续替换 */
  onTapFamilyGuide,
}) {
  const [bottomTab, setBottomTab] = useState(0);
  const [timelineGuideVisible, setTimelineGuideVisible] = useState(true);
  const tabLabels = ['美柚', '记录', '返现', '消息', '我'];

  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: MY.pageBg, fontFamily: FONT,
    }}>
      {/* 中层：滚动内容 + FAB */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 12,
        }}>
          {/* 顶部通栏：纯色 */}
          <div style={{
            position: 'relative',
            background: MY.headerSolid,
            paddingBottom: 12,
          }}>
            {/* 顶导航（无系统状态栏，仅保留与参考稿一致的顶栏区域） */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '52px 12px 10px',
            }}>
              <button type="button" style={{ border: 'none', background: 'transparent', padding: 6, cursor: 'pointer' }}>
                <IconSearch />
              </button>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 400,
              }}>
                {['妈妈', '宝宝', '宝宝', '与', '宝宝'].map((t, i) => (
                  t === '宝宝'
                    ? (
                      <button
                        key={`${t}-${i}`}
                        type="button"
                        onClick={() => onOpenBabyProfile?.()}
                        style={{
                          paddingBottom: 4,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          paddingLeft: 0,
                          paddingRight: 0,
                          color: i === 2 ? MY.white : 'rgba(255,255,255,0.75)',
                          fontWeight: i === 2 ? 500 : 400,
                          borderBottom: i === 2 ? '2px solid #fff' : '2px solid transparent',
                          fontSize: 14,
                          fontFamily: FONT,
                        }}
                      >
                        {t}
                      </button>
                    )
                    : (
                      <span
                        key={`${t}-${i}`}
                        style={{
                          paddingBottom: 4,
                          color: 'rgba(255,255,255,0.76)',
                          fontWeight: 400,
                          borderBottom: '2px solid transparent',
                        }}
                      >
                        {t}
                      </span>
                    )
                ))}
              </div>
              <button type="button" style={{ border: 'none', background: 'transparent', padding: 6, cursor: 'pointer', position: 'relative' }}>
                <IconCamera />
                <span style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  background: MY.brand,
                  color: '#fff',
                  fontSize: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}>+
                </span>
              </button>
            </div>

            {/* 资料区 */}
            <div style={{
              padding: '10px 14px 4px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <button
                type="button"
                onClick={() => onOpenBabyProfile?.()}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  background: MY.white,
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '2px solid rgba(255,255,255,0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                👶
              </button>
              <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 4,
              }}
              >
                <button
                  type="button"
                  onClick={() => onOpenBabyProfile?.()}
                  style={{
                    fontSize: 17,
                    fontWeight: 500,
                    color: MY.white,
                    letterSpacing: 0.5,
                    lineHeight: 1.2,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: FONT,
                    textAlign: 'left',
                  }}
                >
                  宝宝
                </button>
                <button
                  type="button"
                  onClick={() => onOpenBabyProfile?.()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.95)',
                    lineHeight: 1.2,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: FONT,
                  }}
                >
                  <span>3岁11天</span>
                  <span style={{
                    opacity: 0.9,
                    fontSize: 13,
                  }}>✎</span>
                </button>
              </div>
              <button type="button" style={{
                flexShrink: 0,
                height: 30,
                padding: '0 12px',
                borderRadius: 80,
                border: 'none',
                background: MY.brand,
                color: MY.white,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}
              >
                <span style={{ fontSize: 12 }}>❤️</span>
                邀请亲友 ›
              </button>
            </div>
          </div>

          {/* 今日卡片（渐变） */}
          <div style={{ padding: '0 12px', marginTop: 12 }}>
            <div style={{
              borderRadius: 12,
              background: MY.orangeCard,
              padding: '14px 14px',
              boxShadow: '0 4px 12px rgba(255,150,74,0.22)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: MY.white }}>今天 （5月26日）</span>
                <span style={{ color: MY.white, fontSize: 14, opacity: 0.9 }}>›</span>
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.96)',
                lineHeight: 1.47,
              }}>
                <span style={{ fontWeight: 500 }}>宝宝变化：</span>
                今天我从妈妈肚子里出来了，以后要多多关照哦～
              </div>
            </div>
          </div>

          {/* 五宫格 */}
          <div style={{
            margin: '12px 12px 0',
            background: MY.white,
            borderRadius: 12,
            padding: '14px 8px',
            boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {FEED_ICONS.map((it) => (
                <button
                  key={it.label}
                  type="button"
                  style={{
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 8, width: 54, padding: 0,
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 8,
                    background: it.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>{it.emoji}
                  </div>
                  <span style={{ fontSize: 11, color: MY.textSub, whiteSpace: 'nowrap' }}>{it.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 推广条 */}
          <div style={{
            margin: '12px 12px 0',
            background: MY.white,
            borderRadius: 12,
            padding: '12px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}>
            <span style={{ fontSize: 13, color: MY.textSub, lineHeight: 1.4, flex: 1 }}>
              把散落的照片，拼成成长的样子
            </span>
            <button
              type="button"
              onClick={() => (onTapTryNow ?? onTapFamilyGuide)?.()}
              style={{
                flexShrink: 0,
                height: 28, padding: '0 14px', borderRadius: 80,
                border: `1px solid ${MY.brand}`,
                background: MY.white, color: MY.brand,
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >立即体验
            </button>
          </div>

          {/* 时间轴 · 今天 */}
          <div style={{
            margin: '16px 0 92px',
            paddingLeft: 20,
            paddingRight: 12,
          }}>
            <div style={{ position: 'relative', paddingLeft: 14, marginBottom: 20 }}>
              <div style={{
                position: 'absolute', left: 0, top: 8,
                bottom: -20,
                width: 2,
                background: 'rgba(0,0,0,0.08)',
                borderRadius: 1,
              }}
              />
              <div style={{
                position: 'absolute', left: -3, top: 6, width: 8, height: 8,
                borderRadius: 4,
                background: MY.brand,
                boxShadow: '0 0 0 2px rgba(255,255,255,1)',
              }}
              />
              <div style={{ fontSize: 13, fontWeight: 500, color: MY.text, marginBottom: 8 }}>
                今天　3岁11天
              </div>

              {timelineGuideVisible && (
                <div style={{
                  position: 'relative',
                  background: '#fff5f2',
                  borderRadius: 12,
                  padding: '12px 12px 12px 10px',
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 10,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  border: '0.5px solid rgba(255,77,136,0.12)',
                }}>
                  <button
                    type="button"
                    onClick={() => setTimelineGuideVisible(false)}
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

                  <div style={{
                    position: 'relative',
                    width: 88,
                    height: 88,
                    flexShrink: 0,
                    borderRadius: 8,
                    background: MY.white,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '0.5px solid rgba(0,0,0,0.06)',
                  }}>
                    <ScatterGridPolaroid
                      active={timelineGuideVisible}
                      scale={0.34}
                      dashedBorderColor="rgba(255,77,136,0.38)"
                      templateBg="#fff8fa"
                      organizedHoldMs={5000}
                    />
                  </div>

                  <div style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingRight: 20,
                    paddingTop: 2,
                  }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: MY.brand,
                      lineHeight: 1.35,
                      marginBottom: 4,
                    }}>
                      用你的照片拼出来的故事
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: MY.textSub,
                      lineHeight: 1.4,
                      marginBottom: 10,
                    }}>
                      用拼图记录这一刻的小美好
                    </div>
                    <button
                      type="button"
                      onClick={() => onTapFamilyGuide?.()}
                      style={{
                        alignSelf: 'flex-start',
                        height: 30,
                        padding: '0 18px',
                        borderRadius: 80,
                        border: 'none',
                        background: MY.brand,
                        color: MY.white,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      点击查看
                    </button>
                  </div>

                  <div style={{
                    position: 'absolute',
                    right: 28,
                    bottom: 8,
                    fontSize: 10,
                    color: 'rgba(0,0,0,0.18)',
                    fontFamily: '"Noto Serif SC", serif',
                    letterSpacing: 2,
                    pointerEvents: 'none',
                  }}>
                    纪念册
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 悬浮相机 */}
        <button
          type="button"
          style={{
            position: 'absolute',
            right: 16,
            bottom: 8,
            zIndex: 15,
            width: 54,
            height: 54,
            borderRadius: 27,
            border: 'none',
            background: MY.brand,
            color: MY.white,
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(255,77,136,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
          aria-label="拍照"
        >
          <span style={{ position: 'relative' }}>
            📷
            <span style={{
              position: 'absolute',
              top: -6,
              right: -8,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: MY.white,
              color: MY.brand,
              fontSize: 11,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>+
            </span>
          </span>
        </button>
      </div>

      {/* 底栏 */}
      <div style={{
        flexShrink: 0,
        background: MY.white,
        borderTop: `0.5px solid ${MY.line}`,
        padding: '6px 4px 22px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
      }}>
        {[
          { Icon: IconTabMeiyou, i: 0 },
          { Icon: IconTabCalendar, i: 1 },
          { Icon: IconTabCoin, i: 2 },
          { Icon: IconTabMsg, i: 3, badge: 8 },
          { Icon: IconTabProfile, i: 4, dot: true },
        ].map(({ Icon, i, badge, dot }) => (
          <button
            key={i}
            type="button"
            onClick={() => setBottomTab(i)}
            style={{
              border: 'none', background: 'transparent',
              flex: 1,
              padding: '4px 0',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon active={bottomTab === i} />
              {badge != null && (
                <span style={{
                  position: 'absolute', top: -4, right: -10,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  borderRadius: 8,
                  background: MY.navBadge,
                  color: MY.white,
                  fontSize: 10,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                >{badge > 99 ? '99+' : badge}
                </span>
              )}
              {dot && (
                <span style={{
                  position: 'absolute', top: -1, right: -4,
                  width: 7, height: 7,
                  borderRadius: 4,
                  background: MY.navBadge,
                }} />
              )}
            </div>
            <span style={{
              fontSize: 11,
              color: bottomTab === i ? MY.brand : MY.textSub,
              fontWeight: bottomTab === i ? 500 : 400,
            }}>{tabLabels[i]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
