interface BusinessCardProps {
  name: string;
  status: string;
  revenue: number;
  expenses: number;
  deployedUrl: string | null;
}

export default function BusinessCard({ name, status, revenue, expenses, deployedUrl }: BusinessCardProps) {
  const netProfit = revenue - expenses;
  const healthColor = netProfit > 0 ? 'green' : netProfit === 0 ? 'yellow' : 'red';
  const statusColors: Record<string, string> = {
    planning: 'bg-gray-500',
    researching: 'bg-blue-500',
    building: 'bg-purple-500',
    marketing: 'bg-orange-500',
    live: 'bg-green-500',
    'winding-down': 'bg-red-500',
    closed: 'bg-gray-700',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold">{name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColors[status] || 'bg-gray-500'}`}>
          {status}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Revenue</span>
          <span className="text-green-600 font-semibold">${revenue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Expenses</span>
          <span className="text-red-600 font-semibold">${expenses.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-500">Net Profit</span>
          <span className={`font-bold text-${healthColor}-600`}>${netProfit.toFixed(2)}</span>
        </div>
      </div>
      {deployedUrl && (
        <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block text-blue-600 text-sm hover:underline">
          Visit SaaS →
        </a>
      )}
    </div>
  );
}
