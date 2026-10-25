import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./BuyerDashboard.css";

const BuyerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [activeBids, setActiveBids] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
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

    API.get("/auctions")
      .then(res => setAuctions(res.data))
      .catch(err => console.error("Auctions error:", err));
  }, [currentUser, navigate]);

  // Load user bids (protected)
  useEffect(() => {
    API.get("/bids/user")
      .then(res => setActiveBids(res.data))
      .catch(err => console.error("Active bids error:", err));
  }, []);

  // Load won auctions (protected)
  useEffect(() => {
    API.get("/bids/user/won")
      .then(res => setWonAuctions(res.data))
      .catch(err => console.error("Won auctions error:", err));
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h1>AuctionX</h1>
        {currentUser?.name && <div className="header-user">Hi, {currentUser.name}</div>}
        <nav>
          <ul>
            <li>Browse Auctions</li>
            <li>My Bids</li>
            <li>Watchlist</li>
          </ul>
        </nav>
      </header>

      {/* Welcome + Summary */}
      <section className="summary">
        <h2>Welcome Back, Arin!</h2>
        <div className="summary-boxes">
          <div className="box">Bids Won: {wonAuctions.length}</div>
          <div className="box">Current Balance: $500.00</div>
        </div>
      </section>

      {/* Panels */}
      <section className="panels">
        <div className="panel">
          <h3>Your Active Bids</h3>
          {activeBids.length === 0 ? <p>No active bids</p> : activeBids.map(bid => (
            <div className="item" key={bid._id}>
              <p>{bid.auctionId?.productId?.name || "Auction"} — ${bid.bidAmount}</p>
              <button>Increase Bid</button>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Won Auctions</h3>
          {wonAuctions.length === 0 ? <p>No won auctions</p> : wonAuctions.map(auction => (
            <div className="item" key={auction._id}>
              <p>{auction.productId?.name || "Auction"} — ${auction.finalPrice}</p>
              <button>View Details</button>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Auctions */}
      <section className="recommended">
        <h3>Recommended Auctions</h3>
        <div className="auction-grid">
          {auctions.slice(0,3).map(auction => (
            <div className="auction-card" key={auction._id}>
              <div className="image-placeholder">Item Image</div>
              <h4>{auction.productId?.name || "Auction Item"}</h4>
              <p>Ends: {new Date(auction.endTime).toLocaleString()}</p>
              <button>Place Bid</button>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why">
        <h3>Why Choose Us?</h3>
        <ul>
          <li>Secure & Trusted Auctions</li>
          <li>Easy Bidding Process</li>
          <li>24/7 Customer Support</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h3>Get Started</h3>
        <p>Join now and start bidding today!</p>
        <button className="cta">Start Bidding</button>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 AuctionX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BuyerDashboard;

