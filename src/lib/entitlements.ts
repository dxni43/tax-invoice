import type { Plan } from './whop-auth';

export function canAccessCreatorFeatures(plan: Plan): boolean {
  return plan === 'creator_pro' || plan === 'enterprise';
}

export function manualInvoiceLimit(plan: Plan): number | 'unlimited' {
  if (plan === 'member_starter') return 20;
  if (plan === 'member_pro') return 'unlimited';
  if (plan === 'creator_pro' || plan === 'enterprise') return 'unlimited';
  return 0;
}

export function canAccessWebhookLogs(plan: Plan): boolean {
  return plan === 'enterprise';
}

export function canAccessAdvancedReporting(plan: Plan): boolean {
  return plan === 'creator_pro' || plan === 'enterprise';
}

export function canAccessCustomBranding(plan: Plan): boolean {
  return plan === 'enterprise';
}

export function maxCustomersAllowed(plan: Plan): number | 'unlimited' {
  if (plan === 'member_starter') return 10;
  if (plan === 'member_pro') return 100;
  if (plan === 'creator_pro') return 500;
  if (plan === 'enterprise') return 'unlimited';
  return 0;
}

export function getPlanDisplayName(plan: Plan): string {
  switch (plan) {
    case 'member_starter':
      return 'Member Starter';
    case 'member_pro':
      return 'Member Pro';
    case 'creator_pro':
      return 'Creator Pro';
    case 'enterprise':
      return 'Enterprise';
    default:
      return 'Unknown Plan';
  }
}

export function getPlanLimitsText(plan: Plan): string {
  const invoiceLimit = manualInvoiceLimit(plan);
  const customerLimit = maxCustomersAllowed(plan);
  
  const invoiceText = invoiceLimit === 'unlimited' ? 'unlimited invoices' : `${invoiceLimit} invoices/month`;
  const customerText = customerLimit === 'unlimited' ? 'unlimited customers' : `${customerLimit} customers`;
  
  return `${invoiceText} • ${customerText}`;
}
