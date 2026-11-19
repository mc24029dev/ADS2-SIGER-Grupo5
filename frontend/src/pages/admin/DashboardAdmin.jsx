import { Users, Calendar, Ticket, Activity } from "lucide-react";

export default function DashboardAdmin() {
  const stats = [
    { label: "Usuarios Totales", value: "12", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Eventos Activos", value: "4", icon: Calendar, color: "text-green-600", bg: "bg-green-100" },
    { label: "Reservaciones", value: "12", icon: Ticket, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Asistencias", value: "5", icon: Activity, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Resumen General</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}