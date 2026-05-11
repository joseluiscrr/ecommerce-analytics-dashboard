import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Sales() {
  const [products, setProducts] = useState([]);

  const [sales, setSales] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    quantity: ""
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await API.get("/sales/");
      setSales(res.data);
    } catch (err) {
      console.error("Error loading sales:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addSale = async () => {
    if (!form.productId || !form.quantity) return;

    try {
      await API.post("/sales/", null, {
        params: {
          product_id: Number(form.productId),
          quantity: Number(form.quantity)
        }
      });

      fetchSales();

      setForm({
        productId: "",
        quantity: ""
      });

    } catch (err) {
      console.error("Error posting sale:", err);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          💰 Sales
        </h1>
        <div className="bg-gray-800 p-5 rounded-2xl mb-6">

          <h2 className="mb-4 font-bold">
            Register sale
          </h2>
          <div className="flex gap-4 flex-wrap">
            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              className="p-2 bg-gray-700 rounded"
            >
              <option value="">Select product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="p-2 bg-gray-700 rounded"
            />
            <button
              onClick={addSale}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Register
            </button>
          </div>
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl">
          <h2 className="mb-4 font-bold">
            Record
          </h2>
          {sales.map(s => (
            <div
              key={s.id}
              className="flex justify-between py-2 border-b border-gray-700"
            >
              <span>Product {s.product_id}</span>
              <span>Quantity: {s.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}