'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeout = null;
      }, delay - (now - lastCall));
    }
  };
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Device detection hooks
export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isTouch: false,
    gpuTier: 'high' as 'low' | 'medium' | 'high',
    pixelRatio: 1,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      
      // Check if mobile or tablet
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Estimate GPU tier based on various factors
      let gpuTier: 'low' | 'medium' | 'high' = 'high';
      
      // Check for low-end device indicators
      if (isMobile && pixelRatio > 2) {
        gpuTier = 'low'; // High DPI mobile devices often struggle
      } else if (isMobile) {
        gpuTier = 'medium';
      } else if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        gpuTier = 'medium';
      }
      
      // Check WebGL capabilities
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl && gl instanceof WebGLRenderingContext) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            // Check for integrated graphics
            if (typeof renderer === 'string' && 
                (renderer.toLowerCase().includes('intel') || 
                 renderer.toLowerCase().includes('integrated'))) {
              gpuTier = gpuTier === 'high' ? 'medium' : gpuTier;
            }
          }
        }
      } catch (e) {
        gpuTier = 'low';
      }
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isTouch,
        gpuTier,
        pixelRatio,
      });
    };
    
    checkDevice();
    window.addEventListener('resize', debounce(checkDevice, 250));
    
    return () => {
      window.removeEventListener('resize', debounce(checkDevice, 250));
    };
  }, []);
  
  return deviceInfo;
}

// Performance-optimized scroll hook
export function useOptimizedScroll(callback?: (scrollY: number) => void) {
  const [scrollY, setScrollY] = useState(0);
  const ticking = useRef(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollY(currentScrollY);
          callback?.(currentScrollY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    
    // Use passive listener for better touch performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [callback]);
  
  return scrollY;
}

// Intersection Observer hook for lazy loading
export function useInViewport(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        if (inView && !hasBeenInView) {
          setHasBeenInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
        ...options,
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, hasBeenInView, options]);
  
  return { isInView, hasBeenInView };
}

// Three.js performance settings based on device
export function getThreePerformanceSettings(deviceInfo: ReturnType<typeof useDeviceDetection>) {
  const { isMobile, gpuTier, pixelRatio } = deviceInfo;
  
  if (gpuTier === 'low' || isMobile) {
    return {
      dpr: [0.5, 1],
      shadows: false,
      antialias: false,
      particles: 10, // Heavily reduced particles
      frameloop: 'demand' as const,
      performance: {
        current: 0.5,
        min: 0.5,
        max: 1,
        debounce: 200,
      },
    };
  }
  
  if (gpuTier === 'medium') {
    return {
      dpr: [1, Math.min(pixelRatio, 1.5)],
      shadows: true,
      antialias: true,
      particles: 50, // Moderate particles
      frameloop: 'always' as const,
      performance: {
        current: 1,
        min: 0.5,
        max: 1.5,
        debounce: 100,
      },
    };
  }
  
  // High performance
  return {
    dpr: [1, Math.min(pixelRatio, 2)],
    shadows: true,
    antialias: true,
    particles: 100, // Full particles
    frameloop: 'always' as const,
    performance: {
      current: 1,
      min: 0.5,
      max: 2,
      debounce: 50,
    },
  };
}

// Optimized mouse position tracking
export function useOptimizedMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const rafId = useRef<number>();
  
  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        setMousePosition({ x, y });
      });
    }, 16); // ~60fps
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);
  
  return mousePosition;
}

// Frame rate limiter for animations (non-Three.js)
export function useFrameRateLimiter(fps: number = 30) {
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const lastUpdate = useRef(0);
  const interval = 1000 / fps;
  
  useEffect(() => {
    let animationId: number;
    
    const animate = (timestamp: number) => {
      if (timestamp - lastUpdate.current >= interval) {
        setShouldUpdate(true);
        lastUpdate.current = timestamp;
        
        // Reset immediately for next frame
        requestAnimationFrame(() => setShouldUpdate(false));
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [interval]);
  
  return shouldUpdate;
}

// Three.js specific frame limiter (only use inside Canvas)
export function useThreeFrameLimiter(fps: number = 30) {
  const clock = useRef({ delta: 0, elapsed: 0, shouldUpdate: false });
  const interval = 1 / fps;
  
  // This hook should only be used inside a Three.js Canvas context
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFrame((state, delta) => {
      clock.current.delta += delta;
      clock.current.shouldUpdate = false;
      
      if (clock.current.delta > interval) {
        clock.current.elapsed += clock.current.delta;
        clock.current.delta = clock.current.delta % interval;
        clock.current.shouldUpdate = true;
      }
    });
  } catch (e) {
    // Not in a Three.js context, return dummy values
    console.warn('useThreeFrameLimiter must be used inside a Three.js Canvas');
  }
  
  return clock.current;
}

// Visibility-based rendering control
export function useVisibilityControl() {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return isVisible;
}

// Quality auto-adjustment based on FPS
export function useAutoQuality(targetFPS: number = 30) {
  const [quality, setQuality] = useState(1);
  const frames = useRef<number[]>([]);
  const lastTime = useRef(performance.now());
  
  useEffect(() => {
    const checkPerformance = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      lastTime.current = now;
      
      const fps = 1000 / delta;
      frames.current.push(fps);
      
      // Keep last 60 frames
      if (frames.current.length > 60) {
        frames.current.shift();
      }
      
      // Calculate average FPS
      const avgFPS = frames.current.reduce((a, b) => a + b, 0) / frames.current.length;
      
      // Adjust quality based on performance
      if (avgFPS < targetFPS * 0.8 && quality > 0.5) {
        setQuality(prev => Math.max(0.5, prev - 0.1));
      } else if (avgFPS > targetFPS * 1.2 && quality < 1) {
        setQuality(prev => Math.min(1, prev + 0.1));
      }
      
      requestAnimationFrame(checkPerformance);
    };
    
    const rafId = requestAnimationFrame(checkPerformance);
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [targetFPS, quality]);
  
  return quality;
}
