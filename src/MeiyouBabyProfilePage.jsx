import React, { useState } from 'react';
import { MY, FONT } from './meiyou-theme';

const card = {
  background: MY.white,
  borderRadius: 12,
  overflow: 'hidden',
  marginBottom: 12,
};

const rowBase = {
  display: 'flex',
  alignItems: 'center',
  padding: '14px 14px',
  gap: 12,
  border: 'none',
  width: '100%',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: FONT,
  background: MY.white,
};

function Chevron() {
  return (
    <span style={{ marginLeft: 'auto', color: 'rgba(0,0,0,0.22)', fontSize: 14 }}>›</span>
  );
}

function IconSquare({ bg, children }) {
  return (
    <span style={{
      width: 38, height: 38, borderRadius: 8,
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20,
      flexShrink: 0,
    }}>{children}</span>
  );
}

function Divider() {
  return <div style={{ height: 1, background: MY.line, marginLeft: 62 }} />;
}

function MenuRow({
  iconBg, icon, label, right, badge, badgeBg, showChevron = true, onClick,
}) {
  return (
    <button type="button" onClick={onClick} style={{ ...rowBase }}>
      <IconSquare bg={iconBg}>{icon}</IconSquare>
      <span style={{ fontSize: 16, fontWeight: 400, color: MY.text, flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4,
          background: badgeBg || MY.brandSoft,
          color: badge === 'NEW' ? '#ff4d4d' : (badgeBg ? '#2a7a3d' : MY.brand),
          marginRight: 4,
        }}>{badge}</span>
      )}
      {right}
      {showChevron && <Chevron />}
    </button>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{
      fontSize: 13, fontWeight: 500, color: MY.textSub,
      padding: '6px 14px 8px',
      marginTop: 4,
    }}>{children}</div>
  );
}

function WhiteCard({ children }) {
  return (
    <div style={{ ...card, margin: '0 12px' }}>
      {children}
    </div>
  );
}

