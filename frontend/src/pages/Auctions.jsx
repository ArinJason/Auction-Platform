import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const res = await api.get("/auctions");
      setAuctions(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load auctions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Live Auctions
        </h1>

        {user?.role === "seller" && (
          <Link
            to="/create-auction"
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Create Auction
          </Link>
        )}
      </div>

      {loading ? (
        <h2 className="text-center text-xl">
          Loading Auctions...
        </h2>
      ) : auctions.length === 0 ? (
        <h2 className="text-center text-xl">
          No Auctions Found
        </h2>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {auctions.map((auction) => (
            <div
              key={auction._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >

              <img
                src={auction.productId?.image}
                alt={auction.productId?.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">

                <h2 className="text-xl font-bold mb-2">
                  {auction.productId?.title}
                </h2>

                <p className="text-gray-600 mb-3">
                  {auction.productId?.description}
                </p>

                <p className="font-semibold">
                  Starting Price:
                  <span className="text-blue-600">
                    {" "}
                    ₹{auction.productId?.startingPrice}
                  </span>
                </p>

                <p className="font-semibold mt-2">
                  Highest Bid:
                  <span className="text-green-600">
                    {" "}
                    ₹{auction.currentHighestBid}
                  </span>
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Ends:
                  {" "}
                  {new Date(
                    auction.endTime
                  ).toLocaleString()}
                </p>

                {user?.role === "user" && (
                  <Link
                    to={`/bid/${auction._id}`}
                    className="block mt-5 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Place Bid
                  </Link>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Auctions;