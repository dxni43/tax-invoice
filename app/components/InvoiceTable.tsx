'use client';

interface InvoiceTableProps {
  itemList: Item[];
}

export default function InvoiceTable({ itemList }: InvoiceTableProps) {
  const total = itemList.reduce((sum, item) => sum + item.price, 0);

  if (itemList.length === 0) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        No items added yet. Add items above to see them here.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-4">Invoice Items</h4>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Item</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Cost</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {itemList.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">${item.cost.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                Total:
              </td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                ${total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
