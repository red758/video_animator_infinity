
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const InfinityLogo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={(size * 400) / 320} 
      viewBox="0 0 320 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M160 20 L270 380 L220 380 L160 160 L100 380 L50 380 L160 20 Z" 
        fill="currentColor" 
      />
      <path 
        d="M 30 140 C 120 120, 180 140, 240 180 C 300 220, 320 280, 280 340 C 240 400, 180 360, 190 320 C 200 280, 260 260, 280 180 C 300 100, 150 80, 30 140 Z" 
        fill="currentColor" 
      />
    </svg>
  );
};

export default InfinityLogo;
