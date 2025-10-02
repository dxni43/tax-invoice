import { z } from 'zod';

const envSchema = z.object({
  WHOP_PASS_MEMBER_STARTER_ID: z.string().min(1, 'WHOP_PASS_MEMBER_STARTER_ID is required'),
  WHOP_PASS_MEMBER_PRO_ID: z.string().min(1, 'WHOP_PASS_MEMBER_PRO_ID is required'),
  WHOP_PASS_CREATOR_PRO_ID: z.string().min(1, 'WHOP_PASS_CREATOR_PRO_ID is required'),
  WHOP_PASS_ENTERPRISE_ID: z.string().min(1, 'WHOP_PASS_ENTERPRISE_ID is required'),
  WHOP_APP_SECRET: z.string().optional(),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(e => e.path.join('.') + ': ' + e.message).join('\n');
      throw new Error(
        `Missing or invalid environment variables:\n${missingVars}\n\nPlease set these environment variables in your .env.local file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
