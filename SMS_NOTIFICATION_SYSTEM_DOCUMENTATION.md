# SMS Notification System Documentation

## 📋 Overview

The SMS Notification System is a comprehensive feature that allows stores to send automated SMS messages to customers when they use promo codes. The system tracks SMS usage by counting SMS units (70 characters = 1 SMS unit) and deducts them from each store's SMS balance.

## 🎯 Core Features

### 1. SMS Balance Management

- **Store SMS Balance**: Each store has a balance of SMS units (70-character messages)
- **Automatic Deduction**: SMS units are automatically deducted when messages are sent
- **Balance Tracking**: Complete history of SMS usage and recharge operations
- **Low Balance Alerts**: Notifications when SMS balance is running low

### 2. SMS Templates

- **Welcome Messages**: Automatic welcome SMS when customers register promo codes
- **Promo Code Messages**: Confirmation SMS for promo code usage
- **Customizable Templates**: Store owners can customize message content
- **Multi-language Support**: Persian language optimized templates

### 3. SMS Logging & Analytics

- **Complete Audit Trail**: Every SMS is logged with full details
- **Usage Analytics**: Track SMS usage patterns and costs
- **Performance Metrics**: Success rates, failure analysis, and optimization insights
- **Reporting**: Detailed reports for store owners and administrators

## 🏗️ Technical Architecture

### Database Schema

#### Store Schema Enhancement

```typescript
smsSettings?: {
  smsBalance: number; // SMS count balance (70-char units)
  totalSmsUsed: number; // Total SMS units used
  lastRechargeDate?: Date;
  rechargeHistory: Array<{
    smsAmount: number;
    date: Date;
    description: string;
  }>;
};
```

#### SMS Log Schema

```typescript
class SmsLog {
  storeId: Types.ObjectId; // Store that sent the SMS
  customerId: Types.ObjectId; // Customer who received the SMS
  promoCodeId?: Types.ObjectId; // Promo code that triggered the SMS
  phoneNumber: string; // Customer's phone number
  message: string; // SMS content
  messageLength: number; // Character count
  status: "sent" | "failed" | "pending"; // Delivery status
  providerResponse?: string; // SMS provider response
  createdAt: Date; // When SMS was created
  updatedAt: Date; // When SMS was last updated
}
```

### Service Architecture

#### 1. SMS Unit Service

- **Purpose**: Calculate SMS units based on message length
- **Logic**: 1 SMS unit = 70 characters
- **Features**:
  - Character counting
  - Multi-part SMS calculation
  - Message optimization
  - Balance validation

#### 2. SMS Templates Service

- **Purpose**: Generate SMS messages using predefined templates
- **Templates**:
  - Welcome messages
  - Promo code confirmations
  - Promotion announcements
  - Custom messages
- **Features**:
  - Parameter validation
  - Template customization
  - Multi-language support

#### 3. SMS Balance Service

- **Purpose**: Manage SMS balance operations for stores
- **Features**:
  - Balance recharge
  - Balance deduction
  - Balance validation
  - Usage statistics
  - Low balance alerts

#### 4. SMS Service (Main)

- **Purpose**: Orchestrate SMS sending process
- **Features**:
  - Message generation
  - Balance checking
  - SMS sending (currently logging)
  - Error handling
  - Logging and analytics

## 🔄 SMS Flow Process

### Promo Code Registration Flow

1. **Customer registers promo code** → Promo code service validates
2. **SMS Service triggered** → Generate welcome message
3. **Balance validation** → Check store has sufficient SMS units
4. **SMS units calculated** → Based on message length
5. **SMS sent** → Currently logged to console
6. **Balance deducted** → SMS units removed from store balance
7. **SMS logged** → Record created in SMS log

### SMS Unit Calculation Examples

- **50 characters** → 1 SMS unit (50 ÷ 70 = 0.71 → 1)
- **120 characters** → 2 SMS units (120 ÷ 70 = 1.71 → 2)
- **200 characters** → 3 SMS units (200 ÷ 70 = 2.86 → 3)

