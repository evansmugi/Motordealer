import { useState } from "react";



function BrandCard({ brand, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        background: 'linear-gradient(145deg, #131313 0%, #0a0a0a 100%)',
        border: `1px solid ${hovered ? brand.accentColor : 'rgba(201,168,76,0.12)'}`,
        borderRadius: 12, overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'none',
        boxShadow: hovered
          ? `0 32px 64px ${brand.accentColor}20, 0 0 0 1px ${brand.accentColor}33`
          : '0 4px 24px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', height: 210 }}>
        <img
          src={brand.image} alt={brand.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: 90, height: 90, background: `linear-gradient(135deg, ${brand.accentColor}bb 0%, transparent 55%)`, pointerEvents: 'none' }} />
        {brand.badge && (
          <span style={{ position: 'absolute', top: 14, left: 14, background: brand.accentColor, color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 4, letterSpacing: 0.5, boxShadow: `0 2px 12px ${brand.accentColor}66` }}>
            {brand.badge}
          </span>
        )}
        <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>{brand.name}</div>
          <div style={{ fontSize: 12, color: brand.accentColor, fontWeight: 600, marginTop: 5, letterSpacing: 0.8 }}>{brand.tagline}</div>
        </div>
      </div>
      <div style={{ padding: '18px 20px 22px' }}>
        {/* <p style={{ color: '#888', fontSize: 13, lineHeight: 1.65, margin: '0 0 16px' }}>{brand.description}</p> */}
        {/* <div style={{ marginBottom: 18 }}>
          {brand.benefits.slice(0, 2).map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${brand.accentColor}20`, border: `1px solid ${brand.accentColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <span style={{ color: brand.accentColor, fontSize: 9, fontWeight: 900 }}>✓</span>
              </div>
              <span style={{ color: '#bbb', fontSize: 12, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div> */}
        {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {brand.models.map(m => (
            <span key={m} style={{ fontSize: 10, color: brand.accentColor, background: `${brand.accentColor}12`, border: `1px solid ${brand.accentColor}30`, padding: '3px 10px', borderRadius: 20, fontWeight: 700, letterSpacing: 0.3 }}>{m}</span>
          ))}
        </div> */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', gap:4, paddingTop: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Starting from</div>
            <div style={{ color: brand.accentColor, fontWeight: 900, fontSize: 16 }}>{brand.price}</div>
          </div>
          <div style={{ color: '#000', background: `linear-gradient(135deg, ${brand.accentColor} 0%, ${brand.accentColor}bb 100%)`, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', padding: '8px 16px', borderRadius: 6, boxShadow: hovered ? `0 4px 20px ${brand.accentColor}55` : 'none', transition: 'box-shadow 0.3s' }}>
            VIP Access →
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandCard