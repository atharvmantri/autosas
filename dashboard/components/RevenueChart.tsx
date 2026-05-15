interface RevenueChartProps {
  data: { day: string; revenue: number; expenses: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.expenses)), 1);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-bold mb-4">Revenue vs Expenses</h3>
      <div className="flex items-end space-x-2 h-40">
        {data.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center">
            <div className="w-full flex space-x-1 items-end h-32">
              <div
                className="flex-1 bg-green-500 rounded-t"
                style={{ height: `${(d.revenue / maxValue) * 100}%` }}
              />
              <div
                className="flex-1 bg-red-400 rounded-t"
                style={{ height: `${(d.expenses / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 mt-1">{d.day}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-6 mt-4 text-sm">
        <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded mr-2" /> Revenue</span>
        <span className="flex items-center"><span className="w-3 h-3 bg-red-400 rounded mr-2" /> Expenses</span>
      </div>
    </div>
  );
}
