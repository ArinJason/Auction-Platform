import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">
          <Link to="/">Auction Platform</Link>
        </h1>

        <div className="flex items-center gap-6 text-lg">
          <Link className="hover:text-gray-200" to="/">
            Home
          </Link>

          <Link className="hover:text-gray-200" to="/products">
            Products
          </Link>

          <Link className="hover:text-gray-200" to="/auctions">
            Auctions
          </Link>

          <Link className="hover:text-gray-200" to="/my-bids">
            My Bids
          </Link>

          {!token ? (
            <>
              <Link className="hover:text-gray-200" to="/login">
                Login
              </Link>

              <Link
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                to="/register"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;