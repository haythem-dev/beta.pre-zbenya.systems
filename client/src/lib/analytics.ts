
import { Analytics } from '@vercel/analytics/react';

export function initAnalytics() {
  return (
    <Analytics 
      mode="production"
      beforeSend={(event) => {
        // Add user type to all events
        return {
          ...event,
          userType: localStorage.getItem('userType') || 'unknown'
        }
      }}
    />
  );
}

export function trackPageView(path: string) {
  if (typeof window !== 'undefined') {
    (window as any).va?.('page_view', { path });
  }
}

export function trackConversion(type: string) {
  if (typeof window !== 'undefined') {
    (window as any).va?.('conversion', { type });
  }
}
