
import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  shortcut: string;
}

const navigationItems: NavigationItem[] = [
  { label: 'Accueil', href: '/', shortcut: 'Alt+H' },
  { label: 'Services', href: '/services', shortcut: 'Alt+S' },
  { label: 'À propos', href: '/about', shortcut: 'Alt+A' },
  { label: 'Contact', href: '/contact', shortcut: 'Alt+C' }
];

export default function AccessibleNavigation() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'h':
            e.preventDefault();
            navigate('/');
            break;
          case 's':
            e.preventDefault();
            navigate('/services');
            break;
          case 'a':
            e.preventDefault();
            navigate('/about');
            break;
          case 'c':
            e.preventDefault();
            navigate('/contact');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <nav 
      role="navigation" 
      aria-label="Navigation principale"
      className="w-full py-4"
    >
      <ul className="flex gap-6 justify-center">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.href);
              }}
              className={cn(
                "text-lg font-medium transition-colors",
                location === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
              aria-current={location === item.href ? "page" : undefined}
            >
              {item.label}
              <span className="sr-only"> ({item.shortcut})</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="sr-only" role="status" aria-live="polite">
        Page actuelle : {navigationItems.find(item => item.href === location)?.label}
      </div>
    </nav>
  );
}
