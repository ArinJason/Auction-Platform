import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./BuyerDashboard.css";
import ProfileGreeting from "../ProfileGreeting";
import LogoutButton from "../LogoutButton";

const BuyerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWonAuction, setSelectedWonAuction] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "buyer") {
      navigate(currentUser.role === "seller" ? "/seller-dashboard" : "/login");
      return;
    }

    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [auctionsResponse, bidsResponse] = await Promise.all([
          API.get("/auctions"),
          API.get("/bids/user"),
        ]);

        if (!mounted) return;
        setAuctions(Array.isArray(auctionsResponse.data) ? auctionsResponse.data : []);
        setBids(Array.isArray(bidsResponse.data) ? bidsResponse.data : []);
      } catch (err) {
        console.error("Buyer dashboard data error:", err);
        if (mounted) setError("Unable to load your auction activity. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();

    const notificationRefresh = setInterval(async () => {
      try {
        const bidsResponse = await API.get("/bids/user");
        if (mounted) {
          setBids(Array.isArray(bidsResponse.data) ? bidsResponse.data : []);
        }
      } catch (err) {
        console.error("Buyer notifications refresh error:", err);
      }
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(notificationRefresh);
    };
  }, [currentUser?.role, navigate]);

  const formatPrice = (amount) =>
    amount == null ? "Not available" : `₹${Number(amount).toLocaleString("en-IN")}`;

  const getAuctionTitle = (auction) => auction?.productId?.title || "Untitled auction";

  const getCurrentBid = (auction) =>
    auction?.highestBid > 0
      ? auction.highestBid
      : auction?.startingBid ?? auction?.reservePrice;

  const getImageUrl = (auction) => {
    const image = auction?.productId?.images?.[0];
    if (!image) return null;
    return image.startsWith("http")
      ? image
      : `http://localhost:5000/${image.replace(/^\/+/, "")}`;
  };

  const activeBids = [];
  const activeAuctionIds = new Set();
  bids.forEach((bid) => {
    const auction = bid.auctionId;
    const auctionId = auction?._id;
    if (auction?.status === "active" && auctionId && !activeAuctionIds.has(auctionId)) {
      activeAuctionIds.add(auctionId);
      activeBids.push(bid);
    }
  });

  const wonAuctions = [];
  const wonAuctionIds = new Set();
  bids.forEach((bid) => {
    const auction = bid.auctionId;
    const auctionId = auction?._id;
    if (bid.isWinningBid && auctionId && !wonAuctionIds.has(auctionId)) {
      wonAuctionIds.add(auctionId);
      wonAuctions.push({ auction, bid });
    }
  });

  const activeAuctions = auctions
    .filter((auction) => auction.status === "active")
    .sort((left, right) =>
      Number(Boolean(right.featured)) - Number(Boolean(left.featured)) ||
      new Date(right.createdAt || right.startTime || 0) -
        new Date(left.createdAt || left.startTime || 0)
    );
  const recommendedAuctions = activeAuctions
    .filter((auction) => !activeAuctionIds.has(auction._id))
    .slice(0, 3);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h1>AuctionX</h1>
        <ProfileGreeting user={currentUser} />
        <nav>
          <ul>
            <li><Link to="/auctions">Browse Auctions</Link></li>
            <li><a href="#my-bids">My Bids</a></li>
            <li><a href="#notifications">Notifications ({wonAuctions.length})</a></li>
          </ul>
        </nav>
        <LogoutButton />
      </header>

      {/* Welcome + Summary */}
      <section className="summary">
        <h2>Welcome back, {currentUser?.name || "Buyer"}</h2>
        <div className="summary-boxes">
          <div className="box">Active auctions bid on: {activeBids.length}</div>
          <div className="box">Auctions won: {wonAuctions.length}</div>
          <div className="box">Bids placed: {bids.length}</div>
        </div>
      </section>

      <section className="notifications" id="notifications" aria-label="Auction notifications">
        <h3>Notifications</h3>
        {wonAuctions.length === 0 ? (
          <p>No new auction wins.</p>
        ) : (
          wonAuctions.map(({ auction, bid }) => (
            <button
              className="notification-item"
              key={auction._id}
              type="button"
              onClick={() => setSelectedWonAuction({ auction, bid })}
            >
              Congratulations! You won {getAuctionTitle(auction)} for {formatPrice(bid.bidAmount)}.
              <span>View win details</span>
            </button>
          ))
        )}
      </section>

      {/* Panels */}
      <section className="panels">
        <div className="panel" id="my-bids">
          <h3>Your Active Bids</h3>
          {loading ? (
            <p>Loading your bids...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : activeBids.length === 0 ? (
            <p>You have no bids on active auctions.</p>
          ) : activeBids.map((bid) => (
            <div className="item" key={bid._id}>
              <div>
                <h4>{getAuctionTitle(bid.auctionId)}</h4>
                <p>Your bid: {formatPrice(bid.bidAmount)}</p>
                <p>Current bid: {formatPrice(getCurrentBid(bid.auctionId))}</p>
              </div>
              <button type="button" onClick={() => navigate(`/auctions/${bid.auctionId._id}`)}>
                Increase Bid
              </button>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Won Auctions</h3>
          {loading ? (
            <p>Loading won auctions...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : wonAuctions.length === 0 ? (
            <p>No won auctions yet.</p>
          ) : wonAuctions.map(({ auction, bid }) => (
            <div className="item" key={auction._id}>
              <div>
                <h4>{getAuctionTitle(auction)}</h4>
                <p>Winning bid: {formatPrice(bid.bidAmount)}</p>
              </div>
              <button type="button" onClick={() => navigate(`/auctions/${auction._id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Auctions */}
      <section className="recommended">
        <h3>Recommended Auctions</h3>
        {loading ? (
          <p>Loading active auctions...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : recommendedAuctions.length ? (
          <div className="auction-grid">
            {recommendedAuctions.map((auction) => (
            <div className="auction-card" key={auction._id}>
              {getImageUrl(auction) ? (
                <img className="image-placeholder" src={getImageUrl(auction)} alt={getAuctionTitle(auction)} />
              ) : (
                <div className="image-placeholder">No image available</div>
              )}
              <h4>{getAuctionTitle(auction)}</h4>
              <p>Current bid: {formatPrice(getCurrentBid(auction))}</p>
              <p>Ends: {auction.endTime ? new Date(auction.endTime).toLocaleString() : "Not specified"}</p>
              <button type="button" onClick={() => navigate(`/auctions/${auction._id}`)}>
                Place Bid
              </button>
            </div>
            ))}
          </div>
        ) : (
          <p>No other active auctions are available right now.</p>
        )}
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h3>Looking for something else?</h3>
        <p>Browse every active auction currently available.</p>
        <button className="cta" type="button" onClick={() => navigate("/auctions")}>
          Browse All Auctions
        </button>
      </section>

      {selectedWonAuction && (
        <div className="win-modal-backdrop" role="presentation">
          <section
            className="win-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="win-modal-title"
          >
            <button
              className="win-modal-close"
              type="button"
              aria-label="Close win details"
              onClick={() => setSelectedWonAuction(null)}
            >
              ×
            </button>
            <h2 id="win-modal-title">Congratulations! You won an auction!</h2>
            <p><strong>Item:</strong> {getAuctionTitle(selectedWonAuction.auction)}</p>
            <p><strong>Winning bid:</strong> {formatPrice(selectedWonAuction.bid.bidAmount)}</p>
            <p>
              <strong>Auction ended:</strong>{" "}
              {selectedWonAuction.auction.endTime
                ? new Date(selectedWonAuction.auction.endTime).toLocaleString()
                : "Not specified"}
            </p>
            <button
              type="button"
              onClick={() => {
                const auctionId = selectedWonAuction.auction._id;
                setSelectedWonAuction(null);
                navigate(`/auctions/${auctionId}`);
              }}
            >
              View Auction Details
            </button>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>© {new Date().getFullYear()} AuctionX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BuyerDashboard;
