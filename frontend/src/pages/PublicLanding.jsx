import { useEffect, useState } from "react";
import API, { getAssetUrl } from "../api";
import "./PublicLanding.css";
import { Link } from "react-router-dom";
import ProfileGreeting from "../ProfileGreeting";
import LogoutButton from "../LogoutButton";

const PublicLanding = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await API.get("/auctions");
        setAuctions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setError("Unable to load auctions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Use the actual product image when available.
  const getImageUrl = (auction) => {
    const image = auction.productId?.images?.[0];

    if (!image) return null;

    return getAssetUrl(image);
  };

  const getProductTitle = (auction) =>
    auction.productId?.title || "Untitled Auction";

  const getCurrentBid = (auction) =>
    auction.highestBid ?? auction.startingBid ?? auction.reservePrice;

  const formatPrice = (price) =>
    price != null ? `₹${Number(price).toLocaleString("en-IN")}` : "Not available";

  const renderAuctionCard = (auction) => {
    const imageUrl = getImageUrl(auction);

    return (
      <div className="auction-card" key={auction._id}>
        {imageUrl ? (
          <img
            className="auction-image"
            src={imageUrl}
            alt={getProductTitle(auction)}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="image-placeholder">No image available</div>
        )}

        <h4>{getProductTitle(auction)}</h4>

        <p>Current Bid: {formatPrice(getCurrentBid(auction))}</p>

        <p>
          Ends:{" "}
          {auction.endTime
            ? new Date(auction.endTime).toLocaleString()
            : "Not specified"}
        </p>

        <p>Status: {auction.status || "Unknown"}</p>

        <Link to={`/auctions/${auction._id}`} className="cta">
          View Auction
        </Link>
      </div>
    );
  };

  const activeAuctions = auctions.filter((auction) => auction.status === "active");

  const featuredAuction =
    activeAuctions.find((auction) => auction.featured) || activeAuctions[0];

  const latestAuctions = [...activeAuctions]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.startTime || 0) -
        new Date(a.createdAt || a.startTime || 0)
    )
    .slice(0, 3);

  return (
    <div className="landing">
      <header className="header">
        <h1 className="logo">AuctionX</h1>

        <ProfileGreeting user={currentUser} />

        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/auctions">Auctions</Link></li>
            <li><a href="#how-it-works">How It Works</a></li>
            {currentUser ? (
              <li>
                <Link to={currentUser.role === "seller" ? "/seller-dashboard" : "/dashboard"}>
                  {currentUser.role === "seller" ? "Seller Dashboard" : "Dashboard"}
                </Link>
              </li>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
        </nav>
        <LogoutButton />
      </header>

      <section className="hero">
        <div className="banner">
          <img
            src={getAssetUrl("uploads/auction.jpg")}
            alt="AuctionX Banner"
          />
        </div>

        <div className="hero-content">
          <h2>Discover Exciting Auctions</h2>
          <p>Bid on exclusive items and find your next treasure!</p>
          <Link to="/auctions" className="cta">
            Browse Auctions
          </Link>
        </div>
      </section>

      <section className="featured">
        <h3>Featured Auction</h3>

        {loading ? (
          <p>Loading featured auction...</p>
        ) : error ? (
          <p>{error}</p>
        ) : featuredAuction ? (
          renderAuctionCard(featuredAuction)
        ) : (
          <p>No auctions available yet.</p>
        )}
      </section>

      <section className="how" id="how-it-works">
        <h3>How It Works</h3>
        <ol>
          <li>Register and sign up</li>
          <li>Browse auctions and place your bids</li>
          <li>Win and claim your item</li>
        </ol>
      </section>

      <section className="latest">
        <h3>Latest Auctions</h3>

        {loading ? (
          <p>Loading auctions...</p>
        ) : error ? (
          <p>{error}</p>
        ) : latestAuctions.length > 0 ? (
          <div className="auction-grid">
            {latestAuctions.map(renderAuctionCard)}
          </div>
        ) : (
          <p>No auctions available yet.</p>
        )}
      </section>

      <section className="categories">
        <h3>Popular Categories</h3>
        <div className="category-grid">
          {[...new Set(
            activeAuctions
              .map((auction) => auction.productId?.category)
              .filter(Boolean)
          )].slice(0, 4).map((category) => (
            <div className="category" key={category}>
              {category}
            </div>
          ))}

          {activeAuctions.every((auction) => !auction.productId?.category) && (
            <p>No categories available yet.</p>
          )}
        </div>
      </section>

      <section className="why">
        <h3>Why Choose Us?</h3>
        <ul>
          <li>Secure and trusted bidding</li>
          <li>Easy bidding process</li>
          <li>Discover items from sellers</li>
        </ul>
      </section>

      <section className="cta-section">
        <h3>Get Started</h3>
        <p>Sign up today and join the excitement!</p>
        <Link to="/register" className="cta">
          Sign Up
        </Link>
      </section>

      <footer>
        <ul>
          <li>About</li>
          <li>FAQ</li>
          <li>Contact</li>
          <li>Terms</li>
        </ul>
        <p>© 2026 AuctionX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicLanding;
