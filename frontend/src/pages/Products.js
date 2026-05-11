import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    cost: "",
    price: ""
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addProduct = async () => {
    if (!form.name || !form.cost || !form.price) return;

    try {
      const res = await API.post("/products/", null, {
        params: {
          name: form.name,
          cost: Number(form.cost),
          price: Number(form.price)
        }
      });

      setProducts([...products, res.data]);

      setForm({
        name: "",
        cost: "",
        price: ""
      });

    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">📦 Products</h1>
        <div className="bg-gray-800 p-5 rounded-2xl mb-6">
          <h2 className="mb-4 font-bold">Add product</h2>
          <div className="flex gap-4 flex-wrap">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700"
            />
            <input
              name="cost"
              placeholder="Cost"
              type="number"
              value={form.cost}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700"
            />
            <input
              name="price"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700"
            />
            <button
              onClick={addProduct}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl">
          <h2 className="mb-4 font-bold">List of products</h2>
          {products.map(p => (
            <div
              key={p.id}
              className="flex justify-between border-b border-gray-700 py-2"
            >
              <span>{p.name}</span>
              <span>Cost: ${p.cost}</span>
              <span>Price: ${p.price}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}