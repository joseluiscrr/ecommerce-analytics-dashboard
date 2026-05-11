import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function SalesChart({ data }) {
  const chartData = Object.keys(data).map(key => ({
    product: key,
    revenue: data[key].revenue
  }));

  return (
    <div className="bg-gray-800 p-5 rounded-2xl shadow-md mt-6">
      <h3 className="mb-4">Profit per product</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="product" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}