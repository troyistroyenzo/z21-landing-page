'use client';

import { useEffect, useState, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalized: { x: number; y: number };
}

export function useMousePosition3D(elementRef?: React.RefObject<HTMLElement | null>) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalized: { x: 0, y: 0 }
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePosition({
          x,
          y,
          normalized: {
            x: (x / rect.width) * 2 - 1,
            y: -(y / rect.height) * 2 + 1
          }
        });
      } else {
        // Global mouse position
        setMousePosition({
          x: event.clientX,
          y: event.clientY,
          normalized: {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1
          }
        });
      }
    };

    const element = elementRef?.current || window;
    element.addEventListener('mousemove', handleMouseMove as any);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, [elementRef]);

  return mousePosition;
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      });
    };

    // Check if we need permission (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            setHasPermission(true);
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // No permission needed
      setHasPermission(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return { orientation, hasPermission };
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
