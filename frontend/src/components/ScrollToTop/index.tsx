// src/components/ScrollToTop/index.tsx
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top scroll to 0
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`fixed right-5 bottom-5 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <Button
        onClick={scrollToTop}
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full bg-white shadow-md hover:bg-emerald-50"
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="h-5 w-5 text-emerald-600" />
      </Button>
    </div>
  );
};

export default ScrollToTop;