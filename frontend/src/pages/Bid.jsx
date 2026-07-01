import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Bid() {
  const { auctionId } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        `/bids/${auctionId}`,
        {
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Bid Placed Successfully!");

      navigate("/my-bids");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to place bid"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Place Your Bid
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-semibold">
              Bid Amount
            </label>

            <input
              type="number"
              placeholder="Enter Bid Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full border rounded p-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Place Bid
          </button>

        </form>

      </div>

    </div>
  );
}

export default Bid;