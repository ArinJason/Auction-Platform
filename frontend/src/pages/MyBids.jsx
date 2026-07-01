import { useEffect, useState } from "react";
import api from "../services/api";

function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      const res = await api.get("/bids/my-bids", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBids(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load bids");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-center mb-8">
        My Bid History
      </h1>

      {loading ? (
        <h2 className="text-center text-xl">
          Loading...
        </h2>
      ) : bids.length === 0 ? (
        <h2 className="text-center text-xl">
          No Bids Found
        </h2>
      ) : (
        <div className="grid gap-6">

          {bids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-semibold mb-3">
                {bid.auctionId?.productId?.title || "Auction"}
              </h2>

              <p>
                <strong>Bid Amount:</strong> ₹{bid.amount}
              </p>

              <p>
                <strong>Current Highest Bid:</strong> ₹
                {bid.auctionId?.currentHighestBid}
              </p>

              <p>
                <strong>Auction Ends:</strong>{" "}
                {new Date(
                  bid.auctionId?.endTime
                ).toLocaleString()}
              </p>

              <p className="text-gray-500 mt-3">
                Bid Placed On:{" "}
                {new Date(
                  bid.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyBids;