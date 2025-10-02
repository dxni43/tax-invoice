'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWhopContext } from '@/src/components/whop-provider';
import { canAccessCreatorFeatures, getPlanDisplayName } from '@/src/lib/entitlements';

export default function SideNav() {
  const pathname = usePathname();
  const { role, plan } = useWhopContext();
  const isCreator = canAccessCreatorFeatures(plan);

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '🏠',
      showForAll: true,
    },
    {
      name: 'Customers',
      href: '/customers',
      icon: '👥',
      showForAll: true,
    },
    {
      name: 'History',
      href: '/history',
      icon: '📋',
      showForAll: true,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: '⚙️',
      showForAll: true,
    },
    {
      name: 'Creator Dashboard',
      href: '/creator-dashboard',
      icon: '🚀',
      showForAll: false,
      creatorOnly: true,
    },
    {
      name: 'Webhook Logs',
      href: '/webhook-logs',
      icon: '🔗',
      showForAll: false,
      creatorOnly: true,
    },
  ];

  const visibleItems = menuItems.filter(item => 
    item.showForAll || (item.creatorOnly && isCreator)
  );

  return (
    <nav className="md:w-1/6 w-full bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Invoicer</h1>
        <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
          {getPlanDisplayName(plan)}
        </div>
      </div>

      <ul className="space-y-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Role: {role}</div>
          <div>Plan: {plan}</div>
        </div>
      </div>
    </nav>
  );
}