## 📊 SMS Templates

### Welcome Message Template

```
Default: "به باشگاه مشتریان [StoreName] خوش آمدید! 🎉 از امتیازات و تخفیف‌های ویژه بهره‌مند شوید."
With Name: "سلام [CustomerName] عزیز! به باشگاه مشتریان [StoreName] خوش آمدید! 🎉 از امتیازات و تخفیف‌های ویژه بهره‌مند شوید."
```

### Promo Code Template

```
Default: "کد تخفیف [PromoCode] شما در [StoreName] با موفقیت ثبت شد! 🎟️"
With Promotion: "کد تخفیف [PromoCode] شما برای [PromotionTitle] در [StoreName] با موفقیت ثبت شد! 🎟️"
```

## 🔧 API Endpoints

### SMS Balance Management

- `GET /sms-balance/:storeId` - Get store SMS balance
- `POST /sms-balance/:storeId/recharge` - Recharge SMS balance
- `GET /sms-balance/:storeId/history` - Get recharge history
- `GET /sms-balance/stats` - Get SMS balance statistics (Admin)

### SMS Analytics

- `GET /sms-analytics/:storeId/stats` - Get store SMS statistics
- `GET /sms-analytics/:storeId/report` - Get SMS usage report
- `GET /sms-log/:storeId` - Get SMS log for store

### SMS Templates

- `GET /sms-templates` - Get available templates
- `POST /sms-templates/preview` - Preview template with parameters

## 🎨 Frontend Components

### Store SMS Dashboard

- **SMS Balance Card**: Display current balance and usage
- **Recharge Button**: Add SMS units to balance
- **Usage Chart**: Visual representation of SMS usage over time
- **Recent SMS Log**: List of recent SMS messages sent

### Admin SMS Management

- **All Stores Balance**: Overview of all stores' SMS balances
- **Low Balance Alerts**: Stores with insufficient SMS balance
- **SMS Statistics**: System-wide SMS usage analytics
- **Bulk Recharge**: Recharge multiple stores at once

## 🔒 Security & Validation

### SMS Balance Security

- **Store Isolation**: Stores can only manage their own SMS balance
- **Admin Override**: Admins can manage any store's SMS balance
- **Audit Trail**: All balance changes are logged with timestamps
- **Validation**: Prevent negative balances and invalid operations

### SMS Content Validation

- **Phone Number**: Must match Iranian mobile format (09xxxxxxxxx)
- **Message Length**: Maximum 1000 characters per message
- **Content Filtering**: Basic content validation and sanitization
- **Template Validation**: Ensure template parameters are valid

## 📈 Analytics & Reporting

### Store-Level Analytics

- **Total SMS Sent**: Count of SMS messages sent
- **SMS Units Used**: Total SMS units consumed
- **Success Rate**: Percentage of successfully sent SMS
- **Monthly Usage**: SMS usage trends over time
- **Cost Analysis**: SMS cost breakdown (when real provider integrated)

### System-Level Analytics

- **All Stores Overview**: Aggregate SMS usage across all stores
- **Low Balance Stores**: Stores requiring SMS balance attention
- **Usage Patterns**: Peak usage times and patterns
- **Performance Metrics**: System performance and reliability

## 🚀 Future Enhancements

### Phase 1: Real SMS Provider Integration

- **SMS Gateway**: Integrate with Iranian SMS providers (Kavenegar, SMS.ir)
- **Delivery Reports**: Real-time delivery status updates
- **Cost Management**: Actual SMS cost tracking and billing
- **Provider Failover**: Multiple SMS provider support

### Phase 2: Advanced Features

- **Scheduled SMS**: Send SMS at specific times
- **Bulk SMS Campaigns**: Send SMS to multiple customers
- **SMS Templates Editor**: Visual template editor for stores
- **A/B Testing**: Test different SMS templates for effectiveness

### Phase 3: AI & Optimization

