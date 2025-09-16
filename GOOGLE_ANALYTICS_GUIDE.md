# Google Analytics Implementation Guide

## 📊 Overview

This document provides a comprehensive guide for Google Analytics implementation in the Loyalty Program project.

## 🎯 Current Implementation

### **Tracking ID**: `G-RJ2YEVJJRP`
### **App Name**: `مانا`
### **Stream URL**: `https://www.gardou.ir`
### **Stream ID**: `12169067033`
### **Status**: ✅ Implemented and Active
### **Features**: Page tracking, custom events, user behavior analytics

---

## 🏗️ Architecture

### **Files Created/Modified:**

1. **`/lib/gtag.ts`** - Core Google Analytics functions
2. **`/hooks/useGoogleAnalytics.tsx`** - React hook for page tracking
3. **`/components/analytics/GoogleAnalytics.tsx`** - Analytics component
4. **`/config/env.ts`** - Environment configuration
5. **`/app/layout.tsx`** - Root layout integration
6. **`/app/(user)/layout.tsx`** - User layout tracking
7. **`/services/auth.ts`** - Authentication event tracking

---

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file in the frontend directory:

```bash
# Google Analytics Configuration
NEXT_PUBLIC_GA_ID=G-RJ2YEVJJRP
NEXT_PUBLIC_GA_ENABLED=true

# App Configuration
NEXT_PUBLIC_APP_NAME=مانا
NEXT_PUBLIC_STREAM_URL=https://www.gardou.ir
NEXT_PUBLIC_STREAM_ID=12169067033

# Development vs Production
NODE_ENV=development
```

### **Production Configuration**

For production deployment, set:
```bash
NEXT_PUBLIC_GA_ENABLED=true
NODE_ENV=production
```

---

## 📈 Tracked Events

### **Authentication Events**
- **Login**: Tracked when users authenticate via OTP
- **Registration**: Tracked when new users register
- **User Role**: Tracks whether user is admin, store, or customer

### **Business Events**
- **Store Management**: Store creation, updates, status changes
- **Promo Code Actions**: Code generation, validation, usage
- **Transaction Events**: Purchase tracking, redemption
- **Customer Engagement**: Customer interactions, loyalty actions
- **Admin Actions**: Administrative functions and management
- **SMS Events**: SMS sending and delivery tracking

### **Error Tracking**
- **System Errors**: Application errors and exceptions
- **Performance Issues**: Slow loading times, API failures

---

## 🎯 Custom Dimensions

### **User Role Tracking**
- **Dimension 1**: `user_role` (admin, store, customer)
- **Dimension 2**: `store_id` (for store-specific analytics)
- **Dimension 3**: `customer_id` (for customer-specific analytics)

### **Business Metrics**
- **Revenue**: Transaction values and totals
- **Engagement**: User interactions and session duration
- **Conversion**: Registration and activation rates

---

## 📊 Key Metrics to Monitor

### **User Analytics**
1. **User Registration Rate**
   - New customer registrations
   - Store owner registrations
   - Admin account creation

2. **Authentication Success Rate**
   - OTP verification success rate
   - Login failure analysis
   - Session duration

3. **User Engagement**
   - Page views per session
   - Time spent on platform
   - Feature usage patterns

### **Business Analytics**
1. **Store Performance**
   - Store registration rate
   - Store activity levels
   - Store management actions

2. **Promo Code Analytics**
   - Code generation rate
   - Code usage rate
   - Code validation success

3. **Transaction Analytics**
   - Transaction volume
   - Transaction value
   - Customer purchase patterns

### **Technical Analytics**
1. **Performance Metrics**
   - Page load times
   - API response times
   - Error rates

2. **User Experience**
   - Bounce rate
   - Session duration
   - Feature adoption

---

## 🔍 Google Analytics Dashboard Setup

### **Recommended Dashboards**

1. **Loyalty Program Overview**
   - User registrations by role
   - Daily active users
   - Feature usage statistics

2. **Store Management Dashboard**
   - Store registration trends
   - Store activity levels
   - Store management actions

3. **Customer Engagement Dashboard**
   - Customer registration trends
   - Customer activity patterns
   - Loyalty program participation

4. **Technical Performance Dashboard**
   - Page load performance
   - Error tracking
   - API performance metrics

### **Custom Reports**

1. **User Journey Analysis**
   - Registration → First Login → Feature Usage
   - Store Owner → Store Setup → Customer Management

2. **Feature Adoption Analysis**
   - Promo Code Generation
   - SMS Campaign Usage
   - Transaction Processing

3. **Geographic Analysis**
   - User distribution by location
   - Store distribution by city/province