function ProfileNavBar({ onBack, showSettings }) {
  return (
    <div style={{
      flexShrink: 0,
      padding: '52px 12px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      background: MY.pageBg,
    }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          position: 'absolute',
          left: 8,
          bottom: 10,
          width: 36,
          height: 36,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="返回"
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path d="M8.5 1L1.5 8L8.5 15" stroke={MY.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{ fontSize: 17, fontWeight: 500, color: MY.text }}>
        宝宝个人中心
      </div>
      {showSettings && (
      <button
        type="button"
        aria-label="设置"
        style={{
          position: 'absolute',
          right: 10,
          bottom: 10,
          width: 36,
          height: 36,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: MY.textSub,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={MY.text} strokeWidth="1.6">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" strokeLinecap="round" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      )}
    </div>
  );
}

/** 已出生宝宝 · 原版个人中心结构 */
function BabyBornProfileBody({ promoVisible, setPromoVisible, onGoGrowthCard }) {
  return (
    <>
      <div style={{ margin: '0 12px 12px', position: 'relative' }}>
        <div style={{
          borderRadius: 12,
          minHeight: 130,
          background: MY.headerSolid,
          padding: '16px 14px',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <button type="button" style={{
            position: 'absolute', top: 12, right: 12,
            border: 'none', borderRadius: 80,
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.35)',
            color: MY.white,
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          >
            📷 换背景
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 68, height: 68, borderRadius: 34,
                background: MY.white,
                border: '3px solid rgba(255,255,255,0.98)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 34,
                overflow: 'hidden',
              }}>
                🍼
              </div>
              <div style={{
                position: 'absolute', right: 0, bottom: 0,
                width: 22, height: 22,
                borderRadius: 11,
                background: MY.brand,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff',
                fontSize: 11,
              }}>📷</div>
            </div>
            <div style={{
              fontSize: 21, fontWeight: 500,
              color: MY.white,
              letterSpacing: 1,
            }}>化工</div>
          </div>
        </div>
      </div>

      <WhiteCard>
        <MenuRow iconBg="#e8efff" icon={<span style={{ fontSize: 18 }}>▦</span>} label="宝宝二维码" />
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 14px', gap: 12 }}>
          <IconSquare bg="#f0f0f2"><span style={{ fontSize: 16 }}>🆔</span></IconSquare>
          <span style={{ fontSize: 16, color: MY.text }}>宝宝号</span>
          <span style={{
            flex: 1,
            fontSize: 14,
            fontVariantNumeric: 'tabular-nums',
            color: MY.textSub,
            textAlign: 'right',
          }}>1902075805</span>
          <button type="button" style={{
            border: 'none',
            background: '#d8f4ff',
            color: '#4f7cae',
            fontSize: 13,
            fontWeight: 500,
            padding: '4px 12px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
          >
            复制
          </button>
        </div>
        <Divider />
        <MenuRow iconBg={MY.brandSoft} icon="👤" label="宝宝资料" />
      </WhiteCard>

      {promoVisible && (
        <div style={{ margin: '0 12px 12px', position: 'relative' }}>
          <button type="button" onClick={() => setPromoVisible(false)} style={{
            position: 'absolute', top: 8, right: 10, zIndex: 2,
            border: 'none', background: 'transparent',
            color: MY.white,
            fontSize: 16, opacity: 0.95, cursor: 'pointer',
          }}
          >
            ✕
          </button>
          <div style={{
            borderRadius: 12,
            padding: '14px 56px 14px 14px',
            background: MY.brand,
            minHeight: 86,
            position: 'relative',
          }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.22)',
              fontSize: 10,
              color: MY.white,
              padding: '2px 6px',
              borderRadius: 4,
              marginBottom: 8,
            }}>限时活动</span>
            <div style={{ fontSize: 16, fontWeight: 500, color: MY.white }}>
              送给宝宝的专属礼物
            </div>
            <div style={{ fontSize: 13, marginTop: 6, color: 'rgba(255,255,255,0.92)' }}>
              神秘扭蛋 · 100%中奖
            </div>
            <span style={{
              position: 'absolute', right: 12, bottom: 8,
              fontSize: 44, lineHeight: 1,
            }}>🎁</span>
          </div>
        </div>
      )}

      <SectionHeader>成长纪念册</SectionHeader>
      <WhiteCard>
        <MenuRow iconBg="#e8f8f7" icon="📷" label="云相册" />
        <Divider />
        <MenuRow iconBg="#ffebeb" icon="🚩" label="大事记" />
        <Divider />
        <MenuRow iconBg={MY.brandSoft} icon="🎰" label="神秘扭蛋" badge="照片书" />
        <Divider />
        <MenuRow iconBg="#fff7d9" icon="🖨" label="照片打印" badge="15张免费" badgeBg="#dcf5e8" />
        <Divider />
        <MenuRow iconBg="#ebe8ff" icon="💌" label="未来寄语" />
        <Divider />
        <MenuRow iconBg="#eae6ff" icon="🎬" label="MV制作" badge="NEW" badgeBg="#ffccd8" />
        <Divider />
        <MenuRow
          iconBg={MY.brandSoft}
          icon="🧩"
          label="制作成长纪念卡"
          onClick={() => onGoGrowthCard?.()}
        />
      </WhiteCard>

      <SectionHeader>生长记录</SectionHeader>
      <WhiteCard>
        <MenuRow iconBg="#e8f7ec" icon="📏" label="身高体重" />
        <Divider />
        <MenuRow iconBg="#dff5e5" icon="💉" label="疫苗接种" />
        <Divider />
        <MenuRow iconBg={MY.brandSoft} icon="🍼" label="喂养记录" />
        <Divider />
        <MenuRow iconBg="#dceeff" icon="🩺" label="症状与护理" />
        <Divider />
        <MenuRow iconBg="#fff6d9" icon="🦷" label="长牙换牙" />
      </WhiteCard>

      <SectionHeader>孕期记录</SectionHeader>
      <WhiteCard>
        <MenuRow iconBg="#e4f8e8" icon="📅" label="产检时间表" />
        <Divider />
        <MenuRow iconBg="#ffe8f3" icon="⚖️" label="胎儿体重" />
      </WhiteCard>

      <WhiteCard>
        <MenuRow iconBg="#fdeee6" icon="🛡" label="安全保障" />
      </WhiteCard>
    </>
  );
}

/** 胎宝宝孕期 · 与已出生条目结构区分开 */
function FetusProfileBody({ onGoGrowthCard }) {
  return (
    <>
      {/* 亲友可见 + 邀请准爸爸 */}
      <WhiteCard>
        <div style={{
          padding: '12px 14px',
          borderBottom: `1px solid ${MY.line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        >
          <span style={{ fontSize: 15, fontWeight: 500, color: MY.text }}>
            1位亲友可见
          </span>
          <button type="button" style={{
            border: 'none',
            background: 'transparent',
            padding: 4,
            cursor: 'pointer',
            color: MY.textSub,
            fontSize: 16,
            lineHeight: 1,
          }} aria-label="说明"
          >ⓘ</button>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          padding: '14px 14px',
          gap: 12,
        }}
        >
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: '#e8f4e9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
              border: '2px solid #fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>🌱</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: MY.text }}>妈妈</span>
            <span style={{ fontSize: 11, color: MY.textSub, textAlign: 'center', lineHeight: 1.35 }}>
              来过4次，1分钟前
            </span>
          </div>
          <div style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
          >
            <button type="button" style={{
              width: 56, height: 56, borderRadius: 28,
              border: 'none',
              background: MY.brand,
              color: MY.white,
              fontSize: 28,
              fontWeight: 300,
              lineHeight: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255,77,136,0.35)',
            }}
            aria-label="微信邀请准爸爸"
            >
              +
            </button>
            <span style={{
              fontSize: 13, fontWeight: 500, color: MY.brand, textAlign: 'center',
              lineHeight: 1.35,
            }}
            >
              微信邀请准爸爸<br />
              <span style={{ fontSize: 12, fontWeight: 400, color: MY.textSub }}>共同记录宝宝</span>
            </span>
          </div>
        </div>
      </WhiteCard>

      {/* 基础资料 */}
      <WhiteCard>
        <MenuRow iconBg={MY.brandSoft} icon="👤" label="宝宝资料" />
        <Divider />
        <MenuRow iconBg="#e8efff" icon={<span style={{ fontSize: 18 }}>▦</span>} label="宝宝二维码" />
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 14px', gap: 12 }}>
          <IconSquare bg="#f0f0f2"><span style={{ fontSize: 16 }}>🆔</span></IconSquare>
          <span style={{ fontSize: 16, color: MY.text }}>宝宝号</span>
          <span style={{
            flex: 1,
            fontSize: 14,
            fontVariantNumeric: 'tabular-nums',
            color: MY.textSub,
            textAlign: 'right',
          }}>1081706525</span>
          <button type="button" style={{
            border: 'none',
            background: '#d8f4ff',
            color: '#4f7cae',
            fontSize: 13,
            fontWeight: 500,
            padding: '4px 12px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
          >
            复制
          </button>
        </div>
      </WhiteCard>

      {/* 功能列表（与设计稿顺序一致） */}
      <WhiteCard>
        <MenuRow iconBg="#dceeff" icon="☁️" label="云相册" />
        <Divider />
        <MenuRow iconBg="#ffe8d9" icon="🚩" label="大事记" />
        <Divider />
        <MenuRow iconBg="#e4f8e8" icon="📅" label="产检时间表" />
        <Divider />
        <MenuRow iconBg={MY.brandSoft} icon="⚖️" label="胎儿估重" />
        <Divider />
        <MenuRow iconBg="#eae6ff" icon="🎬" label="MV制作" />
        <Divider />
        <MenuRow
          iconBg="#fff5f9"
          icon="🧩"
          label="制作成长纪念卡"
          onClick={() => onGoGrowthCard?.()}
        />
        <Divider />
        <MenuRow iconBg={MY.brandSoft} icon="👶" label="四维预测长相" />
        <Divider />
        <MenuRow iconBg="#ffe8cc" icon="📷" label="大肚照" />
      </WhiteCard>

      <WhiteCard>
        <MenuRow iconBg="#fdeee6" icon="🛡" label="安全保障" />
      </WhiteCard>
    </>
  );
}

/**
 * 宝宝个人中心
 * @param {'baby' | 'fetus'} variant · 胎宝宝与已出生宝宝分开展示结构与入口菜单
 */
export function MeiyouBabyProfilePage({
  variant = 'baby',
  onBack,
  onGoGrowthCard,
}) {
  const [promoVisible, setPromoVisible] = useState(true);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: MY.pageBg,
      fontFamily: FONT,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <ProfileNavBar onBack={onBack} showSettings={variant === 'fetus'} />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 24 }}>
        {variant === 'fetus' ? (
          <FetusProfileBody onGoGrowthCard={onGoGrowthCard} />
        ) : (
          <BabyBornProfileBody
            promoVisible={promoVisible}
            setPromoVisible={setPromoVisible}
            onGoGrowthCard={onGoGrowthCard}
          />
        )}
      </div>
    </div>
  );
}
