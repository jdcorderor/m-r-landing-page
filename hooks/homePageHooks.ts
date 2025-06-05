import { useState, useEffect } from 'react';

// Hook to manage the number of slides per view based on window size
export function useSlidesPerView() {
  const [slides, setSlides] = useState(3);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 700) setSlides(1);
      else if (window.innerWidth < 1024) setSlides(2);
      else setSlides(3);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return slides;
}

// Group items into arrays of a specified size
export function groupItems<T>(items: T[], perGroup: number): T[][] {
  const groups = [];
  for (let i = 0; i < items.length; i += perGroup) {
    groups.push(items.slice(i, i + perGroup));
  }
  return groups;
}

// Format date to a readable string
export function formatDate(time: string): string {
  const date = new Date(time);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}