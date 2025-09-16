// Google Analytics configuration for Loyalty Program
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-RJ2YEVJJRP';
export const APP_NAME = 'مانا';
export const STREAM_URL = 'https://www.gardou.ir';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      app_name: APP_NAME,
      stream_url: STREAM_URL,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user login events
export const trackLogin = (method: string, userRole: string) => {
  event({
    action: 'login',
    category: 'Authentication',
    label: `${method}_${userRole}`,
  });
};

// Track user registration events
export const trackRegistration = (userRole: string) => {
  event({
    action: 'sign_up',
    category: 'Authentication',
    label: userRole,
  });
};

// Track store management events
export const trackStoreAction = (action: string, storeId?: string) => {
  event({
    action: action,
    category: 'Store Management',
    label: storeId,
  });
};

// Track promo code events
export const trackPromoCodeAction = (action: string, promoCodeId?: string) => {
  event({
    action: action,
    category: 'Promo Codes',
    label: promoCodeId,
  });
};

// Track transaction events
export const trackTransaction = (action: string, transactionId?: string, value?: number) => {
  event({
    action: action,
    category: 'Transactions',
    label: transactionId,
    value: value,
  });
};

// Track customer engagement events
export const trackCustomerEngagement = (action: string, customerId?: string) => {
  event({
    action: action,
    category: 'Customer Engagement',
    label: customerId,
  });
};

// Track admin actions
export const trackAdminAction = (action: string, adminId?: string) => {
  event({
    action: action,
    category: 'Admin Actions',
    label: adminId,
  });
};

// Track SMS events
export const trackSmsEvent = (action: string, smsId?: string) => {
  event({
    action: action,
    category: 'SMS',
    label: smsId,
  });
};

// Track error events
export const trackError = (errorType: string, errorMessage: string) => {
  event({
    action: 'error',
    category: 'Errors',
    label: `${errorType}: ${errorMessage}`,
  });
};

// Track performance events
export const trackPerformance = (metric: string, value: number) => {
  event({
    action: 'performance',
    category: 'Performance',
    label: metric,
    value: value,
  });
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: any
    ) => void;
  }
}
