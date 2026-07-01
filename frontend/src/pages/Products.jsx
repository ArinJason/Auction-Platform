import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Products
        </h1>

        {user?.role === "seller" && (
          <Link
            to="/add-product"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </Link>
        )}

      </div>

      {loading ? (
        <h2 className="text-center text-xl">
          Loading Products...
        </h2>
      ) : products.length === 0 ? (
        <h2 className="text-center text-xl">
          No Products Found
        </h2>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Products;