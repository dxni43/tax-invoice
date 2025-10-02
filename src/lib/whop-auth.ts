import { env } from '@/src/config/env';

export const runtime = 'nodejs';

export type Plan = 'member_starter' | 'member_pro' | 'creator_pro' | 'enterprise';
export type Role = 'member' | 'creator';

export type WhopContext = {
  userId: string;
  role: Role;
  plan: Plan;
  accessIds: string[]; // active pass ids
};

// Whop API response types
interface WhopAccessPass {
  id: string;
  status: 'active' | 'expired' | 'cancelled';
}

interface WhopUser {
  id: string;
  access_passes: WhopAccessPass[];
}

interface WhopMeResponse {
  user: WhopUser;
}

export function mapAccessToPlan(accessIds: Set<string>): { role: Role; plan: Plan } {
  // Check if environment variables are configured
  if (!env.WHOP_PASS_ENTERPRISE_ID || !env.WHOP_PASS_CREATOR_PRO_ID || 
      !env.WHOP_PASS_MEMBER_PRO_ID || !env.WHOP_PASS_MEMBER_STARTER_ID) {
    throw new Error('Whop pass IDs not configured. Please set environment variables on Vercel.');
  }

  // Priority order: enterprise > creator_pro > member_pro > member_starter
  if (accessIds.has(env.WHOP_PASS_ENTERPRISE_ID)) {
    return { role: 'creator', plan: 'enterprise' };
  }
  
  if (accessIds.has(env.WHOP_PASS_CREATOR_PRO_ID)) {
    return { role: 'creator', plan: 'creator_pro' };
  }
  
  if (accessIds.has(env.WHOP_PASS_MEMBER_PRO_ID)) {
    return { role: 'member', plan: 'member_pro' };
  }
  
  if (accessIds.has(env.WHOP_PASS_MEMBER_STARTER_ID)) {
    return { role: 'member', plan: 'member_starter' };
  }
  
  throw new Error('No valid plan. Please purchase an access pass.');
}

export async function requireWhopContext(headers: Headers): Promise<WhopContext> {
  const token = headers.get('x-whop-user-token');
  
  if (!token) {
    throw new Error('Open this app inside Whop (missing x-whop-user-token)');
  }

  try {
    // Fetch user data from Whop API
    const response = await fetch('https://api.whop.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid Whop token. Please refresh and try again.');
      }
      throw new Error(`Whop API error: ${response.status}`);
    }

    const data: WhopMeResponse = await response.json();
    const user = data.user;

    // Collect active access pass IDs
    const activeAccessIds = new Set(
      user.access_passes
        .filter(pass => pass.status === 'active')
        .map(pass => pass.id)
    );

    // Map access passes to role and plan
    const { role, plan } = mapAccessToPlan(activeAccessIds);

    return {
      userId: user.id,
      role,
      plan,
      accessIds: Array.from(activeAccessIds),
    };
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw our custom errors
      if (error.message.includes('No valid plan') || 
          error.message.includes('Invalid Whop token') ||
          error.message.includes('Open this app inside Whop')) {
        throw error;
      }
    }
    
    // For network errors or other issues
    console.error('Whop API error:', error);
    throw new Error('We could not verify your plan. Please reload or open this app via Whop.');
  }
}
