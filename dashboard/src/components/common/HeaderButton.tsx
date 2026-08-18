import React from 'react';

interface HeaderButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  accentColor?: string; // e.g. #84cc16
  accentLight?: string; // e.g. #a3e635
  accentRgb?: string;   // e.g. 132, 204, 22
}

export const HeaderButton: React.FC<HeaderButtonProps> = ({
  label,
  onClick,
  icon,
  variant = 'primary',
  accentColor = '#6366f1',
  accentLight = '#818cf8',
  accentRgb = '99, 102, 241',
}) => {
  if (variant === 'secondary') {
    return (
      <button onClick={onClick} className="aq-btn-secondary">
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  // Primary variant with Fuse accent overrides
  const primaryStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${accentLight} 0%, ${accentColor} 100%)`,
    boxShadow: `0 10px 25px -5px rgba(${accentRgb}, 0.4)`,
  };

  return (
    <button onClick={onClick} className="aq-btn-primary" style={primaryStyle}>
      {icon}
      <span>{label}</span>
    </button>
  );
};
