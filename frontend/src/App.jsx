import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLanding from "./pages/PublicLanding";
import LoginRegister from "./pages/LoginRegister";
import Login from "./pages/Login";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AddListing from "./pages/AddListing"; 
import AuctionDetails from "./pages/AuctionDetails";
import BrowseAuctions from "./pages/BrowseAuctions";
import "./theme.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLanding />} />
        <Route path="/register" element={<LoginRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<BuyerDashboard />} />   {/* Buyer */}
        <Route path="/seller-dashboard" element={<SellerDashboard />} /> {/* Seller */}
        <Route path="/add-listing" element={<AddListing />} /> {/* Seller Add Listing */}
        <Route path="/auctions" element={<BrowseAuctions />} />
        <Route path="/auctions/:id" element={<AuctionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;


// import React, { useEffect, useState } from "react";
// import API from "./api";

// function App() {
//   const [auctions, setAuctions] = useState([]);

//   useEffect(() => {
//     API.get("/auctions")
//       .then(res => setAuctions(res.data))
//       .catch(err => console.error("Error fetching auctions:", err));
//   }, []);

//   return (
//     <div style={{ padding: "2rem", fontFamily: "Arial" }}>
//       <h1>All Auctions</h1>
//       {auctions.length === 0 ? (
//         <p>No auctions found.</p>
//       ) : (
//         <ul>
//           {auctions.map(a => (
//             <li key={a._id} style={{ marginBottom: "1rem" }}>
//               <strong>{a.productId?.name || "Auction Item"}</strong><br />
//               Type: {a.auctionType}<br />
//               Reserve Price: ${a.reservePrice}<br />
//               Status: {a.status}<br />
//               Ends: {new Date(a.endTime).toLocaleString()}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default App;

