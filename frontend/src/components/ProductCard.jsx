import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-md p-4">

      <img
        src={product.image}
        alt={product.title}
        className="w-full h-52 object-cover rounded"
      />

      <h2 className="text-xl font-bold mt-3">
        {product.title}
      </h2>

      <p className="mt-2">
        {product.description}
      </p>

      <p className="mt-2 font-semibold text-blue-600">
        Starting Price : ₹{product.startingPrice}
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Seller : {product.sellerId?.name}
      </p>

      <Link
        to="/auctions"
        className="block mt-4 bg-blue-600 text-white text-center py-2 rounded"
      >
        View Auctions
      </Link>

    </div>
  );
}

export default ProductCard;