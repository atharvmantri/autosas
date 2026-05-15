export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-sm text-gray-500">Subscription</h3>
            <p className="text-2xl font-bold text-green-600">Active</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-sm text-gray-500">Usage</h3>
            <p className="text-2xl font-bold">0 / 100</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-sm text-gray-500">Plan</h3>
            <p className="text-2xl font-bold">Free</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-500">No activity yet.</p>
        </div>
      </div>
    </div>
  );
}
