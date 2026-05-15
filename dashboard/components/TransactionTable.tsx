interface Transaction {
  id: string;
  type: 'revenue' | 'expense';
  amount: number;
  currency: string;
  timestamp: string;
  description: string;
  agentReasoning: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Time</th>
                <th className="text-left py-2">Type</th>
                <th className="text-right py-2">Amount</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="py-2 text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${tx.type === 'revenue' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-2 text-right font-semibold ${tx.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'revenue' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-2 text-gray-600">{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
