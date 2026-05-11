import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "./Layout";
import SalesChart from "./SalesChart";

export default function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const normalizeInsights = (data) => {
    const result = {};

    Object.keys(data || {}).forEach(metric => {
      const products = data[metric] || {};

      Object.keys(products).forEach(productId => {
        if (!result[productId]) result[productId] = {};
        result[productId][metric] = products[productId];
      });
    });

    return result;
  };

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/insights");

      let data = res.data;

      // fallback array
      if (Array.isArray(data)) {
        const obj = {};
        data.forEach(item => {
          const id = item.product_id || item.id;
          obj[id] = {
            revenue: item.revenue || 0,
            profit: item.profit || 0,
            cost: item.cost || 0,
            quantity: item.quantity || 0
          };
        });
        data = obj;
      }

      const normalized = normalizeInsights(data);
      setInsights(normalized);

    } catch (err) {
      console.error(err);
      setError("Error loading insights");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // LOADING STATE (SKELETON SIMPLE)
  // --------------------------

  if (loading) {
    return (
      <Layout>
        <div className="p-6 space-y-4">

          <div className="h-8 w-64 bg-gray-700 animate-pulse rounded" />

          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-700 animate-pulse rounded-2xl" />
            <div className="h-24 bg-gray-700 animate-pulse rounded-2xl" />
            <div className="h-24 bg-gray-700 animate-pulse rounded-2xl" />
          </div>

          <div className="h-64 bg-gray-700 animate-pulse rounded-2xl" />

        </div>
      </Layout>
    );
  }

  // --------------------------
  // ERROR STATE
  // --------------------------

  if (error) {
    return (
      <Layout>
        <div className="p-6 text-red-400">
          {error}
        </div>
      </Layout>
    );
  }

  // --------------------------
  // EMPTY STATE
  // --------------------------

  if (!insights || Object.keys(insights).length === 0) {
    return (
      <Layout>
        <div className="p-6 text-gray-400">
          No data yet. Add products and sales.
        </div>
      </Layout>
    );
  }

  const entries = Object.entries(insights);

  const totalRevenue = entries.reduce(
    (acc, [, val]) => acc + (val?.revenue || 0),
    0
  );

  const totalProfit = entries.reduce(
    (acc, [, val]) => acc + (val?.profit || 0),
    0
  );

  const best = entries.reduce((max, curr) =>
    (curr[1]?.profit || 0) > (max[1]?.profit || 0) ? curr : max
  );

  const worst = entries.reduce((min, curr) =>
    (curr[1]?.profit || 0) < (min[1]?.profit || 0) ? curr : min
  );

  const enriched = entries.map(([id, data]) => {
    const revenue = data?.revenue || 0;
    const profit = data?.profit || 0;

    const margin = revenue > 0 ? profit / revenue : 0;

    let level = "Mid";
    let color = "text-yellow-400";

    if (margin > 0.4) {
      level = "High";
      color = "text-green-400";
    } else if (margin < 0.2) {
      level = "Low";
      color = "text-red-400";
    }

    return { id, revenue, profit, margin, level, color };
  });

  const ranking = [...enriched].sort((a, b) => b.revenue - a.revenue);

  const inefficient = enriched
    .filter(p => p.revenue > 80000 && p.margin < 0.25)
    .sort((a, b) => b.revenue - a.revenue)[0];

  // --------------------------
  // UI
  // --------------------------

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          📊 Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 p-5 rounded-2xl">
            <p className="text-gray-400">Revenue</p>
            <h2 className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </h2>
          </div>
          <div className="bg-gray-800 p-5 rounded-2xl">
            <p className="text-gray-400">Profit</p>
            <h2 className="text-2xl font-bold">
              ${totalProfit.toLocaleString()}
            </h2>
          </div>
          <div className="bg-gray-800 p-5 rounded-2xl">
            <p className="text-gray-400">Products</p>
            <h2 className="text-2xl font-bold">
              {entries.length}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-5 rounded-2xl">
            <h3 className="font-bold mb-2">🔥 Best product</h3>
            <p>ID: {best?.[0]}</p>
            <p>Profit: ${best?.[1]?.profit || 0}</p>
          </div>
          <div className="bg-gray-800 p-5 rounded-2xl">
            <h3 className="font-bold mb-2">⚠️ Worst performance</h3>
            <p>ID: {worst?.[0]}</p>
            <p>Profit: ${worst?.[1]?.profit || 0}</p>
          </div>
          {inefficient && (
            <div className="bg-gray-800 p-5 rounded-2xl col-span-2">
              <h3 className="font-bold mb-2">
                🚨 Improvement opportunity
              </h3>
              <p>
                Product {inefficient.id} has high revenue but low profitability.
              </p>
              <p className="text-red-400">
                Reccomentaion: Review product.
              </p>
            </div>
          )}
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl mb-6">
          <h3 className="font-bold mb-4">
            📊 Products efficiency
          </h3>
          {enriched.map(p => (
            <div
              key={p.id}
              className="flex justify-between py-2 border-b border-gray-700"
            >
              <span>Product {p.id}</span>
              <span className={p.color}>
                {(p.margin * 100).toFixed(1)}% ({p.level})
              </span>
            </div>
          ))}
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl mb-6">
          <h3 className="font-bold mb-4">
            🏆 Ranking per profit
          </h3>
          {ranking.map((p, i) => (
            <div
              key={p.id}
              className="flex justify-between py-2 border-b border-gray-700"
            >
              <span>#{i + 1} Product {p.id}</span>
              <span>${p.revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <SalesChart data={insights} />
      </div>
    </Layout>
  );
}