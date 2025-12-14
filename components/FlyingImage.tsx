import React, { useEffect, useState } from 'react';

interface FlyingImageProps {
  src: string;
  startRect: DOMRect;
  targetRect: DOMRect;
  onComplete: () => void;
}

const FlyingImage: React.FC<FlyingImageProps> = ({ src, startRect, targetRect, onComplete }) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: startRect.top,
    left: startRect.left,
    width: startRect.width,
    height: startRect.height,
    opacity: 1,
    zIndex: 9999,
    transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
    pointerEvents: 'none',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  });

  useEffect(() => {
    // Trigger animation next frame
    requestAnimationFrame(() => {
      setStyle((prev) => ({
        ...prev,
        top: targetRect.top + targetRect.height / 2 - 15, // Center on target
        left: targetRect.left + targetRect.width / 2 - 15,
        width: 30,
        height: 30,
        opacity: 0.5,
        borderRadius: '50%',
      }));
    });

    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [targetRect, onComplete]);

  return <img src={src} alt="flying" style={style} className="object-cover" />;
};

export default FlyingImage;
