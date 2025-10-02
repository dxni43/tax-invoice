# Whop Plan Detection & Feature Gating

This implementation provides comprehensive Whop plan detection and feature gating for the Next.js invoice application.

## 🚀 Features Implemented

### 1. Environment Validation (`src/config/env.ts`)
- Validates required Whop pass IDs using Zod schema
- Throws clear error messages for missing environment variables
- Never exposes secrets client-side

### 2. Whop Authentication (`src/lib/whop-auth.ts`)
- `requireWhopContext()`: Reads `x-whop-user-token` header server-side
- Fetches user data from Whop API with active access passes
- Maps access passes to roles and plans with priority system
- Returns typed `WhopContext` with user info and permissions

### 3. Entitlements System (`src/lib/entitlements.ts`)
- `canAccessCreatorFeatures()`: Creator feature access control
- `manualInvoiceLimit()`: Invoice creation limits per plan
- Additional helpers for customers, branding, reporting, etc.

### 4. Access Control Components (`src/components/`)
- `AccessRequired`: Clean UI for users without valid plans
- `OpenInWhopRequired`: For users accessing outside Whop
- `WhopProvider`: React context for client-side plan access

### 5. Protected Layout (`app/(app)/layout.tsx`)
- Server-side authentication check
- Automatic error handling for invalid tokens/plans
- Context provider for child components

### 6. Feature Gating Examples
- **Dashboard**: Role-based rendering with plan limits display
- **Navigation**: Creator-only items hidden for members
- **Invoice Creation**: Plan-based access control

## 🛠 Setup Instructions

### 1. Environment Variables
Create `.env.local` with your Whop pass IDs:

```env
# Required: Whop access pass IDs from your developer dashboard
WHOP_PASS_MEMBER_STARTER_ID=pass_xxx
WHOP_PASS_MEMBER_PRO_ID=pass_xxx
WHOP_PASS_CREATOR_PRO_ID=pass_xxx
WHOP_PASS_ENTERPRISE_ID=pass_xxx

# Optional: For webhook verification
WHOP_APP_SECRET=your_app_secret
```

### 2. Plan Hierarchy
Priority order (highest to lowest):
1. **Enterprise** → `creator` role, `enterprise` plan
2. **Creator Pro** → `creator` role, `creator_pro` plan  
3. **Member Pro** → `member` role, `member_pro` plan
4. **Member Starter** → `member` role, `member_starter` plan

### 3. Usage in New Pages

For any new protected page, wrap it in the `(app)` route group:

```tsx
'use client';
import { useWhopContext } from '@/src/components/whop-provider';
import { canAccessCreatorFeatures } from '@/src/lib/entitlements';

export default function MyPage() {
  const { role, plan } = useWhopContext();
  const isCreator = canAccessCreatorFeatures(plan);
  
  return (
    <div>
      {isCreator ? <CreatorContent /> : <MemberContent />}
    </div>
  );
}
```

## 📊 Plan Features

| Feature | Member Starter | Member Pro | Creator Pro | Enterprise |
|---------|----------------|------------|-------------|------------|
| Invoice Limit | 20/month | Unlimited | Unlimited | Unlimited |
| Customer Limit | 10 | 100 | 500 | Unlimited |
| Creator Features | ❌ | ❌ | ✅ | ✅ |
| Advanced Reporting | ❌ | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ❌ | ✅ |
| Webhook Logs | ❌ | ❌ | ❌ | ✅ |

## 🔒 Security Notes

- All authentication happens server-side
- Environment variables are validated on startup
- No secrets exposed to client-side code
- Graceful error handling for API failures
- Runtime set to `nodejs` for server utilities

## 🧪 Testing Access States

### Valid Whop Token
- User has active access pass → Normal app access
- User has no valid plan → AccessRequired component
- Creator vs Member → Different UI/features

### Invalid/Missing Token  
- No `x-whop-user-token` → OpenInWhopRequired component
- Invalid token → Error message with reload option

### Network Issues
- Whop API down → Friendly error message
- Token expired → Clear reload instruction

The implementation is production-ready with proper error boundaries, type safety, and clean separation of concerns.
