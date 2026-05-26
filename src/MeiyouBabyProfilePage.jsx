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

/** 宝宝个人中心：配色以纯色为主 */
export function MeiyouBabyProfilePage({ onBack, onGoGrowthCard }) {
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
      {/* 顶栏：仅返回 + 标题 */}
      <div style={{
        flexShrink: 0,
        padding: '52px 12px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: MY.pageBg,
      }}>
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
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 24 }}>
        {/* 资料卡：纯色背景 */}
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

        {/* 信息列表 */}
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

        {/* 限时活动横幅 */}
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
          <MenuRow iconBg="#eae6ff" icon="🎬" label="制作宝宝 MV" badge="NEW" badgeBg="#ffccd8" />
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
      </div>
    </div>
  );
}