- **Smart Templates**: AI-generated SMS templates based on store type
- **Optimal Timing**: AI-suggested best times to send SMS
- **Content Optimization**: AI-optimized message content for better engagement
- **Predictive Analytics**: Predict SMS usage patterns and suggest recharges

## 🔧 Configuration

### Environment Variables

```bash
# SMS Configuration
SMS_ENABLED=true
SMS_PROVIDER=kavenegar # or sms_ir, melipayamak
SMS_API_KEY=your_api_key
SMS_SENDER_NUMBER=your_sender_number
SMS_COST_PER_UNIT=150 # Toman per SMS unit
SMS_LOW_BALANCE_THRESHOLD=50 # Alert when balance below this
```

### Global SMS Settings

```typescript
const SMS_CONFIG = {
  SMS_UNIT_SIZE: 70, // Characters per SMS unit
  MAX_MESSAGE_LENGTH: 1000, // Maximum message length
  LOW_BALANCE_THRESHOLD: 50, // Low balance alert threshold
  DEFAULT_TEMPLATE: "welcome", // Default template type
  RETRY_ATTEMPTS: 3, // Number of retry attempts for failed SMS
  RETRY_DELAY: 5000, // Delay between retry attempts (ms)
};
```

## 📝 Usage Examples

### Store Owner Recharging SMS Balance

```typescript
// Recharge 1000 SMS units
await smsBalanceService.rechargeSmsBalance(
  "store_id_here",
  1000,
  "Monthly SMS recharge",
);
```

### Sending Welcome SMS

```typescript
// Automatically triggered during promo code registration
await smsService.sendWelcomeSms(
  "store_id_here",
  "customer_id_here",
  "promo_code_id_here",
  "09123456789",
  "فروشگاه من",
);
```

### Checking SMS Balance

```typescript
// Check if store can send a message
const balanceCheck = await smsBalanceService.checkSmsBalance(
  "store_id_here",
  2, // 2 SMS units needed
);

if (balanceCheck.canSend) {
  // Proceed with SMS sending
} else {
  // Handle insufficient balance
}
```

## 🐛 Error Handling

### Common Error Scenarios

1. **Insufficient Balance**: Store doesn't have enough SMS units
2. **Invalid Phone Number**: Phone number format is incorrect
3. **Message Too Long**: Message exceeds maximum length
4. **SMS Provider Error**: External SMS service is unavailable
5. **Store Not Found**: Store ID is invalid or store is deleted

### Error Response Format

```typescript
{
  success: false,
  error: 'INSUFFICIENT_SMS_BALANCE',
  message: 'موجودی پیامک کافی نیست. نیاز: 2 پیامک، موجود: 1 پیامک',
  details: {
    requiredUnits: 2,
    availableBalance: 1,
    storeId: 'store_id_here'
  }
}
```

## 📊 Performance Considerations

### Database Optimization

- **Indexes**: Optimized indexes for SMS log queries
- **Pagination**: Large SMS log queries are paginated
- **Archiving**: Old SMS logs can be archived for performance
- **Aggregation**: Pre-calculated statistics for faster reporting

### Caching Strategy

- **Store Balance Cache**: Cache store SMS balance for faster access
- **Template Cache**: Cache SMS templates to avoid repeated processing
- **Statistics Cache**: Cache SMS statistics for dashboard performance

### Rate Limiting

- **SMS Rate Limits**: Prevent SMS spam and abuse
- **Store Limits**: Limit SMS per store per day/hour
- **Customer Limits**: Limit SMS per customer per day

---

## 🎯 Implementation Status

### ✅ Completed

- SMS Unit Calculation Service
- Store Schema Enhancement
- SMS Log Schema
- SMS Templates Service
- SMS Balance Management Service
- SMS Service (Main)
- Integration with Promo Code Registration

### 🔄 In Progress

- SMS Analytics Service
- API Endpoints
- Frontend Components
- Testing and Validation

### 📋 Next Steps

- Real SMS Provider Integration
- Advanced Analytics Dashboard
- Mobile App Integration
- Performance Optimization

---

_This documentation will be updated as the SMS notification system evolves and new features are added._
