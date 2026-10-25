import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddListing.css";
import LogoutButton from "../LogoutButton";
import { API_ORIGIN } from "../api";

const AddListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    auctionType: "",
    description: "",
    condition: "",
    quantity: 1,
    startingBid: "",
    buyNowPrice: "",
    reservePrice: "",
    bidIncrement: "",
    startTime: "",
    endTime: "",
    autoExtend: false,
    featured: false,
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Call backend API to create auction (not listings)
      const token = localStorage.getItem("token");
      await axios.post(`${API_ORIGIN}/api/auctions`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Listing created successfully!");
      navigate("/seller-dashboard"); // go back to dashboard
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create listing");
    }
  };

  return (
    <div className="add-listing">
      <header className="header">
        <h1>Add New Listing</h1>
        <nav>
          <ul>
            <li onClick={() => navigate("/seller-dashboard")}>Dashboard</li>
            <li>My Listings</li>
            <li>Sales Reports</li>
          </ul>
        </nav>
        <LogoutButton />
      </header>

      <form className="listing-form" onSubmit={handleSubmit}>
        <h2>Listing Information</h2>
        <label>Item Title</label>
        <input name="title" value={formData.title} onChange={handleChange} required />

        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="collectibles">Collectibles</option>
        </select>

        <label>Auction Type</label>
        <select name="auctionType" value={formData.auctionType} onChange={handleChange}>
          <option value="">Select Auction Type</option>
          <option value="standard">Standard</option>
          <option value="buy-now">Buy Now</option>
        </select>

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <h2>Item Details</h2>
        <label>Condition</label>
        <select name="condition" value={formData.condition} onChange={handleChange}>
          <option value="">Select Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>

        <label>Quantity</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />

        <h2>Pricing & Auction Settings</h2>
        <label>Starting Bid</label>
        <input type="number" name="startingBid" value={formData.startingBid} onChange={handleChange} required />

        <label>Buy Now Price</label>
        <input type="number" name="buyNowPrice" value={formData.buyNowPrice} onChange={handleChange} />

        <label>Reserve Price</label>
        <input type="number" name="reservePrice" value={formData.reservePrice} onChange={handleChange} />

        <label>Bid Increment</label>
        <input type="number" name="bidIncrement" value={formData.bidIncrement} onChange={handleChange} required />

        <label>Start Date & Time</label>
        <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} />

        <label>End Date & Time</label>
        <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} />

        <label>
          <input type="checkbox" name="autoExtend" checked={formData.autoExtend} onChange={handleChange} />
          Enable auto-extend
        </label>

        <label>
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
          Feature this listing
        </label>

        <button type="submit">Create Listing</button>
        {message && <p className="note">{message}</p>}
      </form>

      <footer>
        <ul>
          <li>About</li>
          <li>FAQ</li>
          <li>Contact</li>
          <li>Terms</li>
        </ul>
      </footer>
    </div>
  );
};

export default AddListing;
