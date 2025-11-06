export default function StatsCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700"
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}