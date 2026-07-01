import { SVGProps } from 'react';
import Image from 'next/image';

interface GabomaAILogoProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const GabomaAILogo = ({ width = 24, height = 24, className, style }: GabomaAILogoProps) => (
  <img
    src="/gaboma-ai-svg-icone.svg"
    alt="Gaboma AI"
    width={width}
    height={height}
    className={className}
    style={{ ...style, objectFit: 'contain' }}
  />
);
