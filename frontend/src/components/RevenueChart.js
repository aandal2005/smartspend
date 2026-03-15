import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RevenueChart({ data }) {
  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl col-span-2">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Revenue</h2>

        <div className="flex gap-2">
          <button className="px-3 py-1 bg-indigo-600 rounded-lg text-sm">
            Yearly
          </button>
          <button className="px-3 py-1 bg-slate-700 rounded-lg text-sm">
            Monthly
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default RevenueChart;