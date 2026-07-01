import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-3xl text-center">

        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to Auction Platform
        </h1>

        <p className="text-gray-600 mb-8">
          Buy, Sell and Bid on products through live auctions.
        </p>

        {user ? (
          <>
            <h2 className="text-2xl font-semibold mb-2">
              Hello, {user.name} 👋
            </h2>

            <p className="text-gray-500 mb-8">
              Role: <span className="font-semibold capitalize">{user.role}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Link
                to="/products"
                className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                View Products
              </Link>

              <Link
                to="/auctions"
                className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
              >
                View Auctions
              </Link>

              {user.role === "seller" && (
                <>
                  <Link
                    to="/add-product"
                    className="bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition"
                  >
                    Add Product
                  </Link>

                  <Link
                    to="/create-auction"
                    className="bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition"
                  >
                    Create Auction
                  </Link>
                </>
              )}

              <Link
                to="/my-bids"
                className="bg-red-500 text-white py-3 rounded hover:bg-red-600 transition"
              >
                My Bids
              </Link>

            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-8">
              Login or Register to start buying and selling.
            </p>

            <div className="flex justify-center gap-4">

              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
              >
                Register
              </Link>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Home;
