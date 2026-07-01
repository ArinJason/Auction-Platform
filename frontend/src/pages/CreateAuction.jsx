import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateAuction() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auctions", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Auction Created Successfully!");

      navigate("/auctions");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to create auction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Create Auction
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-semibold">
              Select Product
            </label>

            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            >
              <option value="">
                -- Select Product --
              </option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Auction End Time
            </label>

            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
          >
            {loading
              ? "Creating Auction..."
              : "Create Auction"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateAuction;