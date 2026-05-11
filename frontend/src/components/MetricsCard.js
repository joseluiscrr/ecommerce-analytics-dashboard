export default function MetricsCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-5 rounded-2xl shadow-md w-60">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}