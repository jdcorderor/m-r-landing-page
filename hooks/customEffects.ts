import { useEffect, RefObject } from 'react';

export function useFadeTransition() {
  useEffect(() => {
    const sections = document.querySelectorAll('.section-fade');
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.20 }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}

export function useFormTransition(ref: RefObject<HTMLDivElement | null>, show: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (show) { 
      el.style.transition = 'max-height 1.5s cubic-bezier(0.22, 1, 0.36, 1), padding 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.maxHeight = '1200px';
      el.style.padding = '2vw 2vw 2vw 2vw';
    } else {
      el.style.transition = 'max-height 0.2s, padding 0.2s';
      el.style.maxHeight = '0';
      el.style.padding = '0 2vw';
    }
  }, [ref, show]);
}

export function useHideMenuOnClickOutside(menuOpen: boolean, setMenuOpen: (open: boolean) => void) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (menuOpen && !target.closest('.nav-links') && !target.closest('.menu-toggle')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen, setMenuOpen]);
}