---

## 🚀 Advanced Features

### **Enhanced Ecommerce Tracking**

```typescript
// Track transaction events
import { trackTransaction } from '@/lib/gtag';

// Example: Track a purchase
trackTransaction('purchase', transactionId, transactionValue);
```

### **Custom Event Tracking**

```typescript
// Track custom business events
import { event } from '@/lib/gtag';

// Example: Track promo code usage
event({
  action: 'promo_code_used',
  category: 'Promo Codes',
  label: promoCodeId,
  value: discountAmount
});
```

### **User Property Tracking**

```typescript
// Set user properties for better segmentation
gtag('config', GA_TRACKING_ID, {
  user_id: userId,
  custom_map: {
    'custom_parameter_1': 'user_role',
    'custom_parameter_2': 'store_id',
    'custom_parameter_3': 'customer_id'
  }
});
```

---

## 📱 Mobile Analytics

### **PWA Tracking**
- App installation events
- Offline usage tracking
- Push notification interactions

### **Mobile-Specific Events**
- Touch interactions
- Mobile navigation patterns
- Device-specific performance

---

## 🔒 Privacy and Compliance

### **GDPR Compliance**
- User consent management
- Data anonymization
- Right to deletion

### **Data Retention**
- Configure data retention periods
- Anonymize user data after retention period
- Comply with Iranian data protection laws

---

## 🛠️ Implementation Examples

### **Track Store Creation**

```typescript
import { trackStoreAction } from '@/lib/gtag';

// In store creation component
const handleStoreCreation = async (storeData) => {
  try {
    const store = await createStore(storeData);
    trackStoreAction('store_created', store.id);
  } catch (error) {
    trackError('store_creation_error', error.message);
  }
};
```

### **Track Promo Code Usage**

```typescript
import { trackPromoCodeAction } from '@/lib/gtag';

// In promo code validation
const handlePromoCodeValidation = async (code) => {
  try {
    const result = await validatePromoCode(code);
    if (result.isValid) {
      trackPromoCodeAction('code_validated', code);
    }
  } catch (error) {
    trackError('promo_code_validation_error', error.message);
  }
};
```

### **Track Customer Engagement**

```typescript
import { trackCustomerEngagement } from '@/lib/gtag';

// Track customer actions
const handleCustomerAction = (action, customerId) => {
  trackCustomerEngagement(action, customerId);
};
```

---

## 📊 Analytics Goals

### **Primary Goals**
1. **User Growth**: Track user registration and retention
2. **Feature Adoption**: Monitor feature usage and adoption
3. **Business Performance**: Track store and customer metrics
4. **Technical Performance**: Monitor system performance

### **Secondary Goals**
1. **User Experience**: Improve user journey and satisfaction
2. **Feature Optimization**: Optimize based on usage data
3. **Business Intelligence**: Generate insights for business decisions
4. **Technical Optimization**: Improve system performance

---

## 🔧 Troubleshooting

### **Common Issues**

1. **Analytics Not Tracking**
   - Check if `NEXT_PUBLIC_GA_ENABLED=true`
   - Verify tracking ID is correct
   - Check browser console for errors

2. **Events Not Appearing**
   - Verify event tracking code is called
   - Check Google Analytics real-time reports
   - Ensure proper event parameters

3. **Data Not Updating**
   - Google Analytics has 24-48 hour delay
   - Check real-time reports for immediate data
   - Verify tracking code is active

### **Debug Mode**

Enable debug mode for development:

```typescript
// In development
gtag('config', GA_TRACKING_ID, {
  debug_mode: true
});
```

---

## 📈 Next Steps

### **Immediate Actions**
1. ✅ Verify tracking is working in Google Analytics
2. ✅ Set up custom dashboards
3. ✅ Configure conversion goals
4. ✅ Set up automated reports

### **Future Enhancements**
1. **Advanced Segmentation**: User behavior analysis
2. **Predictive Analytics**: User churn prediction
3. **A/B Testing**: Feature testing and optimization
4. **Real-time Analytics**: Live dashboard implementation

---

## 📞 Support

### **Google Analytics Resources**
- [Google Analytics Help Center](https://support.google.com/analytics/)
- [Google Analytics Academy](https://analytics.google.com/analytics/academy/)
- [Google Tag Manager](https://tagmanager.google.com/)

### **Implementation Support**
- Check console for JavaScript errors
- Verify network requests to Google Analytics
- Test in incognito mode to avoid caching issues

---

**Last Updated**: 28 مرداد 1403  
**Version**: 1.0  
**Status**: ✅ Implemented and Active
