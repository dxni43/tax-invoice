import { headers } from 'next/headers';
import { requireWhopContext } from '@/src/lib/whop-auth';
import { WhopProvider } from '@/src/components/whop-provider';
import AccessRequired, { OpenInWhopRequired } from '@/src/components/access-required';

// Force dynamic rendering for routes using headers()
export const dynamic = 'force-dynamic';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  try {
    const headersList = await headers();
    const whopContext = await requireWhopContext(headersList);

    return (
      <WhopProvider whopContext={whopContext}>
        {children}
      </WhopProvider>
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Open this app inside Whop')) {
        return <OpenInWhopRequired />;
      }
      
      if (error.message.includes('No valid plan')) {
        return <AccessRequired />;
      }
    }

    // For other errors (network issues, etc.)
    console.error('Whop context error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We could not verify your plan. Please reload or open this app via Whop.
          </p>
          <a
            href="."
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload
          </a>
        </div>
      </div>
    );
  }
}
