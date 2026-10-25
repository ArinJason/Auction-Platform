import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API, { getAssetUrl } from "../api";
import "./AuctionDetails.css";
import ProfileGreeting from "../ProfileGreeting";
import LogoutButton from "../LogoutButton";

const AuctionDetails = () => {
  const { id } = useParams();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBidForm, setShowBidForm] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/auctions/${id}`);
        setAuction(res.data);
      } catch (err) {
        console.error("Error fetching auction:", err);
        setError(
          err.response?.status === 404
            ? "Auction not found."
            : "Unable to load auction details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  if (loading) {
    return <p className="auction-message">Loading auction details...</p>;
  }

  if (error || !auction) {
    return (
      <div className="auction-message">
        <p>{error || "Auction not found."}</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const product = auction.productId;

  const image = product?.images?.[0];

  const imageUrl = getAssetUrl(image);

  const currentBid =
    auction.highestBid ??
    auction.startingBid ??
    auction.reservePrice;

  const handlePlaceBidClick = () => {
    const token = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !savedUser) {
      window.location.href = "/login?message=Please log in as a buyer to place a bid.";
      return;
    }

    if (savedUser.role !== "buyer") {
      window.location.href = "/login?message=You need to log in as a buyer to place a bid.";
      return;
    }

    setShowBidForm(true);
    setBidMessage("");
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!bidAmount || Number(bidAmount) <= 0) {
      setBidMessage("Please enter a valid bid amount.");
      return;
    }

    try {
      setSubmittingBid(true);
      setBidMessage("");

      const res = await API.post("/bids", {
        auctionId: auction._id,
        bidAmount: Number(bidAmount),
      });

      setBidMessage(res.data?.message || "Bid placed successfully!");
      setBidAmount("");
      setShowBidForm(false);

      const refreshed = await API.get(`/auctions/${id}`);
      setAuction(refreshed.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to place bid right now.";
      setBidMessage(message);

      try {
        const refreshed = await API.get(`/auctions/${id}`);
        setAuction(refreshed.data);
      } catch (refreshError) {
        console.error("Error refreshing auction after rejected bid:", refreshError);
      }
    } finally {
      setSubmittingBid(false);
    }
  };

  return (
    <div className="auction-details-page">
      <header className="auction-details-header">
        <Link to="/" className="auction-logo">
          AuctionX
        </Link>

        <ProfileGreeting user={currentUser} />

        <Link to="/auctions" className="back-link">
          Browse Auctions
        </Link>
        <LogoutButton />
      </header>

      <main className="auction-details-container">
        <div className="auction-details-image">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product?.title || "Auction item"}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="no-auction-image">
              No image available
            </div>
          )}
        </div>

        <div className="auction-details-info">
          <span className={`auction-status ${auction.status}`}>
            {auction.status || "Unknown"}
          </span>

          <h1>{product?.title || "Untitled Auction"}</h1>

          <p className="auction-category">
            Category: {product?.category || "Uncategorized"}
          </p>

          <p className="auction-description">
            {product?.description || "No description available."}
          </p>

          <div className="auction-price-box">
            <p>Current Highest Bid</p>
            <h2>
              {currentBid != null
                ? `₹${Number(currentBid).toLocaleString("en-IN")}`
                : "No bids yet"}
            </h2>

            {auction.reservePrice != null && (
              <p>
                Reserve Price: ₹
                {Number(auction.reservePrice).toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <div className="auction-detail-row">
            <span>Auction Type</span>
            <strong>{auction.auctionType || "Standard"}</strong>
          </div>

          <div className="auction-detail-row">
            <span>Starting Bid</span>
            <strong>
              {auction.startingBid != null
                ? `₹${Number(auction.startingBid).toLocaleString("en-IN")}`
                : "Not specified"}
            </strong>
          </div>

          <div className="auction-detail-row">
            <span>Bid Increment</span>
            <strong>
              {auction.bidIncrement != null
                ? `₹${Number(auction.bidIncrement).toLocaleString("en-IN")}`
                : "Not specified"}
            </strong>
          </div>

          <div className="auction-detail-row">
            <span>Ends At</span>
            <strong>
              {auction.endTime
                ? new Date(auction.endTime).toLocaleString()
                : "Not specified"}
            </strong>
          </div>

          {!["closed"].includes(auction.status) && (
            <>
              <button
                className="place-bid-button"
                onClick={handlePlaceBidClick}
              >
                Place a Bid
              </button>

              {showBidForm && (
                <form className="bid-form" onSubmit={handleBidSubmit}>
                  <label htmlFor="bidAmount">Your Bid</label>
                  <input
                    id="bidAmount"
                    type="number"
                    min="1"
                    step="1"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                  />

                  <button type="submit" className="submit-bid-button" disabled={submittingBid}>
                    {submittingBid ? "Submitting..." : "Submit Bid"}
                  </button>

                  {bidMessage && (
                    <p className="bid-message">{bidMessage}</p>
                  )}
                </form>
              )}
            </>
          )}

          <Link to="/" className="back-home-link">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AuctionDetails;
