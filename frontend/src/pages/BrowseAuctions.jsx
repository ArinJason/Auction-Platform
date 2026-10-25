import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { getAssetUrl } from "../api";
import "./BrowseAuctions.css";
import ProfileGreeting from "../ProfileGreeting";
import LogoutButton from "../LogoutButton";

const BrowseAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await API.get("/auctions");
        const active = Array.isArray(res.data)
          ? res.data.filter((auction) => auction.status === "active")
          : [];

        setAuctions(active);
      } catch (err) {
        console.error("Error fetching active auctions:", err);
        setError("Unable to load active auctions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const getImageUrl = (auction) => {
    const image = auction.productId?.images?.[0];

    if (!image) return null;
    if (image.startsWith("http")) return image;

    return getAssetUrl(image);
  };

  const getProductTitle = (auction) =>
    auction.productId?.title || "Untitled Auction";

  const getCurrentBid = (auction) =>
    auction.highestBid ?? auction.startingBid ?? auction.reservePrice;

  const formatPrice = (price) =>
    price != null ? `₹${Number(price).toLocaleString("en-IN")}` : "Not available";

  return (
    <div className="browse-auctions-page">
      <header className="browse-auctions-header">
        <Link to="/" className="browse-logo">
          AuctionX
        </Link>

        <ProfileGreeting user={currentUser} />

        <nav className="browse-nav">
          <Link to="/">Home</Link>
          <Link to="/auctions">Browse Auctions</Link>
          {currentUser ? (
            <Link to={currentUser.role === "seller" ? "/seller-dashboard" : "/dashboard"}>
              {currentUser.role === "seller" ? "Seller Dashboard" : "Dashboard"}
            </Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
        <LogoutButton />
      </header>

      <section className="browse-auctions-hero">
        <div className="browse-hero-content">
          <p className="eyebrow">Live Marketplace</p>
          <h1>Explore Active Auctions</h1>
          <p>
            Discover the latest live bids, premium listings, and unbeatable deals.
          </p>
        </div>
      </section>

      <main className="browse-auctions-content">
        {loading ? (
          <p className="browse-empty">Loading auctions...</p>
        ) : error ? (
          <p className="browse-empty">{error}</p>
        ) : auctions.length === 0 ? (
          <p className="browse-empty">No active auctions are available right now.</p>
        ) : (
          <div className="browse-auction-grid">
            {auctions.map((auction) => {
              const imageUrl = getImageUrl(auction);

              return (
                <div className="browse-auction-card" key={auction._id}>
                  {imageUrl ? (
                    <img
                      className="browse-auction-image"
                      src={imageUrl}
                      alt={getProductTitle(auction)}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="browse-image-placeholder">No image available</div>
                  )}

                  <div className="browse-auction-body">
                    <h3>{getProductTitle(auction)}</h3>
                    <p className="browse-bid">Current Bid: {formatPrice(getCurrentBid(auction))}</p>
                    <p>
                      Ends: {auction.endTime ? new Date(auction.endTime).toLocaleString() : "Not specified"}
                    </p>

                    <Link to={`/auctions/${auction._id}`} className="browse-view-button">
                      View Auction
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowseAuctions;
