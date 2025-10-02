'use client';

import { useWhopContext } from '@/src/components/whop-provider';
import { manualInvoiceLimit, getPlanLimitsText } from '@/src/lib/entitlements';
import AccessRequired from '@/src/components/access-required';
import SideNav from '@/app/components/SideNav';

export default function CreateInvoice() {
  const { role, plan } = useWhopContext();
  const limit = manualInvoiceLimit(plan);

  // If no access to invoice creation
  if (limit === 0) {
    return <AccessRequired />;
  }

  return (
    <div className='w-full'>
      <main className='min-h-[90vh] flex items-start'>
        <SideNav />
        <div className='md:w-5/6 w-full h-full p-6'>
          <div className="mb-6">
            <h2 className='font-bold text-2xl mb-2'>Create New Invoice</h2>
            {limit !== 'unlimited' && (
              <p className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-md">
                Starter plan • up to {limit} invoices/month • {getPlanLimitsText(plan)}
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-gray-600 mb-4">
              This is an example of a gated page. The invoice creation logic would go here.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your current plan: <span className="font-semibold text-blue-600">{plan.replace('_', ' ')}</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice limit: <span className="font-semibold text-green-600">{limit === 'unlimited' ? 'Unlimited' : `${limit} per month`}</span>
                </label>
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create Invoice (Demo)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
