interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  color,
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-2xl shadow-lg p-6 text-white ${color}
      hover:scale-105 transition duration-300`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-medium">{title}</p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="text-5xl">
          {icon}
        </div>
      </div>
    </div>
  );
}