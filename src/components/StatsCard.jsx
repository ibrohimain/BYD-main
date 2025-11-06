// src/components/StatsCard.jsx (ranglar yangilangan)
export default function StatsCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300",
    yellow: "bg-accent-100 text-accent-700 dark:bg-accent-900/20 dark:text-accent-300",
    green: "bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{title}</p>
          <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}