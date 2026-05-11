export default function InsightCard({ title, value, type }) {
  const colors = {
    success: "bg-green-500/10 text-green-400",
    warning: "bg-yellow-500/10 text-yellow-400",
    danger: "bg-red-500/10 text-red-400",
    info: "bg-blue-500/10 text-blue-400"
  };

  return (
    <div className={`p-5 rounded-2xl ${colors[type]} w-full`}>
      <p className="text-sm opacity-70">{title}</p>
      <h2 className="text-lg font-bold mt-1">{value}</h2>
    </div>
  );
}