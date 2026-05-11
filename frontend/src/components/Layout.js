import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-5">
        <h2 className="text-xl font-bold mb-6">📊 Analytics</h2>
        
        <ul className="space-y-4">
          <li>
            <Link to="/" className="hover:text-blue-400">
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/products" className="hover:text-blue-400">
              Products
            </Link>
          </li>

          <li>
            <Link to="/sales" className="hover:text-blue-400">
              Sales
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}