import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./SellerDashboard.css";
import ProfileGreeting from "../ProfileGreeting";
import LogoutButton from "../LogoutButton";

const SellerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [listingsLoaded, setListingsLoaded] = useState(false);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [earnings, setEarnings] = useState({ monthly: null, total: null });
  const [messages, setMessages] = useState([]);
  const [auctionActionError, setAuctionActionError] = useState("");
  const [pendingAuctionAction, setPendingAuctionAction] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ title: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "seller") {
      navigate(currentUser.role === "buyer" ? "/dashboard" : "/login");
      return;
    }
  }, [currentUser, navigate]);

  // Load seller data
  useEffect(() => {
    if (!currentUser || currentUser.role !== "seller") return;

    API.get("/auctions/seller")
      .then(async (res) => {
        setActiveAuctions(res.data);
        const productsResponse = await API.get("/products/seller");
        setListings(productsResponse.data);
        setListingsLoaded(true);
      })
      .catch(console.error);
    API.get("/sales/earnings").then(res => setEarnings(res.data)).catch(console.error);
    API.get("/messages/seller").then(res => setMessages(res.data)).catch(console.error);

    const auctionRefresh = setInterval(() => {
      API.get("/auctions/seller")
        .then(async (auctionsRes) => {
          setActiveAuctions(auctionsRes.data);
          const productsRes = await API.get("/products/seller");
          setListings(productsRes.data);
          setListingsLoaded(true);
        })
        .catch(console.error);
    }, 10000);

    return () => clearInterval(auctionRefresh);
  }, []);

  const handleEdit = (item) => {
    setEditingProduct(item._id);
    setEditForm({ title: item.title });
  };

  const handleSave = async () => {
    try {
      await API.put(`/products/${editingProduct}`, editForm);

      const [productsRes, auctionsRes] = await Promise.all([
        API.get("/products/seller"),
        API.get("/auctions/seller")
      ]);

      setListings(productsRes.data);
      setListingsLoaded(true);
      setActiveAuctions(auctionsRes.data);
      setEditingProduct(null);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const getListingStatus = (product) => {
    const productAuction = activeAuctions.find((auction) => {
      const auctionProductId = auction.productId?._id || auction.productId;
      return auctionProductId?.toString() === product._id?.toString();
    });
    return productAuction?.status || "NA";
  };

  const displayValue = (value) => value == null || value === "" ? "NA" : value;
  const displayCurrency = (value) => value == null || value === "" ? "NA" : `$${value}`;

  const handleListingAuctionAction = async (productId, action) => {
    setPendingAuctionAction(productId);
    setAuctionActionError("");
    try {
      const auctionsResponse = await API.get("/auctions/seller");
      setActiveAuctions(auctionsResponse.data);
      const auction = auctionsResponse.data.find((item) => {
        const auctionProductId = item.productId?._id || item.productId;
        return auctionProductId?.toString() === productId && item.status === "active";
      });

      if (!auction) {
        const previousAuction = auctionsResponse.data.find((item) => {
          const auctionProductId = item.productId?._id || item.productId;
          return auctionProductId?.toString() === productId;
        });
        if (previousAuction?.status === "closed" && previousAuction.winningBid) {
          setAuctionActionError("This auction has already ended. The listing is sold to the highest bidder.");
        } else {
          setAuctionActionError("This listing has no active auction to end or cancel.");
        }
        setPendingAuctionAction(null);
        return;
      }

      await handleAuctionAction(auction._id, action);
    } catch (err) {
      console.error("Error finding listing auction:", err);
      setAuctionActionError(
        err.response?.data?.message || "Unable to load this listing's auction. Please try again."
      );
      setPendingAuctionAction(null);
    }
  };

  const handleAuctionAction = async (auctionId, action) => {
    setPendingAuctionAction(auctionId);
    setAuctionActionError("");
    try {
      await API.put(`/auctions/${auctionId}/${action}`);
      const [auctionsResponse, productsResponse] = await Promise.all([
        API.get("/auctions/seller"),
        API.get("/products/seller")
      ]);
      setActiveAuctions(auctionsResponse.data);
      setListings(productsResponse.data);
      setListingsLoaded(true);
    } catch (err) {
      const actionLabel = action === "close" ? "end" : action;
      console.error(`Error ${actionLabel}ing auction:`, err);
      setAuctionActionError(err.response?.data?.message || `Unable to ${actionLabel} this auction. Please try again.`);
    } finally {
      setPendingAuctionAction(null);
    }
  };

  return (
    <div className="seller-dashboard">
      {/* Header */}
      <header className="header">
        <h1>Seller Dashboard</h1>
        <ProfileGreeting user={currentUser} />
        <nav>
          <ul>
            <li>My Listings</li>
            <li>Sales Reports</li>
            <li>Messages</li>
          </ul>
        </nav>
        <LogoutButton />
      </header>

      {/* Summary */}
      <section className="summary">
        <div className="summary-box">
          Active Listings: {activeAuctions.length
            ? activeAuctions.filter((auction) => auction.status === "active").length
            : listingsLoaded && activeAuctions.length === 0
              ? 0
              : "NA"}
        </div>
        <div className="summary-box">Items Sold: NA</div>
        <div className="summary-box">Total Earnings: {displayCurrency(earnings.total)}</div>
      </section>

      {/* Add New Listing Button */}
      <section className="actions">
        <button className="add-listing-btn" onClick={() => navigate("/add-listing")}>
          ➕ Add New Listing
        </button>
      </section>

      {/* Listings */}
      <section className="listings">
        <h2>Your Listings</h2>
        {auctionActionError && <p role="alert">{auctionActionError}</p>}
        {listings.length === 0 ? (
          <p>No listings yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
          
<tbody>
  {listings.map((item) => (
    <tr key={item._id}>
      <td>{displayValue(item.title)}</td>
      <td>{getListingStatus(item)}</td>
      <td>
        <button type="button" onClick={() => handleEdit(item)}>Edit</button>
        <button
          type="button"
          disabled={pendingAuctionAction !== null}
          onClick={() => handleListingAuctionAction(item._id, "close")}
        >
          End Auction
        </button>
        <button
          type="button"
          disabled={pendingAuctionAction !== null}
          onClick={() => handleListingAuctionAction(item._id, "cancel")}
        >
          Cancel Auction
        </button>
      </td>
    </tr>
  ))}
</tbody>


          </table>
        )}
      </section>

      {/* Edit Form */}
      {editingProduct && (
        <section className="edit-form">
          <h2>Edit Product</h2>
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            placeholder="Title"
          />
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditingProduct(null)}>Cancel</button>
          </div>
        </section>
      )}

      {/* Active Auctions */}
      <section className="auctions">
  <h2>Active Auctions</h2>
  {activeAuctions.filter(a => a.status === "active").length === 0 ? (
    <p>No active auctions</p>
  ) : (
    activeAuctions
      .filter(a => a.status === "active")
      .map(a => (
        <div className="auction-card" key={a._id}>
          <h3>{displayValue(a.productId?.title)}</h3>
         
          <p>Status: {displayValue(a.status)}</p>

          <p>Highest Bid: {a.highestBid > 0 ? displayCurrency(a.highestBid) : "NA"}</p>

          <p>
            Ends: {a.endTime ? new Date(a.endTime).toLocaleString() : "NA"}
          </p>

          <button
            type="button"
            disabled={pendingAuctionAction === a._id}
            onClick={() => handleAuctionAction(a._id, "close")}
          >
            End
          </button>
          <button
            type="button"
            disabled={pendingAuctionAction === a._id}
            onClick={() => handleAuctionAction(a._id, "cancel")}
          >
            Cancel
          </button>
        </div>
      ))
  )}
</section>
      

      {/* Performance Stats */}
      <section className="stats">
        <h2>Performance Stats</h2>
        <div className="stat-box">Views: NA</div>
        <div className="stat-box">Bids: NA</div>
        <div className="stat-box">Conversion Rate: NA</div>
      </section>
      {/* Earnings Overview */}
      <section className="earnings">
        <h2>Earnings Overview</h2>
        <p>Monthly Earnings: {displayCurrency(earnings.monthly)}</p>
        <p>Total Payouts: {displayCurrency(earnings.total)}</p>
      </section>

      {/* Messages */}
      <section className="messages">
        <h2>Messages</h2>
        {messages.slice(0, 3).map(m => (
          <div className="message" key={m._id}>
            <strong>{displayValue(m.sender)}</strong>: {displayValue(m.text)}
          </div>
        ))}
        <button>View All Messages</button>
      </section>

        {/* Footer */}
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

  export default SellerDashboard;
