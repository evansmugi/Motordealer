'use client';

import React, { useState, useRef } from 'react';
import { RotateCw, Maximize2, Sparkles, Layers } from 'lucide-react';

interface Vehicle360Props {
  frames: string[];
  vehicleTitle: string;
}

export const Vehicle360Viewer: React.FC<Vehicle360Props> = ({ frames, vehicleTitle }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const totalFrames = frames.length || 1;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 15) {
      if (deltaX > 0) {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      } else {
        setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
      }
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        height: '420px',
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Frame Showcase */}
      <img
        src={frames[currentFrame] || frames[0]}
        alt={`${vehicleTitle} 360 View Frame ${currentFrame + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'none' }}
      />

      {/* 360 Spin Overlay Control Badge */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '11px', fontWeight: '800' }}>
        <RotateCw size={14} color="#3B82F6" className="spin-icon" />
        <span>360° INTERACTIVE EXTERIOR SPIN (DRAG TO ROTATE)</span>
      </div>

      {/* Interactive Feature Hotspot Pins */}
      <div
        onClick={() => setActiveHotspot(activeHotspot === 'engine' ? null : 'engine')}
        style={{
          position: 'absolute',
          top: '45%',
          left: '35%',
          zIndex: 15,
          cursor: 'pointer'
        }}
      >
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.4)', border: '2px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px #3B82F6' }}>
          <Sparkles size={14} color="#fff" />
        </div>
        {activeHotspot === 'engine' && (
          <div style={{ position: 'absolute', bottom: '35px', left: '-80px', width: '200px', background: 'rgba(14, 16, 23, 0.95)', border: '1px solid #3B82F6', borderRadius: '10px', padding: '10px', color: '#fff', fontSize: '11px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ fontWeight: '800', color: '#60A5FA' }}>Powertrain Hotspot</div>
            <div>Twin-Turbo V8 / Dual Motor Assembly with active thermal management.</div>
          </div>
        )}
      </div>

      <div
        onClick={() => setActiveHotspot(activeHotspot === 'wheels' ? null : 'wheels')}
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '30%',
          zIndex: 15,
          cursor: 'pointer'
        }}
      >
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.4)', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px #10B981' }}>
          <Layers size={14} color="#fff" />
        </div>
        {activeHotspot === 'wheels' && (
          <div style={{ position: 'absolute', bottom: '35px', left: '-80px', width: '200px', background: 'rgba(14, 16, 23, 0.95)', border: '1px solid #10B981', borderRadius: '10px', padding: '10px', color: '#fff', fontSize: '11px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ fontWeight: '800', color: '#34D399' }}>Forged Alloy & Brakes</div>
            <div>21-inch Forged Alloy Wheels with ventilated performance ceramic calipers.</div>
          </div>
        )}
      </div>

      {/* Frame Rotation Progress Bar */}
      <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${((currentFrame + 1) / totalFrames) * 100}%`, height: '100%', background: '#3B82F6', transition: 'width 0.1s ease' }}></div>
        </div>
        <span style={{ fontSize: '11px', color: '#fff', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
          FRAME {currentFrame + 1}/{totalFrames}
        </span>
      </div>
    </div>
  );
};
