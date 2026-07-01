import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Auctions from "./pages/Auctions";
import CreateAuction from "./pages/CreateAuction";
import Bid from "./pages/Bid";
import MyBids from "./pages/MyBids";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/auctions"
          element={
            <PrivateRoute>
              <Auctions />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-auction"
          element={
            <PrivateRoute>
              <CreateAuction />
            </PrivateRoute>
          }
        />

        <Route
          path="/bid/:auctionId"
          element={
            <PrivateRoute>
              <Bid />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-bids"
          element={
            <PrivateRoute>
              <MyBids />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;