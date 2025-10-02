'use client';

interface CustomersTableProps {
  customers: Customer[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  if (customers.length === 0) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        No customers yet. Add your first customer above.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-4">Your Customers</h4>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Address</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer, index) => (
              <tr key={customer.user_id || index}>
                <td className="px-4 py-3 text-sm text-gray-900">{customer.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{customer.email}</td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                  {customer.address}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
